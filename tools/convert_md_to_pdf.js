// Simple converter: reads PROJECT_REPORT_JOB_PORTAL.md, renders Markdown to HTML using markdown-it,
// then writes a basic PDF using pdfkit by drawing text. This is a minimal approach and keeps
// dependencies explicit. Install dependencies with: npm install markdown-it pdfkit

import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import PDFDocument from 'pdfkit';

const mdPath = path.resolve(process.cwd(), 'PROJECT_REPORT_JOB_PORTAL.md');
const outPath = path.resolve(process.cwd(), 'PROJECT_REPORT_JOB_PORTAL.pdf');

async function run() {
  if (!fs.existsSync(mdPath)) {
    console.error('Markdown file not found:', mdPath);
    process.exit(1);
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const mdParser = new MarkdownIt();
  const html = mdParser.render(md);

  // Very simple HTML-to-PDF: strip tags and render plain text with PDFKit.
  // For richer rendering, use a headless browser (puppeteer).

  // Remove HTML tags for a plain text PDF
  const text = html.replace(/<[^>]*>/g, '');

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  doc.fontSize(12).text(text, { align: 'left' });

  doc.end();

  stream.on('finish', () => {
    console.log('PDF written to', outPath);
  });
}

run();
