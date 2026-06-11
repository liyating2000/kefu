const fs = require('fs');
const xml = fs.readFileSync('unzipped_new2/word/document.xml', 'utf-8');

// Style to heading level mapping (actual body headings)
const headingStyles = {
  '2': 1,    // # heading 1
  '3': 2,    // ## heading 2
  '335': 2,  // ## 标准二级
  '4': 3,    // ### heading 3
  '338': 3,  // ### 标准三级
  '5': 4,    // #### heading 4
  '6': 4,    // #### heading 5
  '7': 4,    // #### heading 6
  '342': 4,  // #### 标准五级
};

// Build output by walking through XML elements sequentially
const output = [];
const tocEntries = [];
let phase = 'header'; // header -> toc -> body

// Parse elements sequentially: tables first (priority), then paragraphs
const elements = [];
{
  let pos = 0;
  // Match <w:p .../> (self-closing) or <w:p ...>...</w:p> but NOT spanning across <w:tbl>
  const pRegex = /<w:p[ >][^]*?<\/w:p>|<w:p [^>]*\/>/g;
  const tblOpenTag = '<w:tbl>';
  const tblCloseTag = '</w:tbl>';
  while (pos < xml.length) {
    const nextTbl = xml.indexOf(tblOpenTag, pos);
    pRegex.lastIndex = pos;
    const pMatch = pRegex.exec(xml);
    const nextPStart = pMatch ? pMatch.index : -1;

    if (nextTbl >= 0 && (nextPStart < 0 || nextTbl <= nextPStart)) {
      // Find balanced </w:tbl>
      let depth = 1, search = nextTbl + tblOpenTag.length;
      while (depth > 0 && search < xml.length) {
        const nextOpen = xml.indexOf(tblOpenTag, search);
        const nextClose = xml.indexOf(tblCloseTag, search);
        if (nextClose < 0) break;
        if (nextOpen >= 0 && nextOpen < nextClose) { depth++; search = nextOpen + tblOpenTag.length; }
        else { depth--; search = nextClose + tblCloseTag.length; }
      }
      elements.push(xml.substring(nextTbl, search));
      pos = search;
    } else if (nextPStart >= 0) {
      // If this paragraph match spans past a <w:tbl>, skip it (it's a self-closing <w:p/> before a table)
      if (nextTbl >= 0 && pMatch.index < nextTbl && pMatch.index + pMatch[0].length > nextTbl) {
        pos = nextTbl;
        continue;
      }
      elements.push(pMatch[0]);
      pos = pMatch.index + pMatch[0].length;
    } else {
      break;
    }
  }
}

for (const elXml of elements) {

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

    // Regular text
    if (text) {
      output.push(text);
    }
  }
}

// Supplement TOC entries for sections present as body headings but missing from TOC
function insertTocAfter(label, newEntries) {
  const idx = tocEntries.findIndex((e) => e.label === label);
  if (idx >= 0) {
    tocEntries.splice(idx + 1, 0, ...newEntries);
  }
}

// 3.2 电话客服 — between 3.1 预存话术 and 3.2 公告 (renumber 3.2→3.3 etc.)
insertTocAfter('3.1.2 预存话术', [
  { level: 2, label: '3.2 电话客服' },
  { level: 3, label: '3.2.1 坐席签入' },
]);

// Renumber existing 3.2 公告 → 3.3, 3.3 排班管理 → 3.4, etc.
const ch3Renumber = {
  '3.2 公告': '3.3 公告',
  '3.2.1 公告管理': '3.3.1 系统通告',
  '3.3 排班管理': '3.4 排班管理',
  '3.3.1 班次维护': '3.4.1 班次维护',
  '3.3.2 技能维护': '3.4.2 技能维护',
  '3.3.3 方案维护': '3.4.3 方案维护',
  '3.3.4 排班历史': '3.4.4 排班历史',
  '3.3.5 排班导入': '3.4.5 排班导入',
  '3.3.6 上班展示': '3.4.6 上班展示',
  '3.3.7 排班审核': '3.4.7 排班审核',
  '3.3.8 排班统计': '3.4.8 排班统计',
  '3.4 组织架构维护': '3.8 组织架构维护',
  '3.4.1 个人中心': '3.8.1 个人中心',
  '3.4.2 账号管理': '3.8.2 账号管理',
  '3.4.3 部门/角色管理': '3.8.3 部门/角色管理',
  '3.5 权限管理': '3.9 权限管理',
  '3.5.1 菜单/权限配置': '3.9.1 菜单/权限配置',
  '3.6 系统设置': '3.10 系统设置',
  '3.6.1 黑名单管理': '3.10.1 黑名单管理',
};
for (const entry of tocEntries) {
  if (ch3Renumber[entry.label]) {
    entry.label = ch3Renumber[entry.label];
  }
}

