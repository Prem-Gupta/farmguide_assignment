const https = require('https');

const recipient = 'priyamgpt444@gmail.com';

function escapePdfText(value) {
    return value.replace(/([\\()])/g, '\\$1').replace(/[^\x20-\x7e]/g, '?');
}

function createPdf(reportText) {
    const lines = ['FarmGuide AI readiness report', 'Generated from the repository readiness workspace.', '', ...reportText.split('\n')];
    const commands = ['BT', '/F1 18 Tf', '50 790 Td'];
    lines.slice(0, 44).forEach((line, index) => {
        if (index > 0) {
            commands.push('0 -16 Td');
        }
        commands.push(`(${escapePdfText(line)}) Tj`);
    });
    commands.push('ET');
    const stream = `${commands.join('\n')}\n`;
    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        `<< /Length ${Buffer.byteLength(stream) + 1} >>\nstream\n${stream}endstream`
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object, index) => {
        offsets.push(Buffer.byteLength(pdf));
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = Buffer.byteLength(pdf);
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return Buffer.from(pdf, 'binary');
}

function sendWithSendGrid(payload) {
    return new Promise((resolve, reject) => {
        const request = https.request({
            hostname: 'api.sendgrid.com',
            path: '/v3/mail/send',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (response) => {
            let responseBody = '';
            response.on('data', (chunk) => { responseBody += chunk; });
            response.on('end', () => {
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    resolve();
                } else {
                    reject(new Error(`Email provider returned ${response.statusCode}: ${responseBody}`));
                }
            });
        });
        request.on('error', reject);
        request.write(payload);
        request.end();
    });
}

module.exports = async function (context, req) {
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
        context.res = { status: 503, body: JSON.stringify({ error: 'Email service is not configured yet.' }) };
        return;
    }

    try {
        const requestBody = typeof req.body === 'object' ? req.body : JSON.parse(req.rawBody || '{}');
        const reportText = typeof requestBody.report === 'string' ? requestBody.report.slice(0, 10000) : '';
        const pdf = await createPdf(reportText);
        const payload = JSON.stringify({
            personalizations: [{ to: [{ email: recipient }] }],
            from: { email: process.env.SENDGRID_FROM_EMAIL },
            subject: 'FarmGuide AI repository readiness report',
            content: [{ type: 'text/plain', value: 'The FarmGuide AI readiness report is attached as a PDF.' }],
            attachments: [{ content: pdf.toString('base64'), filename: 'farmguide-ai-readiness-report.pdf', type: 'application/pdf', disposition: 'attachment' }]
        });

        await sendWithSendGrid(payload);
        context.res = { status: 200, body: JSON.stringify({ message: `Report sent to ${recipient}.` }) };
    } catch (error) {
        context.log.error('Report email failed:', error.message);
        context.res = { status: 502, body: JSON.stringify({ error: 'Email provider rejected the report.' }) };
    }
};