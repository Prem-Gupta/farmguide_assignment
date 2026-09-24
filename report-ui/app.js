function reportSummary() {
    return [
        'FarmGuide AI repository readiness report',
        '',
        'Overall compatibility: 52%',
        'Repository context: 78%',
        'AI instructions: 92%',
        'Development setup: 72%',
        'Build and validation: 66%',
        'Testing quality: 18%',
        'Security readiness: 44%',
        '',
        'Top priorities:',
        '1. Add route and model tests',
        '2. Resolve dependency audit findings',
        '3. Document task discovery',
        '',
        'View the full report: https://lemon-mud-039e17d00.1.azurestaticapps.net/'
    ].join('\n');
}

function sendReportEmail() {
    const button = document.getElementById('send-email');
    const status = document.getElementById('email-status');
    button.disabled = true;
    status.textContent = 'Sending PDF...';

    fetch('https://farmguide-readiness-email-flex.azurewebsites.net/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: reportSummary() })
    }).then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'The report could not be sent.');
        }
        status.textContent = 'PDF sent to priyamgpt444@gmail.com';
    }).catch((error) => {
        status.textContent = error.message;
    }).finally(() => {
        button.disabled = false;
    });
}

function exportReport() {
    document.title = 'FarmGuide AI readiness report';
    window.print();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('send-email').addEventListener('click', sendReportEmail);
    document.getElementById('export-pdf').addEventListener('click', exportReport);
    document.getElementById('quick-print').addEventListener('click', exportReport);
});