// Insert 3.5 短信/邮件模板管理 after 3.4.8
insertTocAfter('3.4.8 排班统计', [
  { level: 2, label: '3.5 短信/邮件模板管理' },
  { level: 3, label: '3.5.1 业务流程描述' },
  { level: 3, label: '3.5.2 操作界面' },
  { level: 3, label: '3.5.3 岗位权限' },
  { level: 3, label: '3.5.4 异常情况处理' },
]);

// Insert 3.6 呼入黑名单维护 after 3.5
insertTocAfter('3.5.4 异常情况处理', [
  { level: 2, label: '3.6 呼入黑名单维护' },
  { level: 3, label: '3.6.1 业务流程描述' },
  { level: 3, label: '3.6.2 操作页面' },
  { level: 3, label: '3.6.3 岗位权限' },
  { level: 3, label: '3.6.4 异常处理流程' },
]);

// Insert 3.7 呼出黑名单维护 after 3.6
insertTocAfter('3.6.4 异常处理流程', [
  { level: 2, label: '3.7 呼出黑名单维护' },
  { level: 3, label: '3.7.1 业务流程描述' },
  { level: 3, label: '3.7.2 操作页面' },
  { level: 3, label: '3.7.3 岗位权限' },
  { level: 3, label: '3.7.4 异常处理流程' },
]);

// 4.16 预约回电/留言管理 — sub-pages are #### body headings, absent from TOC
insertTocAfter('4.16.4 预约回电/留言管理', [
  { level: 3, label: '4.16.5 预约回电列表页' },
  { level: 3, label: '4.16.6 留言列表页' },
  { level: 3, label: '4.16.7 待办列表页' },
  { level: 3, label: '4.16.8 调剂弹窗' },
  { level: 3, label: '4.16.9 调剂历史弹窗' },
  { level: 3, label: '4.16.10 回电确认弹窗' },
  { level: 3, label: '4.16.11 待办提醒弹窗' },
]);

// 4.19 — rewrite entire section: rename + replace all sub-entries
{
  const toc419 = tocEntries.find((e) => e.label === '4.19 工作组队列维护');
  if (toc419) toc419.label = '4.19 系统/工作组队列维护';
  // Remove all old 4.19.x entries
  for (let i = tocEntries.length - 1; i >= 0; i--) {
    if (/^4\.19\.\d/.test(tocEntries[i].label)) tocEntries.splice(i, 1);
  }
  // Insert correct entries after 4.19
  insertTocAfter('4.19 系统/工作组队列维护', [
    { level: 3, label: '4.19.1 系统配置' },
    { level: 3, label: '4.19.2 工作组第三方网站设置' },
    { level: 3, label: '4.19.2.1 第三方网站配置列表页' },
    { level: 3, label: '4.19.2.2 分类管理' },
    { level: 3, label: '4.19.2.3 网站管理' },
    { level: 3, label: '4.19.2.4 新增分类弹窗' },
    { level: 3, label: '4.19.2.5 编辑分类弹窗' },
    { level: 3, label: '4.19.2.6 删除分类' },
    { level: 3, label: '4.19.2.7 新增网站弹窗' },
    { level: 3, label: '4.19.2.8 编辑网站弹窗' },
    { level: 3, label: '4.19.2.9 删除网站' },
    { level: 3, label: '4.19.3 工作组客户端属性' },
    { level: 3, label: '4.19.4 工作组路由属性' },
  ]);
}

// Remove TOC entries that no longer exist in the document body
const removedSections = ['4.23.3 产品模块维护', '4.23.4 品牌维护'];
for (let i = tocEntries.length - 1; i >= 0; i--) {
  if (removedSections.includes(tocEntries[i].label)) {
    tocEntries.splice(i, 1);
  }
}

// Deduplicate TOC entries by label (keep first occurrence)
const seenLabels = new Set();
for (let i = tocEntries.length - 1; i >= 0; i--) {
  if (seenLabels.has(tocEntries[i].label)) {
    tocEntries.splice(i, 1);
  } else {
    seenLabels.add(tocEntries[i].label);
  }
}

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

fs.writeFileSync('output_v2.md', mdContent, 'utf-8');

// Wrap in export
const finalContent = 'export const helpDocContent = `' +
  mdContent
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${')
  + '`;\n';

fs.writeFileSync('helpDocContent_v2.ts', finalContent, 'utf-8');

console.log('Done! Body lines:', output.length);
console.log('TOC entries:', tocEntries.length);
console.log('First 5 TOC:', tocEntries.slice(0, 5).map(e => e.label));
console.log('Last 5 TOC:', tocEntries.slice(-5).map(e => e.label));
