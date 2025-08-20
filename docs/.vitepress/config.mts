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
// ==================================================================
// ✨ 올인원 커스텀 플러그인: GitHub 스타일 Alert + 내부 링크 변환
// ==================================================================
function customAlertsAndLinksPlugin(md: MarkdownIt) {
  // --- 내부 링크 변환에 필요한 함수들 ---
  const slugify = (text: string) => {
    const normalizedText = text.normalize('NFD'); // NFD 방식으로 정규화
    return normalizedText
      .toLowerCase().trim()
      .replace(/[\s.]+/g, '-')
      .replace(/[^\w\p{L}\-]/gu, '');
  };

  const convertInternalLinks = (text: string) => {
    const pattern = /\[\[#([^\]]+)\]\]/g; // 모든 링크를 찾기 위해 g 플래그 추가
    return text.replace(pattern, (match, content) => {
      const headingText = content.trim();
      const headingId = slugify(headingText);
      return `<a href="#_${headingId}">${headingText}</a>`;
    });
  };

  // --- 블록 규칙 정의 ---
  const rule = (state, startLine, endLine, silent) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const line = state.src.slice(pos, max);

    // '> [!type] Title' 형태인지 확인
    const alertRegex = /^>\s*\[!(\w+)\]\s*(.*)$/;
    const match = line.match(alertRegex);

    if (!match) {
      return false;
    }

    if (silent) {
      return true;
    }

    const type = match[1].toLowerCase();
    const title = match[2].trim();
    const contentLines = [];
    let nextLine = startLine + 1;

    // 블록이 끝날 때까지 내용 수집
    for (; nextLine < endLine; nextLine++) {
      const linePos = state.bMarks[nextLine] + state.tShift[nextLine];
      const lineMax = state.eMarks[nextLine];
      let lineText = state.src.slice(linePos, lineMax);

      if (lineText.trim() === '') {
        // 빈 줄이면 블록 끝으로 간주
        break;
      }
      
      // 인용문 표시(>) 제거
      if (lineText.startsWith('>')) {
        lineText = lineText.slice(1).trim();
      }
      contentLines.push(lineText);
    }

    // 수집된 내용에서 [[#...]] 링크 변환
    let content = contentLines.join('\n');
    content = convertInternalLinks(content);
    
    // 변환된 내용을 다시 마크다운으로 렌더링
    const renderedContent = md.render(content);

    // 최종 HTML 토큰 생성
    const token = state.push('html_block', '', 0);
    token.content =
      `<div class="custom-block ${type}">\n` +
      `<p class="custom-block-title">${title}</p>\n` +
      `${renderedContent}` +
      `</div>\n`;

    state.line = nextLine;
    return true;
  };

  // 기존 blockquote 규칙보다 먼저 이 규칙을 실행하도록 등록
  md.block.ruler.before('blockquote', 'custom_alerts', rule);
}
// ==================================================================
// ✨ [[#...]] 내부 링크를 처리하는 수정된 커스텀 플러그인
// ==================================================================
function internalLinksPlugin(md) {
  const slugify = (text) => {
    // ⬇️ 이 부분이 핵심입니다. 문자열을 NFD 형식으로 강제 정규화합니다.
    const normalizedText = text.normalize('NFD');

    return normalizedText
      .toLowerCase()
      .trim()
      .replace(/[\s.]+/g, '-') // 공백과 마침표를 하이픈으로
      .replace(/[^\w\p{L}\-]/gu, ''); // 단어, 모든 언어 문자, 하이픈 외 제거
  };

  function wikilinkReplacer(state, silent) {
    const src = state.src;
    const pos = state.pos;

    if (src.substring(pos, pos + 3) !== '[[#') {
      return false;
    }
    const endPos = src.indexOf(']]', pos);
    if (endPos === -1) {
      return false;
    }

    const content = src.substring(pos + 3, endPos);

    if (!silent) {
      const token = state.push('link_open', 'a', 1);
      token.attrSet('href', '#_' + slugify(content));

      const textToken = state.push('text', '', 0);
      textToken.content = content;

      state.push('link_close', 'a', -1);
    }

    state.pos = endPos + 2;
    return true;
  }

  md.inline.ruler.after('emphasis', 'internal_link', wikilinkReplacer);
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
  lastUpdated: true,
  head:[
    // KaTeX CSS
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js' }],
    ['script',{ src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }]
  ],
  title: "e-Manual",
  description: "migntyZAP e-Manual",
  markdown: {
    config: (md) => {
      md.use(markdownItAttrs);
      md.use(customAlertsAndLinksPlugin);
      // 위에서 만든 커스텀 플러그인을 사용하도록 등록
      md.use(internalLinksPlugin); 
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
          { 
            text: 'Actuator', 
            items: [            
              { text: '12Lf Series', link: '/actuator/Mini12Lf/' },
              { text: '17Lf Series', link: '/actuator/Mini17Lf/' },
              { text: 'D7,D12,L12', link: '/actuator/D7D12L12/' },
              { text: 'Limit Switch', link: '/actuator/limitSwitch/' },
            ]
          },          
          { text: 'Software', 
            items : [
              { text: 'Total Manager', link: '/software/TotalManager/' },
            ]
          },
          { text: 'Accessores', 
            items : [
              {text : 'Board', 
                items:[
                  {text:"- EZ Controller",link: '/accessories/board/EZController/' },
                  {text:"- USB Interface",link: '/accessories/board/USBInterface/' },
                  {text:"- UART Interface",link: '/accessories/board/UartInterfaceboard/' },
              ]},             
              {text : 'Mount', link: '/accessories/Mounting/' },
              {text : 'Wire', link: '/accessories/wire/' },
              {text : 'Rodend Tips', link: '/accessories/RodendTips/' },
            ]
          },
          {
            text :"mightyZAP Home",
            link : "http://mightyzap.com/ko/"
          }
        ],
        // --- 한국어 SIDEBAR ---
        sidebar: {
          '/actuator/Mini12Lf/': [
            {text:'12Lf Series'},
            {
              text: 'Manual',
              collapsed: true,
              items: [
                { text: 'IR Protocol', link: '/actuator/Mini12Lf/Manual/12Lf_IRProtocol' },
                { text: 'Modbus RTU', link: '/actuator/Mini12Lf/Manual/12Lf_ModbusRTU' },
                { text: 'User Manual', link: '/actuator/Mini12Lf/Manual/12Lf_Manual' },                    
              ]
            },
            {
              text: 'Catalogue',
              collapsed: true,
              items: [
                { text: 'Catalogue', link: '/actuator/Mini12Lf/Catalogue/12Lf_Catalogue' }
              ]
            },   
            {
              text: 'Firmware',
              collapsed: true,
              items: [
                { text: '펌웨어 업데이트', link: '/actuator/Mini12Lf/firmware/12Lf_firmware' },                    
              ]
            },
            {
              text: 'Drawings',
              collapsed: true,
              items: [
                { text: '12Lf-xx-27', link: '/actuator/Mini12Lf/Drawings/12Lf-xx-27_Drawings' },
                { text: '12Lf-xx-40', link: '/actuator/Mini12Lf/Drawings/12Lf-xx-40_Drawings' },
                { text: '12Lf-xx-53', link: '/actuator/Mini12Lf/Drawings/12Lf-xx-53_Drawings' },
                { text: '12Lf-xx-90', link: '/actuator/Mini12Lf/Drawings/12Lf-xx-90_Drawings' }
              ]
            },
            {
              text: 'Datasheet',
              collapsed: true,
              items: [
                { text: '12Lf-xxPT-27', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-27_Datasheet' },
                { text: '12Lf-xxPT-40', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-40_Datasheet' },
                { text: '12Lf-xxPT-53', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-53_Datasheet' },
                { text: '12Lf-xxPT-90', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-90_Datasheet' },
                { text: '12Lf-xxF-27', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-27_Datasheet'},
                { text: '12Lf-xxF-40', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-40_Datasheet'},
                { text: '12Lf-xxF-53', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-53_Datasheet'},
                { text: '12Lf-xxF-90', link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-90_Datasheet'}
              ]
            }, 
          ],      
          '/actuator/Mini17Lf/': [    
            {text:'17Lf Series'},            
            {//
              text: 'Datasheet',
              collapsed: true,
              items: [
                { text: '17Lf-xx-27', link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-27_Datasheet' },
                { text: '17Lf-xx-37', link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-37_Datasheet' },
                { text: '17Lf-xx-50', link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-50_Datasheet' },
                { text: '17Lf-xx-87', link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-87_Datasheet' },                    
              ]
            },
            {
              text: 'Drawings',
              collapsed: true,
              items: [
                { text: '17Lf-xx-27', link: '/actuator/Mini17Lf/Drawing/17Lf-xx-27_Drawings' },
                { text: '17Lf-xx-37', link: '/actuator/Mini17Lf/Drawing/17Lf-xx-37_Drawings' },
                { text: '17Lf-xx-50', link: '/actuator/Mini17Lf/Drawing/17Lf-xx-50_Drawings' },
                { text: '17Lf-xx-87', link: '/actuator/Mini17Lf/Drawing/17Lf-xx-87_Drawings' },  
              ]
            },                
            {
              text: 'Catalogue',
              collapsed: true,
              items: [
                { text: 'Catalogue', link: '/actuator/Mini17Lf/Catalogue/17Lf_Catalogue' }
              ]
            },
            {
              text: 'Manual',
              collapsed: true,
              items: [
                { text: 'Modbus RTU', link: '/actuator/Mini17Lf/Manual/17Lf_ModbusRTU' }, 
                { text: 'User Manual', link: '/actuator/Mini17Lf/Manual/17Lf_Manual' }, 
              ]
            },
            {
              text: 'firmware',
              collapsed: true,
              items: [
                { text: '펌웨어 업데이트', link: '/actuator/Mini17Lf/firmware/17Lf_firmware' },                    
              ]
            }
          ],
          '/actuator/D7D12L12/': [  
            {text:'D7 D12 L12 Series'},              
            {//D7D12
              text: 'Datasheet',
              collapsed: true,
              items: [
                { text: 'L12-xxPT-3', link: '/actuator/D7D12L12/Datasheet/L12-xxPT-3_Datasheet' },
                { text: 'L12-xxPT-4', link: '/actuator/D7D12L12/Datasheet/L12-xxPT-4_Datasheet' },
                { text: 'L12-xxPT-6', link: '/actuator/D7D12L12/Datasheet/L12-xxPT-6_Datasheet' },
                { text: 'L12-xxPT-10', link: '/actuator/D7D12L12/Datasheet/L12-xxPT-10_Datasheet' },
                { text: 'L12-xxF-3', link: '/actuator/D7D12L12/Datasheet/L12-xxF-3_Datasheet'},
                { text: 'L12-xxF-4', link: '/actuator/D7D12L12/Datasheet/L12-xxF-4_Datasheet'},
                { text: 'L12-xxF-6', link: '/actuator/D7D12L12/Datasheet/L12-xxF-6_Datasheet'},
                { text: 'L12-xxF-10', link: '/actuator/D7D12L12/Datasheet/L12-xxF-10_Datasheet' }
              ]
            },
            {
              text: 'Drawings',
              collapsed: true,
              items: [
                { text: 'D7D12-xx-3', link: '/actuator/D7D12L12/Drawings/D7D12-xx-3_Drawings' },
                { text: 'L12-xx-3', link: '/actuator/D7D12L12/Drawings/L12-xx-3_Drawings' },
                { text: 'L12-xx-4', link: '/actuator/D7D12L12/Drawings/L12-xx-4_Drawings' },
                { text: 'L12-xx-6', link: '/actuator/D7D12L12/Drawings/L12-xx-6_Drawings' },
                { text: 'L12-xx-10', link: '/actuator/D7D12L12/Drawings/L12-xx-10_Drawings' }
              ]
            },
            {
              text: 'Catalogue',
              collapsed: true,
              items: [
                { text: 'Catalogue', link: '/actuator/D7D12L12/Catalogue/D7D12L12_Catalogue' }
              ]
            },
            {
              text: 'Manual',
              collapsed: true,
              items: [                    
                { text: 'User Manual', link: '/actuator/D7D12L12/Manual/D7D12L12_manual' },
                { text: 'Life cycle', link: '/actuator/D7D12L12/Manual/D7D12L12_lifecycle' },
              ]
            },
            {
              text: 'firmware',
              collapsed: true,
              items: [
                { text: '펌웨어 업데이트', link: '/actuator/D7D12L12/firmware/D7D12L12_firmware' },                    
              ]
            },
          ],
          '/actuator/limitSwitch/': [  
            {text:'Switch Series'},    
            {
              text: 'Datasheet',
              collapsed: true,
              items: [
                { text: 'limitSwitch', link: '/actuator/limitSwitch/datasheet/12L12D_Limit_Switch_Datasheet' }
              ]
            },
            {
              text: 'Drawings',
              collapsed: true,
              items: [
                { text: '12D Limit Switch', link: '/actuator/limitSwitch/Drawings/12D_Limit_Switch_Drawings' },
                { text: '12D Nano Limit Switch', link: '/actuator/limitSwitch/Drawings/12D_Nano_Limit_Switch_Drawings' },
                { text: '12L Limit Switch', link: '/actuator/limitSwitch/Drawings/12L_Limit_Switch_Drawings' }
              ]
            },                      
          ],          
          '/software/TotalManager/': [
            {text:'Total Manager'},  
            {
              text: 'User Manual', 
              collapsed : true,
              items:[
                {text:"User Manual", link: '/software/TotalManager/Manual/Total_manager_Manual' }
              ]              
            }
          ],
          '/accessories/board/EZController/': [
            {text:'EZ Controller'},             
            {text: 'User Manual', link: '/accessories/board/EZController/EZ_Controller(CT-01)_Manual' },
            {text: 'drawings', link: '/accessories/board/EZController/EZ_Controller_drawings' }            
          ],'/accessories/board/USBInterface/': [
            {text:'USB Interface'},  
            { text: 'USB-03 Datasheet', link: '/accessories/board/USBInterface/Datasheet/USB-03_datasheet' },            
            { text: 'USB-02 Drawings', link: '/accessories/board/USBInterface/drawings/USB-02_drawing' },   
            { text: 'USB-03 Drawings', link: '/accessories/board/USBInterface/drawings/usb-03_drawing' },   
            { text: 'Driver', link: '/en/accessories/board/USBInterface/drivers/Drivers' },  
          ],'/accessories/board/UartInterfaceboard/': [
            {text:'UART Interface'},
            { text: 'Drawing', link: '/accessories/board/UartInterfaceboard/UART01-drawing' }
          ],'/accessories/Mounting/': [
            {text:'Mounting'},
            {
              text: 'IR-MB02', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/accessories/Mounting/IR-MB02/mb02-drawing' },
                {text:"assemble", link: '/accessories/Mounting/IR-MB02/mb02-assemble' },
              ]                            
            },
            {
              text: 'IR-MB03', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/accessories/Mounting/IR-MB03/mb03-drawing' },
                {text:"assemble", link: '/accessories/Mounting/IR-MB03/mb03-assemble' },
              ]                            
            },
            {
              text: 'IR-MB04', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/accessories/Mounting/IR-MB04/mb04-drawing' },
                {text:"assemble", link: '/accessories/Mounting/IR-MB04/mb04-assemble' },
              ]                            
            },
            {
              text: 'IR-MB05', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/accessories/Mounting/IR-MB05/mb05-drawing' },
                {text:"assemble", link: '/accessories/Mounting/IR-MB05/mb05-assemble' },
              ]                            
            },
            {
              text: 'IR-MB06', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/accessories/Mounting/IR-MB06/mb06-drawing' },
                {text:"assemble", link: '/accessories/Mounting/IR-MB06/mb06-assemble' },
              ]                            
            },
            {
              text: 'IR-MB07', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/accessories/Mounting/IR-MB07/mb07-drawing' },
                {text:"assemble", link: '/accessories/Mounting/IR-MB07/mb07-assemble' },
              ]                            
            }     
          ],'/accessories/wire/': [
            {text:'Wire'},
            { text: 'Wire Connector', link: '/accessories/wire/wire_connector'}
          ],'/accessories/RodendTips/': [
            {text:'Rodend Tips'},
            {
              text: 'IR-EB01', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/accessories/RodendTips/IR-EB01/EB01-Drawing' },
                {text:"assemble", link: '/accessories/RodendTips/IR-EB01/EB01-assemble' },
              ]                            
            },
            {
              text: 'IR-GT01', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/accessories/RodendTips/IR-GT01/GT01-Drawing' }                              
              ]                            
            },  
            {
              text: 'IR-MC05', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/accessories/RodendTips/IR-MC05/mc05-Drawing' },
                {text:"assemble", link: '/accessories/RodendTips/IR-MC05/mc05-assemble' },
              ]                            
            },
            {
              text: 'IR-MC06', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/accessories/RodendTips/IR-MC06/mc06-Drawing' },
                {text:"assemble", link: '/accessories/RodendTips/IR-MC06/mc06-assemble' },
              ]                            
            },     
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
        outline: {
          level: 'deep' // h2와 h3 헤더를 목차에 표시
        },
        // --- 영어 NAV ---
        nav: [
          { text: 'HOME', link: '/en/' },
          { 
            text: 'Actuator', 
            items: [            
              { text: '12Lf Series', link: '/en/actuator/Mini12Lf/' },
              { text: '17Lf Series', link: '/en/actuator/Mini17Lf/' },
              { text: 'D7,D12,L12', link: '/en/actuator/D7D12L12/' },
              { text: 'Limit Switch', link: '/en/actuator/LimitSwitch/' },
            ]
          },          
          { text: 'Software', 
            items : [
              { text: 'Total Manager', link: '/en/software/TotalManager/' },
            ]
          },
          { text: 'Accessores', 
            items : [
              {text : 'Board', 
                items:[
                  {text:"- EZ Controller",link: '/en/accessories/board/EZController/' },
                  {text:"- USB Interface",link: '/en/accessories/board/USBInterface/' },
                  {text:"- UART Interface",link: '/en/accessories/board/UartInterfaceboard/' },
              ]},             
              {text : 'Mount', link: '/en/accessories/Mounting/' },
              {text : 'Wire', link: '/en/accessories/wire/' },
              {text : 'Rodend Tips', link: '/en/accessories/RodendTips/' },
            ]
          },
          {
            text :"mightyZAP Home",
            link : "http://mightyzap.com/en/"
          }
        ],
        // --- 영어 SIDEBAR ---
        sidebar: {
          '/en/actuator/Mini12Lf/': [
            {text:'12Lf Series'},
            {
              text: 'Manual',
              collapsed: true,
              items: [
                { text: 'IR Protocol', link: '/en/actuator/Mini12Lf/Manual/12Lf_IRProtocol' },
                { text: 'Modbus RTU', link: '/en/actuator/Mini12Lf/Manual/12Lf_ModbusRTU' },
                { text: 'User Manual', link: '/en/actuator/Mini12Lf/Manual/12Lf_Manual' },                    
              ]
            },
            {
              text: 'Catalogue',
              collapsed: true,
              items: [
                { text: 'Catalogue', link: '/en/actuator/Mini12Lf/Catalogue/12Lf_catalogue' }
              ]
            },   
            {
              text: 'Firmware',
              collapsed: true,
              items: [
                { text: 'Firmware', link: '/en/actuator/Mini12Lf/firmware/12Lf_firmware' },                    
              ]
            },
            {
              text: 'Drawings',
              collapsed: true,
              items: [
                { text: '12Lf-xx-27', link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-27_Drawings' },
                { text: '12Lf-xx-40', link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-40_Drawings' },
                { text: '12Lf-xx-53', link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-53_Drawings' },
                { text: '12Lf-xx-90', link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-90_Drawings' }
              ]
            },
            {
              text: 'Datasheet',
              collapsed: true,
              items: [
                { text: '12Lf-xxPT-27', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-27_Datasheet' },
                { text: '12Lf-xxPT-40', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-40_Datasheet' },
                { text: '12Lf-xxPT-53', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-53_Datasheet' },
                { text: '12Lf-xxPT-90', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-90_Datasheet' },
                { text: '12Lf-xxF-27', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-27_Datasheet' },
                { text: '12Lf-xxF-40', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-40_Datasheet' },
                { text: '12Lf-xxF-53', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-53_Datasheet' },
                { text: '12Lf-xxF-90', link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-90_Datasheet' }
              ]
            }, 
          ],      
          '/en/actuator/Mini17Lf/': [    
            {text:'17Lf Series'},            
            {//
              text: 'Datasheet',
              collapsed: true,
              items: [
                { text: '17Lf-xx-27', link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-27_Datasheet' },
                { text: '17Lf-xx-37', link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-37_Datasheet' },
                { text: '17Lf-xx-50', link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-50_Datasheet' },
                { text: '17Lf-xx-87', link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-87_Datasheet' },                    
              ]
            },
            {
              text: 'Drawings',
              collapsed: true,
              items: [
                { text: '17Lf-xx-27', link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-27_Drawings' },
                { text: '17Lf-xx-37', link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-37_Drawings' },
                { text: '17Lf-xx-50', link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-50_Drawings' },
                { text: '17Lf-xx-87', link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-87_Drawings' },  
              ]
            },                
            {
              text: 'Catalogue',
              collapsed: true,
              items: [
                { text: 'Catalogue', link: '/en/actuator/Mini17Lf/Catalogue/17Lf_Catalogue' }
              ]
            },
            {
              text: 'Manual',
              collapsed: true,
              items: [
                { text: 'Modbus RTU', link: '/en/actuator/Mini17Lf/Manual/17Lf_ModbusRTU' }, 
                { text: 'User Manual', link: '/en/actuator/Mini17Lf/Manual/17Lf_Manual' }, 
              ]
            },
            {
              text: 'Firmware',
              collapsed: true,
              items: [
                { text: 'Firmware', link: '/en/actuator/Mini17Lf/firmware/17Lf_Firmware' }                 
              ]
            }
          ],
          '/en/actuator/D7D12L12/': [  
            {text:'D7 D12 L12 Series'},              
            {//D7D12
              text: 'Datasheet',
              collapsed: true,
              items: [
                { text: 'L12-xxPT-3', link: '/en/actuator/D7D12L12/Datasheet/L12-xxPT-3_Datasheet' },
                { text: 'L12-xxPT-4', link: '/en/actuator/D7D12L12/Datasheet/L12-xxPT-4_Datasheet' },
                { text: 'L12-xxPT-6', link: '/en/actuator/D7D12L12/Datasheet/L12-xxPT-6_Datasheet' },
                { text: 'L12-xxPT-10', link: '/en/actuator/D7D12L12/Datasheet/L12-xxPT-10_Datasheet' },
                { text: 'L12-xxF-3', link: '/en/actuator/D7D12L12/Datasheet/L12-xxF-3_Datasheet' },
                { text: 'L12-xxF-4', link: '/en/actuator/D7D12L12/Datasheet/L12-xxF-4_Datasheet' },
                { text: 'L12-xxF-6', link: '/en/actuator/D7D12L12/Datasheet/L12-xxF-6_Datasheet' },
                { text: 'L12-xxF-10', link: '/en/actuator/D7D12L12/Datasheet/L12-xxF-10_Datasheet' }
              ]
            },
            {
              text: 'Drawings',
              collapsed: true,
              items: [
                { text: 'D7D12-xx-3', link: '/en/actuator/D7D12L12/Drawings/D7D12-xx-3_Drawings' },
                { text: 'L12-xx-3', link: '/en/actuator/D7D12L12/Drawings/L12-xx-3_Drawings' },
                { text: 'L12-xx-4', link: '/en/actuator/D7D12L12/Drawings/L12-xx-4_Drawings' },
                { text: 'L12-xx-6', link: '/en/actuator/D7D12L12/Drawings/L12-xx-6_Drawings' },
                { text: 'L12-xx-10', link: '/en/actuator/D7D12L12/Drawings/L12-xx-10_Drawings' }
              ]
            },
            {
              text: 'Catalogue',
              collapsed: true,
              items: [
                { text: 'Catalogue', link: '/en/actuator/D7D12L12/Catalogue/D7D12L12_Catalogue' }
              ]
            },
            {
              text: 'Manual',
              collapsed: true,
              items: [                    
                { text: 'User Manual', link: '/en/actuator/D7D12L12/Manual/D7D12L12_Manual' },
                { text: 'Life cycle', link: '/en/actuator/D7D12L12/Manual/D7D12L12_lifecycle' },
              ]
            },
            {
              text: 'Firmware',
              collapsed: true,
              items: [
                { text: 'Firmware', link: '/en/actuator/D7D12L12/firmware/D7D12L12_firmware' },                    
              ]
            },
          ],
          '/en/actuator/LimitSwitch/': [  
            {text:'Switch Series'},    
            {
              text: 'Datasheet',
              collapsed: true,
              items: [
                { text: 'Datasheet', link: '/en/actuator/limitSwitch/datasheet/12L12D_Series_Limit_Switch' }
              ]
            },
            {
              text: 'Drawings',
              collapsed: true,
              items: [
                { text: '12D Limit Switch', link: '/en/actuator/limitSwitch/Drawings/12D_LimitSwitch_Drawings' },
                { text: '12D Nano Limit Switch', link: '/en/actuator/limitSwitch/Drawings/12D_Nano_LimitSwitch_Drawings' },
                { text: '12L Limit Switch', link: '/en/actuator/limitSwitch/Drawings/12L_LimitSwitch_Drawings' }
              ]
            },                      
          ],          
          '/en/software/TotalManager/': [
            {text:'Total Manager'},  
            {
              text: 'User Manual', 
              collapsed : true,
              items:[
                {text:"User Manual", link: '/en/software/TotalManager/TotalManager_Manual' }
              ]              
            }
          ],
          '/en/accessories/board/EZController/': [
            {text : "EZ Controller"},
            { text: 'Manual', link: '/en/accessories/board/EZController/EZControllerUserManual' },
            { text: 'Drawing', link: '/en/accessories/board/EZController/CT-01_drawing' },
            { text: 'Arduino', link: '/en/accessories/board/EZController/EZ Controller User Manual' }          
          ],'/en/accessories/board/USBInterface/': [
            {text : "USB Interface"},     
            { text: 'USB-03 Datasheet', link: '/en/accessories/board/USBInterface/Datasheet/USB-03_datasheet' },            
            { text: 'USB-02 Drawings', link: '/en/accessories/board/USBInterface/drawings/USB-02_drawing' },   
            { text: 'USB-03 Drawings', link: '/en/accessories/board/USBInterface/drawings/usb-03_drawing' },   
            { text: 'Driver', link: '/en/accessories/board/USBInterface/drivers/Drivers' },  
          ],'/en/accessories/board/UartInterfaceboard/': [
            {text : "UART Interface"},
            {text: 'Drawing', link: '/en/accessories/board/UartInferfaceboard/Drawing/UART01drawing' }
          ],'/en/accessories/Mounting/': [
            {text : "Mounting"},
            {
              text: 'IR-MB02', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/en/accessories/Mounting/IR-MB02/mb02-drawing' },
                {text:"assemble", link: '/en/accessories/Mounting/IR-MB02/mb02-assemble' },
              ]                            
            },
            {
              text: 'IR-MB03', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/en/accessories/Mounting/IR-MB03/mb03-drawing' },
                {text:"assemble", link: '/en/accessories/Mounting/IR-MB03/mb03-assemble' },
              ]                            
            },
            {
              text: 'IR-MB04', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/en/accessories/Mounting/IR-MB04/mb04-drawing' },
                {text:"assemble", link: '/en/accessories/Mounting/IR-MB04/mb04-assemble' },
              ]                            
            },
            {
              text: 'IR-MB05', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/en/accessories/Mounting/IR-MB05/mb05-drawing' },
                {text:"assemble", link: '/en/accessories/Mounting/IR-MB05/mb05-assemble' },
              ]                            
            },
            {
              text: 'IR-MB06', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/en/accessories/Mounting/IR-MB06/mb06-drawing' },
                {text:"assemble", link: '/en/accessories/Mounting/IR-MB06/mb06-assemble' },
              ]                            
            },
            {
              text: 'IR-MB07', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/en/accessories/Mounting/IR-MB07/mb07-drawing' },
                {text:"assemble", link: '/en/accessories/Mounting/IR-MB07/mb07-assemble' },
              ]                            
            }           
          ],'/en/accessories/wire/': [
            {text : "Wire"},
            { text: 'wire connector', link: '/en/accessories/Wire/wire_connector' },
          ],'/en/accessories/RodendTips/': [
            {text : "Rodend Tips"},
            {
              text: 'IR-EB01', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/en/accessories/RodendTips/IR-EB01/EB01-Drawing' },
                {text:"assemble", link: '/en/accessories/RodendTips/IR-EB01/EB01-assemble' },
              ]                            
            },
            {
              text: 'IR-GT01', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/en/accessories/RodendTips/IR-GT01/GT01-Drawing' }                              
              ]                            
            },  
            {
              text: 'IR-MC05', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/en/accessories/RodendTips/IR-MC05/mc05-Drawing' },
                {text:"assemble", link: '/en/accessories/RodendTips/IR-MC05/mc05-assemble' },
              ]                            
            },
            {
              text: 'IR-MC06', 
              collapsed : true,
              items:[
                {text:"drawing", link: '/en/accessories/RodendTips/IR-MC06/mc06-Drawing' },
                {text:"assemble", link: '/en/accessories/RodendTips/IR-MC06/mc06-assemble' },
              ]                            
            },     
          ]
        } 
      }
    }
  }  
})
