// Generates a valid, minimal branded placeholder PDF (no external deps).
// Replace public/docs/dossier-securenet.pdf with the client's real brochure later.
import fs from 'node:fs';
import path from 'node:path';

const lines = [
  ['SECURENET', 30, '0.086 0.133 0.431'],
  ['Dossier de presentation', 15, '0.81 0.647 0.455'],
  ['', 8, '0 0 0'],
  ['Securite & videosurveillance en Provence', 13, '0.1 0.1 0.12'],
  ['', 8, '0 0 0'],
  ['Nos expertises :', 13, '0.086 0.133 0.431'],
  ['  01  Videosurveillance', 12, '0.15 0.15 0.18'],
  ['  02  Controle d acces', 12, '0.15 0.15 0.18'],
  ['  03  Alarme & intrusion', 12, '0.15 0.15 0.18'],
  ['  04  Reseau & infrastructure', 12, '0.15 0.15 0.18'],
  ['  05  Telesurveillance & maintenance', 12, '0.15 0.15 0.18'],
  ['  06  Etude & conseil', 12, '0.15 0.15 0.18'],
  ['', 8, '0 0 0'],
  ['Etude et devis gratuits, sans engagement.', 12, '0.15 0.15 0.18'],
  ['Reponse sous 48 h ouvrees.', 12, '0.15 0.15 0.18'],
  ['', 8, '0 0 0'],
  ['[ Document exemple - a remplacer par la vraie plaquette. ]', 10, '0.5 0.5 0.55'],
];

let y = 760;
let text = 'BT /F1 12 Tf\n';
for (const [str, size, color] of lines) {
  y -= size + 10;
  if (str) {
    text += `${color} rg\n/F1 ${size} Tf\n1 0 0 1 70 ${y} Tm\n(${str.replace(/([()\\])/g, '\\$1')}) Tj\n`;
  }
}
text += 'ET\n';

const objs = [];
objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
objs[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>';
objs[4] = `<< /Length ${text.length} >>\nstream\n${text}\nendstream`;
objs[5] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

let pdf = '%PDF-1.4\n';
const offsets = [];
for (let i = 1; i <= 5; i++) {
  offsets[i] = pdf.length;
  pdf += `${i} 0 obj\n${objs[i]}\nendobj\n`;
}
const xrefPos = pdf.length;
pdf += `xref\n0 6\n0000000000 65535 f \n`;
for (let i = 1; i <= 5; i++) pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

const out = path.resolve('public/docs/dossier-securenet.pdf');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, pdf, 'latin1');
console.log('Wrote', out, `(${pdf.length} bytes)`);
