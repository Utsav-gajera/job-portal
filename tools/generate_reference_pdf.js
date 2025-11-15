// Generates a reference-styled PDF from PROJECT_REPORT_JOB_PORTAL.md
// Requires: puppeteer, markdown-it
// Install: npm install puppeteer markdown-it
// Run: node tools/generate_reference_pdf.js

import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import puppeteer from 'puppeteer';

const mdPath = path.resolve(process.cwd(), 'PROJECT_REPORT_JOB_PORTAL.md');
const outPath = path.resolve(process.cwd(), 'JOB_PORTAL_PROJECT_REPORT_reference_v2.pdf');

function buildHTML(markdown) {
  const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
  const content = md.render(markdown);

  const title = 'Job-Portal Project Report';
  const date = new Date().toLocaleDateString();

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page { size: A4; margin: 20mm }
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #222; }
      .cover { display: flex; height: 100vh; align-items: center; justify-content: center; flex-direction: column; background: linear-gradient(180deg,#0f172a 0%, #1f2937 100%); color: #fff }
      .cover h1 { font-size: 48px; margin: 0 }
      .cover p { margin-top: 12px; font-size: 18px; opacity: 0.85 }
      .content { padding: 30px; }
      h1 { color: #0b5394 }
      h2 { color: #0b5394 }
      pre { background:#f6f8fa; padding:12px; border-radius:6px }
      code { background:#f6f8fa; padding:2px 6px; border-radius:4px }
      .meta { color: #555; font-size: 13px }
      .footer { position: fixed; bottom: 10mm; width: calc(100% - 40mm); text-align: right; font-size: 12px; color:#777 }
    </style>
  </head>
  <body>
    <div class="cover">
      <h1>${title}</h1>
      <p class="meta">Generated on ${date}</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">Job-Portal — Project Report</div>
  </body>
  </html>
  `;
}

async function run() {
  if (!fs.existsSync(mdPath)) {
    console.error('Markdown file not found:', mdPath);
    process.exit(1);
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const html = buildHTML(md);

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outPath, format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
  await browser.close();

  console.log('Reference PDF generated at', outPath);
}

run().catch(err => { console.error(err); process.exit(1); });
