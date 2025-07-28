import Token from 'markdown-it/lib/token';
import type StateCore from 'markdown-it/lib/rules_core/state_core';

// 테이블 셀 구조 정의
interface TableCell {
  row: number;
  col: number;
  content: string;
  token_td_open: Token;
  token_inline: Token;
  token_td_close: Token;
  rowspan: number;
  colspan: number;
}

// 병합 플러그인 정의
export const advancedTablePlugin = (md) => {
  md.core.ruler.after('inline', 'advanced_table_merger', (state: StateCore) => {
    const tokens = state.tokens;
    const tableStack: TableCell[][] = [];
    let inTable = false;
    let rowIndex = -1;
    let colIndex = 0;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === 'table_open') {
        inTable = true;
        tableStack.length = 0;
        rowIndex = -1;
        continue;
      }

      if (!inTable) continue;

      if (token.type === 'tr_open') {
        rowIndex++;
        colIndex = 0;
        tableStack[rowIndex] = [];
        continue;
      }

      if (token.type === 'td_open' || token.type === 'th_open') {
        const token_td_open = token;
        const token_inline = tokens[i + 1];
        const token_td_close = tokens[i + 2];

        let content = token_inline.content.trim();
        let rowspan = 1;
        let colspan = 1;

        if (content === '^^') {
          // 위 셀과 병합
          for (let r = rowIndex - 1; r >= 0; r--) {
            const aboveCell = tableStack[r]?.[colIndex];
            if (aboveCell && aboveCell.content !== '^^' && aboveCell.content !== '<<') {
              aboveCell.rowspan++;
              // 현재 셀 제거
              token_td_open.tag = 'skip';
              token_inline.content = '';
              token_td_close.tag = 'skip';
              break;
            }
          }
        } else if (content === '<<') {
          // 왼쪽 셀과 병합
          for (let c = colIndex - 1; c >= 0; c--) {
            const leftCell = tableStack[rowIndex]?.[c];
            if (leftCell && leftCell.content !== '^^' && leftCell.content !== '<<') {
              leftCell.colspan++;
              // 현재 셀 제거
              token_td_open.tag = 'skip';
              token_inline.content = '';
              token_td_close.tag = 'skip';
              break;
            }
          }
        }

        // 셀 저장
        tableStack[rowIndex].push({
          row: rowIndex,
          col: colIndex++,
          content,
          token_td_open,
          token_inline,
          token_td_close,
          rowspan,
          colspan,
        });
      }

      if (token.type === 'table_close') {
        // colspan, rowspan 적용
        for (const row of tableStack) {
          for (const cell of row) {
            if (cell.token_td_open.tag === 'skip') continue;
            if (cell.rowspan > 1) {
              cell.token_td_open.attrSet('rowspan', String(cell.rowspan));
            }
            if (cell.colspan > 1) {
              cell.token_td_open.attrSet('colspan', String(cell.colspan));
            }
          }
        }

        inTable = false;
      }
    }
  });
};
