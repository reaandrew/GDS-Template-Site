const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

nunjucks.configure([
    path.join(__dirname, 'views'),
    path.join(__dirname, 'node_modules/govuk-frontend/dist')
], {
    autoescape: true,
    noCache: true
});


// Ensure output directory exists
function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

// Render template to static HTML file
function renderStaticPage(templateName, context, outputPath) {
    try {
        const html = nunjucks.render(templateName, context);
        const fullPath = path.join(__dirname, outputPath);
        ensureDirectoryExists(fullPath);
        fs.writeFileSync(fullPath, html);
        console.log(`✅ Generated: ${fullPath}`);
    } catch (err) {
        console.error(`❌ Error rendering ${templateName}:`, err);
    }
}

// Breadcrumbs data
const baseBreadcrumbs = [
    { text: 'Home', href: '/' }
];
const complianceBreadcrumbs = [
    ...baseBreadcrumbs,
    { text: 'Compliance Reports', href: '/compliance' }
];

// Pages to render
const pages = [
    {
        template: 'policies/tagging/index.njk',
        context: {
            breadcrumbs: [...complianceBreadcrumbs, { text: 'Tagging', href: '/reports' }],
            menu_items: [
                { href: '/compliance/tagging/', text: 'Teams Overview' },
                { href: '/compliance/tagging/', text: 'Services Overview' },
                { href: '/compliance/tagging/', text: 'CESA' }
            ]
        },
        output: 'dist/policies/tagging/index.html'
    }
];

// Execute rendering
pages.forEach(p => renderStaticPage(p.template, p.context, p.output));