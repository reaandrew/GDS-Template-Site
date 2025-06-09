const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const app = express();
const createTaggingRouter = require('./routes/policies/tagging');

const baseBreadcrumbs = [
    { text: 'Home', href: '/' }
];
const complianceBreadcrumbs = [
    ...baseBreadcrumbs,
    { text: 'Compliance Reports', href: '/compliance' }
];

// Configure Nunjucks
nunjucks.configure([
    path.join(__dirname, 'node_modules/govuk-frontend/dist'),
    path.join(__dirname, 'views')
], {
    autoescape: true,
    express: app,
});

// Serve GOV.UK Frontend assets
app.use('/assets', express.static(
    path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets')
));

// Serve custom stylesheets from the 'stylesheets' directory
app.use('/stylesheets', express.static(
    path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk')
));

app.use('/javascripts', express.static(
    path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk')
));

// Route for the homepage
app.get('/', (req, res) => {
    res.render('index.njk');
});

app.get('/compliance', (req, res) => {
    const navigationSections = [
        {
            title: "Compliance Overview",
            items: [
                { text: "By Services", href: "#" },
                { text: "By Teams", href: "#" }
            ]
        },
        {
            title: "DPS Policies",
            items: [
                { text: "Tagging", href: "/compliance/tagging" },
                { text: "Load Balancers", href: "#" },
                { text: "Database", href: "#" },
                { text: "Decommissioning", href: "#" },
                { text: "Containers", href: "#" },
                { text: "Monitoring and Alerting", href: "#" },
                { text: "AMIs", href: "#" },
                { text: "Agents and Ports", href: "#" }
            ]
        }
    ];

    res.render('compliance.njk', {
        breadcrumbs: [
            { text: "Home", href: "/" },
            { text: "Compliance Reports", href: "/compliance" }
        ],
        navigationSections: navigationSections
    });
});

app.use('/compliance/tagging', createTaggingRouter({ breadcrumbs: complianceBreadcrumbs }))

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
