const fs = require('fs');
const xml = fs.readFileSync('unzipped_latest/word/document.xml', 'utf-8');

// Style to heading level mapping (actual body headings)
const headingStyles = {
  '2': 1,  // #
  '3': 2,  // ##
  '4': 3,  // ###
  '5': 4,  // ####
  '6': 4,  // ####
  '7': 4,  // ####
};

// Build output by walking through XML elements sequentially
const output = [];
const tocEntries = [];
let phase = 'header'; // header -> toc -> body

const elementRegex = /(<w:tbl>[\s\S]*?<\/w:tbl>|<w:p[ >][\s\S]*?<\/w:p>)/g;
let elMatch;

while ((elMatch = elementRegex.exec(xml)) !== null) {
  const elXml = elMatch[0];

  if (elXml.startsWith('<w:tbl>')) {
    // Table
    const rows = [];
    const trRegex = /<w:tr[ >][\s\S]*?<\/w:tr>/g;
    let trMatch;
    while ((trMatch = trRegex.exec(elXml)) !== null) {
      const trXml = trMatch[0];
      const cells = [];
      const tcRegex = /<w:tc[ >][\s\S]*?<\/w:tc>/g;
      let tcMatch;
      while ((tcMatch = tcRegex.exec(trXml)) !== null) {
        const tcXml = tcMatch[0];
        const cellTexts = [];
        const ctRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
        let ctMatch;
        while ((ctMatch = ctRegex.exec(tcXml)) !== null) {
          cellTexts.push(ctMatch[1]);
        }
        cells.push(cellTexts.join('').trim());
      }
      if (cells.length > 0) rows.push(cells);
    }

    if (rows.length >= 2) {
      const maxCols = Math.max(...rows.map(r => r.length));
      const normalizedRows = rows.map(r => {
        while (r.length < maxCols) r.push('');
        return r;
      });
      const hasContent = normalizedRows.some(r => r.some(c => c.trim() !== ''));
      if (hasContent) {
        const header = normalizedRows[0];
        output.push('');
        output.push('| ' + header.join(' | ') + ' |');
        output.push('| ' + header.map(() => '---').join(' | ') + ' |');
        for (let ri = 1; ri < normalizedRows.length; ri++) {
          output.push('| ' + normalizedRows[ri].join(' | ') + ' |');
        }
        output.push('');
      }
    }
  } else {
    // Paragraph
    let style = '';
    const styleMatch = elXml.match(/<w:pStyle w:val="([^"]*)"/);
    if (styleMatch) style = styleMatch[1];

    const texts = [];
    const tRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let tMatch;
    while ((tMatch = tRegex.exec(elXml)) !== null) {
      texts.push(tMatch[1]);
    }
    const text = texts.join('').trim();

    // Phase detection
    if (phase === 'header') {
      // TOC section starts with style 30/35 entries
      if (style === '30' || style === '35') {
        phase = 'toc';
      } else if (text === '目录') {
        continue;
      }
    }

    if (phase === 'toc') {
      // TOC entries: styles 30 (level 1) and 35 (level 2)
      if (style === '30') {
        const cleanLabel = text.replace(/\d+$/, '').trim();
        if (cleanLabel) tocEntries.push({ level: 1, label: cleanLabel });
        continue;
      } else if (style === '35') {
        const cleanLabel = text.replace(/\d+$/, '').trim();
        if (cleanLabel) tocEntries.push({ level: 2, label: cleanLabel });
        continue;
      } else if (style === '23' || style === '340' || style === '36' || !style) {
        // Sub-TOC entries (level 3) - match pattern X.X.X text pagenum
        const subTocMatch = text.match(/^(\d+\.\d+\.\d+)\s+(.+?)(\d*)$/);
        if (subTocMatch) {
          const cleanedText = subTocMatch[2].replace(/\d+$/, '').trim();
          const label = subTocMatch[1] + ' ' + cleanedText;
          tocEntries.push({ level: 3, label });
          continue;
        }
        // If we hit a heading style, we're done with TOC
        if (headingStyles[style]) {
          phase = 'body';
        } else if (text && !text.match(/^\d+\.\d+/)) {
          // Non-TOC content, switch to body
          phase = 'body';
        } else {
          continue;
        }
      } else if (headingStyles[style]) {
        phase = 'body';
      } else {
        continue;
      }
    }

    // Body phase
    if (phase !== 'body') continue;

    if (!text && !headingStyles[style]) continue;

    // Skip specific non-body styles (39 is used for body text in specific sections)
    // Headings
    if (headingStyles[style]) {
      const level = headingStyles[style];
      const prefix = '#'.repeat(level) + ' ';
      output.push('');
      output.push('');
      output.push(prefix + text);
      output.push('');
      continue;
    }

    // Regular text (including styles 344, 346, 350, 39, etc.)
    if (text) {
      output.push(text);
    }
  }
}

