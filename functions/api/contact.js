import { EmailMessage } from 'cloudflare:email';

function encodeMimeWord(str) {
  const bytes = new TextEncoder().encode(str);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return '=?UTF-8?B?' + btoa(binary) + '?=';
}

function buildRawEmail({ from, to, replyTo, subject, body }) {
  const bodyBytes = new TextEncoder().encode(body);
  const bodyBase64 = btoa(
    Array.from(bodyBytes, (b) => String.fromCharCode(b)).join('')
  );

  return [
    `From: ${from}`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${encodeMimeWord(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    bodyBase64,
  ].join('\r\n');
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.subject || !data.message) {
      return Response.json(
        { error: '必須項目を入力してください。' },
        { status: 400, headers }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return Response.json(
        { error: 'メールアドレスの形式が正しくありません。' },
        { status: 400, headers }
      );
    }

    const raw = buildRawEmail({
      from: 'info@inocoromochi.com',
      to: 'info@inocoromochi.com',
      replyTo: data.email,
      subject: `[お問い合わせ] ${data.subject}`,
      body: [
        `お名前: ${data.name}`,
        `メールアドレス: ${data.email}`,
        '',
        data.message,
      ].join('\n'),
    });

    const message = new EmailMessage(
      'info@inocoromochi.com',
      'info@inocoromochi.com',
      raw
    );
    await env.SEND_EMAIL.send(message);

    return Response.json({ ok: true }, { headers });
  } catch (err) {
    console.error('Contact form error:', err);
    return Response.json(
      { error: '送信に失敗しました。時間をおいて再度お試しください。' },
      { status: 500, headers }
    );
  }
}
