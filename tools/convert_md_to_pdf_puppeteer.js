// Converts PROJECT_REPORT_JOB_PORTAL.md to a nicely formatted PDF using Puppeteer.
// Install dependencies: npm install puppeteer markdown-it
// Run: node tools/convert_md_to_pdf_puppeteer.js

import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import puppeteer from 'puppeteer';

const mdPath = path.resolve(process.cwd(), 'PROJECT_REPORT_JOB_PORTAL.md');
const outPath = path.resolve(process.cwd(), 'PROJECT_REPORT_JOB_PORTAL_highres.pdf');

async function run() {
  if (!fs.existsSync(mdPath)) {
    console.error('Markdown file not found:', mdPath);
    process.exit(1);
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const mdParser = new MarkdownIt({ html: true, linkify: true, typographer: true });
  const htmlContent = mdParser.render(md);

  const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, Helvetica, sans-serif; padding: 30px; color: #222 }
        h1, h2, h3 { color: #1f6feb }
        pre { background: #f6f8fa; padding: 10px; border-radius: 6px }
        code { background: #f6f8fa; padding: 2px 4px; border-radius: 4px }
        table { border-collapse: collapse }
        table, th, td { border: 1px solid #ddd; padding: 6px }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
  </html>`;

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outPath, format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
  await browser.close();

  console.log('PDF generated at', outPath);
}

run().catch(err => { console.error(err); process.exit(1); });