// Supplement TOC entries for sections the source docx authored as body
// headings but never added to its table-of-contents field (so they were
// missing from the help-doc sidebar). Inserted by label, positionally.
function insertTocAfter(label, newEntries) {
  const idx = tocEntries.findIndex((e) => e.label === label);
  if (idx >= 0) {
    tocEntries.splice(idx + 1, 0, ...newEntries);
  }
}

// 4.16 预约回电/留言管理 — its sub-pages are level-4 body headings (never in TOC)
insertTocAfter('4.16 预约回电/留言管理', [
  { level: 3, label: '4.16.1 预约回电列表页' },
  { level: 3, label: '4.16.2 留言列表页' },
  { level: 3, label: '4.16.3 待办列表页' },
  { level: 3, label: '4.16.4 调剂弹窗' },
  { level: 3, label: '4.16.5 调剂历史弹窗' },
  { level: 3, label: '4.16.6 回电确认弹窗' },
  { level: 3, label: '4.16.7 待办提醒弹窗' },
]);

// 4.23 组别维护 — entire section authored as body headings, absent from TOC
insertTocAfter('4.22.7 附录：待补充业务规则', [
  { level: 2, label: '4.23 组别维护' },
  { level: 3, label: '4.23.1 组别维护页面' },
  { level: 3, label: '4.23.2 新增组别弹窗' },
  { level: 3, label: '4.23.3 添加技能组弹窗' },
  { level: 3, label: '4.23.4 移除技能组确认弹窗' },
]);

// Build TOC section
let tocSection = '<!-- TOC_START -->\n';
for (const entry of tocEntries) {
  tocSection += `TOC:${entry.level}:${entry.label}\n`;
}
tocSection += '<!-- TOC_END -->';

// Combine: title header + TOC + body
let mdContent = output.join('\n');

// Find where to insert TOC - before the first heading
const firstH1Idx = mdContent.indexOf('\n# ');
if (firstH1Idx > 0) {
  mdContent = mdContent.substring(0, firstH1Idx) + '\n\n' + tocSection + '\n' + mdContent.substring(firstH1Idx);
} else {
  mdContent = tocSection + '\n' + mdContent;
}

// Add document title at beginning
mdContent = '科大400客服项目\n\n需求规格说明书\n' + mdContent;

// Decode HTML entities
mdContent = mdContent.replace(/&quot;/g, '"');
mdContent = mdContent.replace(/&gt;/g, '>');
mdContent = mdContent.replace(/&lt;/g, '<');
mdContent = mdContent.replace(/&amp;/g, '&');

// Clean up excessive blank lines
mdContent = mdContent.replace(/\n{4,}/g, '\n\n\n');

// Wrap in export
const finalContent = 'export const helpDocContent = `' +
  mdContent
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${')
  + '`;\n';

fs.writeFileSync('output_latest.md', mdContent, 'utf-8');
fs.writeFileSync('helpDocContent_latest.ts', finalContent, 'utf-8');

console.log('Done! Lines:', finalContent.split('\n').length);
console.log('TOC entries:', tocEntries.length);
console.log('First 5 TOC:', tocEntries.slice(0, 5));
console.log('Last 5 TOC:', tocEntries.slice(-5));
