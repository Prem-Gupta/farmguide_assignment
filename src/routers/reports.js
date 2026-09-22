const express = require('express')

const router = new express.Router()

const report = {
    score: 52,
    assessedAt: '22 Sep 2026',
    categories: [
        { name: 'Repository context', score: 78, status: 'Strong', detail: 'README and architecture map are available.' },
        { name: 'AI instructions', score: 92, status: 'Strong', detail: 'AGENTS.md defines workflow, boundaries, and conventions.' },
        { name: 'Development setup', score: 72, status: 'Good', detail: 'Environment template and installation steps are documented.' },
        { name: 'Build and validation', score: 66, status: 'Good', detail: 'Syntax validation and CI are configured.' },
        { name: 'Testing quality', score: 18, status: 'Needs work', detail: 'No unit or integration test suite is present yet.' },
        { name: 'Security readiness', score: 44, status: 'Needs work', detail: 'Security guidance exists, but dependencies need review.' }
    ],
    actions: [
        { priority: 'High', title: 'Add route and model tests', detail: 'Create a repeatable test pattern for authentication and persistence flows.' },
        { priority: 'High', title: 'Resolve dependency audit findings', detail: 'Review the legacy dependency tree before production deployment.' },
        { priority: 'Medium', title: 'Document task discovery', detail: 'Add issue templates with acceptance criteria and reproduction steps.' }
    ]
}

router.get('/reports', (req, res) => {
    res.render('reports', { report })
})

module.exports = router