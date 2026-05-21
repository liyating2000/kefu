const fs = require('fs');
const xml = fs.readFileSync('C:/tmp/docx_extract/word/document.xml', 'utf8');

const bodyMatch = xml.match(/<w:body>([\s\S]*)<\/w:body>/);
const body = bodyMatch[1];

function decodeXmlEntities(str) {
  return str.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
}

function extractText(nodeStr) {
  const texts = [];
  const tRe = /<w:t[^>]*>([^<]*)<\/w:t>/g;
  let m;
  while ((m = tRe.exec(nodeStr)) !== null) { texts.push(decodeXmlEntities(m[1])); }
  return texts.join('');
}

function getParaInfo(paraStr) {
  const styleMatch = paraStr.match(/<w:pStyle w:val="([^"]*)"/);
  const style = styleMatch ? styleMatch[1] : '';

  // TOC styles: 23 (h3), 30 (h1), 35 (h2), or TOCHeading
  const isToc = /^(23|3[0-9]|TOC|toc)/i.test(style);

  // Heading styles
  let headingLevel = 0;
  if (/^(Heading1|1)$/.test(style)) headingLevel = 1;
  else if (/^(Heading2|2)$/.test(style)) headingLevel = 2;
  else if (/^(Heading3|3)$/.test(style)) headingLevel = 3;
  else if (/^(Heading4|4)$/.test(style)) headingLevel = 4;

  return { style, isToc, headingLevel };
}

// Split body into top-level elements
const parts = body.split(/(<w:tbl[\s>][\s\S]*?<\/w:tbl>)/g);
const elements = [];

for (const part of parts) {
  if (part.trim().startsWith('<w:tbl')) {
    elements.push({ type: 'table', xml: part });
  } else {
    const paraStrs = part.split('</w:p>');
    for (const pStr of paraStrs) {
      const text = extractText(pStr).trim();
      if (!text) continue;
      const info = getParaInfo(pStr);
      elements.push({ type: 'paragraph', text, ...info });
    }
  }
}

function tableToMarkdown(tableXml) {
  const rows = [];
  const rowStrs = tableXml.split('</w:tr>');
  for (const rowStr of rowStrs) {
    if (!rowStr.includes('<w:tr')) continue;
    const cells = [];
    const cellStrs = rowStr.split('</w:tc>');
    for (const cellStr of cellStrs) {
      if (!cellStr.includes('<w:tc')) continue;
      cells.push(extractText(cellStr).trim().replace(/\n/g, ' '));
    }
    if (cells.length > 0) rows.push(cells);
  }
  if (rows.length === 0) return '';
  const maxCols = Math.max(...rows.map(r => r.length));
  for (const row of rows) { while (row.length < maxCols) row.push(''); }
  let md = '| ' + rows[0].map(c => c || ' ').join(' | ') + ' |\n';
  md += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n';
  for (let i = 1; i < rows.length; i++) {
    md += '| ' + rows[i].map(c => c || ' ').join(' | ') + ' |\n';
  }
  return md;
}

let md = '';
let tocItems = [];
let foundTocMarker = false;
let tocDone = false;

for (let i = 0; i < elements.length; i++) {
  const el = elements[i];

  if (el.type === 'paragraph' && el.text === '目录') {
    foundTocMarker = true;
    continue;
  }

  // Collect TOC entries
  if (foundTocMarker && !tocDone && el.type === 'paragraph' && el.isToc) {
    const stripped = el.text.replace(/\d+$/, '').trim();
    if (stripped) {
      const numMatch = stripped.match(/^(\d+(?:\.\d+)*)/);
      const level = numMatch ? numMatch[1].split('.').length : 1;
      tocItems.push({ level, label: stripped });
    }
    continue;
  }

  // If we were in TOC and hit a non-TOC element, TOC is done
  if (foundTocMarker && !tocDone && el.type === 'paragraph' && !el.isToc) {
    tocDone = true;
    // Write TOC block
    md += '<!-- TOC_START -->\n';
    for (const t of tocItems) {
      md += 'TOC:' + t.level + ':' + t.label + '\n';
    }
    md += '<!-- TOC_END -->\n\n';
  }

  // Regular content
  if (el.type === 'table') {
    md += '\n' + tableToMarkdown(el.xml) + '\n';
  } else if (el.headingLevel > 0) {
    md += '\n' + '#'.repeat(el.headingLevel) + ' ' + el.text + '\n\n';
  } else {
    md += el.text + '\n\n';
  }
}

const escaped = md.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
const ts = 'export const helpDocContent = `' + escaped + '`;\n';
fs.writeFileSync('D:/iflytey2/code/src/helpDocContent.ts', ts);
console.log('Size:', ts.length, '| TOC entries:', tocItems.length, '| Elements:', elements.length);
