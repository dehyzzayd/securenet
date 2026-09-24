// Email via Resend REST API (no dependency). Falls back to console logging in dev.
const KEY = process.env.RESEND_API_KEY || '';
const FROM = process.env.MAIL_FROM || 'SecureNet <no-reply@securenet.ma>';
const TO = process.env.MAIL_TO || 'contact@securenet.ma';

function esc(s = ''): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

async function send(to: string, subject: string, html: string) {
  if (!KEY) {
    console.log(`\n[mail:dev] → ${to}\n  subject: ${subject}\n  ${html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 400)}\n`);
    return { ok: true, dev: true };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    return { ok: res.ok };
  } catch (e) {
    console.error('[mail] send failed', e);
    return { ok: false };
  }
}

const shell = (title: string, body: string) => `
  <div style="font-family:Arial,sans-serif;background:#fdfaf2;padding:28px;color:#16226e">
    <div style="max-width:560px;margin:auto;background:#fff;border:1px solid #eee">
      <div style="background:#16226e;color:#fff;padding:22px 28px;font-weight:800;letter-spacing:.04em">SECURE<span style="color:#cfa574">NET</span></div>
      <div style="padding:28px">
        <h1 style="font-size:18px;margin:0 0 16px">${esc(title)}</h1>
        ${body}
      </div>
      <div style="padding:16px 28px;border-top:1px solid #eee;color:#8a8f9e;font-size:12px">SecureNet — Sécurité &amp; vidéosurveillance</div>
    </div>
  </div>`;

export async function notifyTeam(lead: Record<string, any>) {
  const rows = ['name', 'phone', 'email', 'profile', 'need', 'message', 'source']
    .filter((k) => lead[k])
    .map((k) => `<tr><td style="padding:6px 12px 6px 0;color:#8a8f9e;text-transform:uppercase;font-size:11px;letter-spacing:.1em">${k}</td><td style="padding:6px 0"><b>${esc(String(lead[k]))}</b></td></tr>`)
    .join('');
  return send(TO, `Nouvelle demande — ${lead.name}`, shell('Nouvelle demande de contact', `<table style="width:100%;border-collapse:collapse">${rows}</table>`));
}

export async function autoReply(lead: Record<string, any>) {
  if (!lead.email) return { ok: false };
  return send(
    lead.email,
    'Nous avons bien reçu votre demande — SecureNet',
    shell('Merci, votre demande est bien reçue.', `
      <p style="line-height:1.6">Bonjour ${esc(lead.name || '')},</p>
      <p style="line-height:1.6">Merci de nous avoir contactés. Un installateur SecureNet revient vers vous <b>sous 48 h ouvrées</b> pour convenir d'un repérage gratuit.</p>
      <p style="line-height:1.6">Pour une demande urgente, appelez-nous directement.</p>
      <p style="line-height:1.6;color:#8a8f9e;font-size:13px">— L'équipe SecureNet</p>`)
  );
}
