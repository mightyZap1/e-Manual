import { defineConfig } from 'vitepress'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItMultimdTable from 'markdown-it-multimd-table';
import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token';
import type StateCore from 'markdown-it/lib/rules_core/state_core';

// 셀의 내용을 저장하기 위한 인터페이스
interface CellData {
  content: string;
  rowspan: number;
  colspan: number;
  isMerged: boolean;
  // 셀 내부의 복잡한 마크다운을 렌더링하기 위해 원본 content를 유지
  originalContent: string; 
}

/**
 * [최종 해결 버전] 토큰을 직접 수정하는 대신, 새로운 HTML을 생성하여 교체하는 안정적인 방식의 플러그인
 */
const advancedTablePlugin = (md: MarkdownIt) => {
  md.core.ruler.after('inline', 'advanced_table_merger', (state: StateCore) => {
    const tokens: Token[] = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'table_open') {
        continue;
      }

      let tableEndIdx = -1;
      for (let j = i + 1; j < tokens.length; j++) {
        if (tokens[j].type === 'table_close' && tokens[j].level === tokens[i].level) {
          tableEndIdx = j;
          break;
        }
      }
      if (tableEndIdx === -1) continue;

      try {
        const headerMatrix: CellData[][] = [];
        const bodyMatrix: CellData[][] = [];
        
        let currentMatrixRef: CellData[][] | null = null;
        let currentRowRef: CellData[] | null = null;

        // 1. 테이블 토큰을 분석하여 headerMatrix와 bodyMatrix를 생성합니다.
        for (let j = i + 1; j < tableEndIdx; j++) {
            const token = tokens[j];
            if (token.type === 'thead_open') currentMatrixRef = headerMatrix;
            if (token.type === 'tbody_open') currentMatrixRef = bodyMatrix;

            if (token.type === 'tr_open') currentRowRef = [];
            
            if (token.type === 'tr_close' && currentRowRef && currentMatrixRef) {
                currentMatrixRef.push(currentRowRef);
                currentRowRef = null;
            }

            if ((token.type === 'th_open' || token.type === 'td_open') && currentRowRef) {
                const inlineToken = tokens[j + 1];
                if (inlineToken && inlineToken.type === 'inline') {
                  const content = inlineToken.content || '';
                  currentRowRef.push({
                      content: content.trim(),
                      originalContent: content, // 원본 내용 보존
                      rowspan: 1,
                      colspan: 1,
                      isMerged: false,
                  });
                }
            }
        }
        
        // 2. 헤더와 본문 매트릭스에 대해 각각 병합 계산을 수행합니다.
        [headerMatrix, bodyMatrix].forEach(matrix => {
          if (matrix.length === 0) return;

          // 수평 병합('<')
          for (let r = 0; r < matrix.length; r++) {
            for (let c = matrix[r].length - 2; c >= 0; c--) {
              const currentCell = matrix[r][c];
              const nextCell = matrix[r][c + 1];
              if (currentCell && nextCell && nextCell.content === '<') {
                currentCell.colspan += nextCell.colspan;
                nextCell.isMerged = true;
              }
            }
          }
          
          // 수직 병합('^')
          for (let r = matrix.length - 2; r >= 0; r--) {
            let currentColIdx = 0;
            for (const currentCell of matrix[r]) {
              if (currentCell.isMerged) {
                currentColIdx += currentCell.colspan;
                continue;
              }
              let nextRowColIdx = 0;
              let nextCell: CellData | undefined;
              if (matrix[r + 1]) {
                for (const cell of matrix[r + 1]) {
                  if (nextRowColIdx === currentColIdx) {
                    nextCell = cell;
                    break;
                  }
                  nextRowColIdx += cell.colspan;
                }
              }
              if (nextCell && nextCell.content === '^' && currentCell.colspan === nextCell.colspan) {
                currentCell.rowspan += nextCell.rowspan;
                nextCell.isMerged = true;
              }
              currentColIdx += currentCell.colspan;
            }
          }
        });

        // 3. 계산된 matrix를 기반으로 새로운 HTML 문자열을 생성합니다.
        let html = `<table>`;
        
        // 헤더 렌더링
        html += '<thead>';
        headerMatrix.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                if (!cell.isMerged) {
                    let attrs = '';
                    if (cell.rowspan > 1) attrs += ` rowspan="${cell.rowspan}"`;
                    if (cell.colspan > 1) attrs += ` colspan="${cell.colspan}"`;
                    
                    const cleanContent = (cell.content === '<' || cell.content === '^') ? '' : cell.originalContent;
                    const renderedContent = md.renderInline(cleanContent);

                    html += `<th${attrs}>${renderedContent}</th>`;
                }
            });
            html += '</tr>';
        });
        html += '</thead>';

        // 본문 렌더링
        html += '<tbody>';
        bodyMatrix.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                if (!cell.isMerged) {
                    let attrs = '';
                    if (cell.rowspan > 1) attrs += ` rowspan="${cell.rowspan}"`;
                    if (cell.colspan > 1) attrs += ` colspan="${cell.colspan}"`;
                    
                    const cleanContent = (cell.content === '<' || cell.content === '^') ? '' : cell.originalContent;
                    const renderedContent = md.renderInline(cleanContent);

                    html += `<td${attrs}>${renderedContent}</td>`;
                }
            });
            html += '</tr>';
        });
        html += '</tbody>';
        html += '</table>';

        // 4. 기존 테이블 토큰들을 새로 생성한 HTML 토큰 하나로 교체합니다.
        const newHtmlToken = new state.Token('html_block', '', 0);
        newHtmlToken.content = html;
        
        tokens.splice(i, tableEndIdx - i + 1, newHtmlToken);
        
      } catch (e) {
        console.error('[VitePress advanced-table-plugin] 테이블 처리 중 오류 발생:', e);
        i = tableEndIdx; // 오류 발생 시 이 테이블은 건너뜁니다.
      }
    }
  });
};
/**
 * Obsidian의 PDF 임베드 문법 ![[file.pdf]]를
 * PDF.js 뷰어를 사용하는 <iframe>으로 변환하는 markdown-it 플러그인
 */
function obsidianPdfEmbedWithViewer(md) {
  const rule = (state, startLine, endLine, silent) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const line = state.src.slice(pos, max).trim();

    // 정규식: ![[파일명.pdf]] 형태를 찾음
    const regex = /^!\[\[([^|\]]+\.pdf)\]\]$/;
    const match = line.match(regex);

    if (!match) {
      return false;
    }

    if (silent) {
      return true;
    }

    const pdfPath = match[1];

    // PDF.js 뷰어의 경로를 생성
    // viewer.html에 'file' 파라미터로 PDF 파일의 절대 경로를 전달
    const viewerPath = `/pdfjs/web/viewer.html?file=/${pdfPath}`;

    // 토큰을 생성하여 HTML 블록(<iframe>)으로 교체
    const token = state.push('html_block', '', 0);
    token.content = `<iframe src="${viewerPath}" width="100%" height="800px" style="border: 1px solid #ccc;"></iframe>\n`;

    state.line = startLine + 1;
    return true;
  };

  md.block.ruler.before('paragraph', 'obsidian_pdf_embed_viewer', rule);
}

export default defineConfig({
  title: "e-Manual",
  description: "migntyZAP e-Manual",
  markdown: {
    config: (md) => {
      md.use(markdownItAttrs);
      // 위에서 만든 커스텀 플러그인을 사용하도록 등록
      md.use(obsidianPdfEmbedWithViewer);
      // md.use(markdownItMultimdTable, { rowspan: true });
      md.use(advancedTablePlugin);
    }
  },
  themeConfig:{
    search: {
      provider: 'local',     
      // options:{
      //   exclude :['./'];
      // }     
    },
  },
  locales: {
    // --- 한국어 설정 ---
    root: {
      lang: 'ko-KR',
      label: '한국어',
      description: '제품 관련 기술 문서입니다.',
      themeConfig: {
        // --- 한국어 NAV ---
        outline: {
          level: 'deep' // h2와 h3 헤더를 목차에 표시
        },
        // 로컬 검색 활성화
        nav: [
          { text: 'HOME', link: '/' },
          { text: 'Actuator', link: '/actuator/' },          
          { text: 'Software', link: '/software/' },
          { text: 'Accessores', link: '/accessories_etc/' },
        ],
        // --- 한국어 SIDEBAR ---
        sidebar: {
          '/actuator/': [
            {//MIni12Lf
              text: 'Mini 12Lf',
              collapsed: true,
              link:'/actuator/Mini12Lf',
              items: [
                {
                  text: 'Manual',
                  collapsed: true,
                  items: [
                    { text: 'IR Protocol', link: '/actuator/Mini12Lf/Manual/12Lf IR Protocol' },
                    { text: 'Modbus RTU', link: '/actuator/Mini12Lf/Manual/12Lf Modbus RTU_kor' },
                    { text: 'User Manual', link: '/actuator/Mini12Lf/Manual/mightyZAP 12Lf User Manual' },                    
                  ]
                },
                {
                  text: 'Catalogue',
                  collapsed: true,
                  items: [
                    { text: 'Catalogue', link: '/actuator/Mini12Lf/Catalogue/catalogue' }
                  ]
                },   
                {
                  text: 'Firmware',
                  collapsed: true,
                  items: [
                    { text: '펌웨어 업데이트', link: '/actuator/Mini12Lf/firmware/firmware' },                    
                  ]
                },
                {
                  text: 'Drawings',
                  collapsed: true,
                  items: [
                    { text: '12Lf-xx-27', link: '/actuator/Mini12Lf/Drawings/12Lf-xx-27 Drawings' },
                    { text: '12Lf-xx-40', link: '/actuator/Mini12Lf/Drawings/12Lf-xx-40 Drawings' },
                    { text: '12Lf-xx-53', link: '/actuator/Mini12Lf/Drawings/12Lf-xx-53 Drawings' },
                    { text: '12Lf-xx-90', link: '/actuator/Mini12Lf/Drawings/12Lf-xx-90 Drawings' }
                  ]
                },
                {
                  text: 'Datasheet',
                  collapsed: true,
                  items: [
                    { text: '12Lf-xxPT-27', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-27' },
                    { text: '12Lf-xxPT-40', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-40' },
                    { text: '12Lf-xxPT-53', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-53' },
                    { text: '12Lf-xxPT-90', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-90' },
                    { text: '12Lf-xxF-27', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-27' },
                    { text: '12Lf-xxF-40', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-40' },
                    { text: '12Lf-xxF-53', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-53' },
                    { text: '12Lf-xxF-90', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-90' }
                  ]
                }
              ]
            },            
            {//Mini17L
              text: 'Mini 17Lf',
              collapsed: false,
              link:'/actuator/Mini17Lf',
              items: [
                {
                  text: 'Datasheet',
                  collapsed: true,
                  items: [
                    { text: '17Lf-xx-27', link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-27' },
                    { text: '17Lf-xx-37', link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-37' },
                    { text: '17Lf-xx-50', link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-50' },
                    { text: '17Lf-xx-87', link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-87' },                    
                  ]
                },
                {
                  text: 'Drawings',
                  collapsed: true,
                  items: [
                    { text: '17Lf-xx-27', link: '/actuator/Mini17Lf/Drawing/17Lf-xx-27 Drawings' },
                    { text: '17Lf-xx-37', link: '/actuator/Mini17Lf/Drawing/17Lf-xx-37 Drawings' },
                    { text: '17Lf-xx-50', link: '/actuator/Mini17Lf/Drawing/17Lf-xx-50 Drawings' },
                    { text: '17Lf-xx-87', link: '/actuator/Mini17Lf/Drawing/17Lf-xx-87 Drawings' },  
                  ]
                },                
                {
                  text: 'Catalogue',
                  collapsed: true,
                  items: [
                    { text: 'Catalogue', link: '/actuator/Mini17Lf/Catalogue/catalogue' }
                  ]
                },
                {
                  text: 'Manual',
                  collapsed: true,
                  items: [
                    { text: 'Modbus RTU', link: '/actuator/Mini17Lf/Manual/17Lf Modbus RTU_kor' }, 
                    { text: 'User Manual', link: '/actuator/Mini17Lf/Manual/mightyZAP 17Lf User Manual_kor' }, 
                  ]
                },
                {
                  text: 'firmware',
                  collapsed: true,
                  items: [
                    { text: '펌웨어 업데이트', link: '/actuator/Mini17Lf/firmware/firmware' },                    
                  ]
                },
              ]
            },
            {//D7D12
              text: 'D7, D12, L12 Series',
              collapsed: true,              
              items: [
                {
                  text: 'Datasheet',
                  collapsed: true,
                  items: [
                    { text: 'L12-xxPT-3', link: '/actuator/D7D12L12/Datasheet/L12-xxPT-3' },
                    { text: 'L12-xxPT-4', link: '/actuator/D7D12L12/Datasheet/L12-xxPT-4' },
                    { text: 'L12-xxPT-6', link: '/actuator/D7D12L12/Datasheet/L12-xxPT-6' },
                    { text: 'L12-xxPT-10', link: '/actuator/D7D12L12/Datasheet/L12-xxPT-10' },
                    { text: 'L12-xxF-3', link: '/actuator/D7D12L12/Datasheet/L12-xxF-3' },
                    { text: 'L12-xxF-4', link: '/actuator/D7D12L12/Datasheet/L12-xxF-4' },
                    { text: 'L12-xxF-6', link: '/actuator/D7D12L12/Datasheet/L12-xxF-6' },
                    { text: 'L12-xxF-10', link: '/actuator/D7D12L12/Datasheet/L12-xxF-10' }
                  ]
                },
                {
                  text: 'Drawings',
                  collapsed: true,
                  items: [
                    { text: 'D7D12-xx-3', link: '/actuator/D7D12L12/Drawings/D7D12-xx-3 Drawings' },
                    { text: 'L12-xx-3', link: '/actuator/D7D12L12/Drawings/L12-xx-3 Drawings' },
                    { text: 'L12-xx-4', link: '/actuator/D7D12L12/Drawings/L12-xx-4 Drawings' },
                    { text: 'L12-xx-6', link: '/actuator/D7D12L12/Drawings/L12-xx-6 Drawings' },
                    { text: 'L12-xx-10', link: '/actuator/D7D12L12/Drawings/L12-xx-10 Drawings' }
                  ]
                },
                {
                  text: 'Catalogue',
                  collapsed: true,
                  items: [
                    { text: 'Catalogue', link: '/actuator/D7D12L12/Catalogue/catalogue' }
                  ]
                },
                {
                  text: 'Manual',
                  collapsed: true,
                  items: [                    
                    { text: 'User Manual', link: '/actuator/D7D12L12/Manual/Usermanual' },
                    { text: 'Life cycle', link: '/actuator/D7D12L12/Manual/lifecycle' },
                  ]
                },
                {
                  text: 'firmware',
                  collapsed: true,
                  items: [
                    { text: '펌웨어 업데이트', link: '/actuator/D7D12L12/firmware/firmware' },                    
                  ]
                }
                
              ]
            }
          ],          
          '/software/': [
            {
              text: 'Total Manager',
              collapsed: true,
              items: [
                { text: 'User Manual', link: '/software/TotalManager/Total Manager User Manual_kor' }
              ]
            }
          ],
          '/accessories_etc/': [
            {
              text: 'EZ Controller',
              collapsed: true,
              items: [
                    { text: 'User Manual', link: '/accessories_etc/board/EZ Controller User Manual' },                                                              
              ]
            },
            {
              text: 'etc',
              collapsed: true,
              items: [
                    { text: '소음 저감 Tip', link: '/accessories_etc/etc/소음 저감 Tip' },
                    { text: '제품 설치 방법(26_27mm)', link: '/accessories_etc/etc/제품 설치 방법(26_27mm)' },
                    { text: '제품 설치 방법(40_96mm)', link: '/accessories_etc/etc/제품 설치 방법(40_96mm)' },
                    { text: '컨트롤러별mightyZAP 결선도', link: '/accessories_etc/etc/컨트롤러별mightyZAP 결선도' },
              ]
            }
          ]
        }
      },      
    },

    // --- 영어 설정 ---
    en: {
      lang: 'en-US',
      label: 'English',
      description: 'Technical documentation for our products.',
      themeConfig: {
        // --- 영어 NAV ---
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Actuator', link: '/en/actuator/Mini-12Lf/Datasheet/12Lf-xxF-27_eng' },
          { text: 'Boards', link: '/en/Boards/Ez-Controller' },
          { text: 'Software', link: '/en/Software/Total-Manager/Manual/Total-Manager-User-Manual' }
        ],
        // --- 영어 SIDEBAR ---
        sidebar: {
          '/en/actuator/': [
            {
              text: 'Mini 12Lf',
              collapsed: false,
              items: [
                {
                  text: 'Datasheet',
                  items: [
                    { text: '12Lf-xxPT-27', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-27' },
                    { text: '12Lf-xxPT-40', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-40' },
                    { text: '12Lf-xxPT-53', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-53' },
                    { text: '12Lf-xxPT-90', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-90' },
                    { text: '12Lf-xxF-27', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-27' },
                    { text: '12Lf-xxF-40', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-40' },
                    { text: '12Lf-xxF-53', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-53' },
                    { text: '12Lf-xxF-90', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-90' }
                  ]
                },
                {
                  text: 'Drawings',
                  collapsed: true,
                  items: [
                    { text: '12Lf-xx-27', link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-27 Drawings' },
                    { text: '12Lf-xx-40', link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-40 Drawings' },
                    { text: '12Lf-xx-53', link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-53 Drawings' },
                    { text: '12Lf-xx-90', link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-90 Drawings' }
                  ]
                },
                {
                  text: 'Manual',
                  items: [
                    { text: '12Lf IR Protocol', link: '/en/actuator/Mini12Lf/Manual/12Lf IR Protocol' },
                    { text: '12Lf Modbus RTU', link: '/en/actuator/Mini12Lf/Manual/12Lf Modbus RTU' },
                    { text: 'Manual', link: '/en/actuator/Mini12Lf/Manual/mightyZAP 12Lf User Manual' },
                    { text: 'Life cycle', link: '/en/actuator/Mini12Lf/Manual/lifecycle' },
                  ]
                }
              ]
            },
            {
              text: 'Mini 17Lf',
              collapsed: false,
              items: [
                {
                  text: 'Datasheet',
                  collapsed: true,
                  items: [
                    { text: '17Lf-xx-27', link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-27' },
                    { text: '17Lf-xx-37', link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-37' },
                    { text: '17Lf-xx-50', link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-50' },
                    { text: '17Lf-xx-87', link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-87' },                    
                  ]
                },
                {
                  text: 'Drawings',
                  collapsed: true,
                  items: [
                    { text: '17Lf-xx-27', link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-27 Drawings' },
                    { text: '17Lf-xx-37', link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-37 Drawings' },
                    { text: '17Lf-xx-50', link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-50 Drawings' },
                    { text: '17Lf-xx-87', link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-87 Drawings' },  
                  ]
                },
                {
                  text: 'Manual',
                  collapsed: true,
                  items: [
                    { text: '17Lf Modbus RTU', link: '/en/actuator/Mini17Lf/Manual/17Lf Modbus RTU_eng' }, 
                    { text: 'mightyZAP 17Lf User Manual', link: '/en/actuator/Mini17Lf/Manual/mightyZAP 17Lf User Manual_eng' }, 
                  ]
                }
              ]
            }
          ],
          '/en/Accessories/': [
            {
              text: 'Accessories',
              items: [
                { text: 'IR-MB07 Drawings', link: '/en/Accessories/[IR-MB07]-Metal-Bracket-drawings' },
                { text: 'IR-MB06 Drawings', link: '/en/Accessories/[IR-MB06]-Metal-Bracket-drawings' }
              ]
            }
          ],
          '/en/Software/': [
            {
              text: 'Total Manager',
              items: [
                { text: 'User Manual', link: '/en/Software/Total-Manager/Manual/Total-Manager-User-Manual' }
              ]
            }
          ]
        }
      }
    }
  }
  
})
