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
    res.redirect('/compliance');
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
                { text: "Load Balancers", href: "/compliance/loadbalancers" },
                { text: "Database", href: "/compliance/database" },
                { text: "Decommissioning", href: "/compliance/decommissioning" },
                { text: "Containers", href: "/compliance/containers" },
                { text: "Monitoring and Alerting", href: "/compliance/monitoring" },
                { text: "AMIs", href: "/compliance/amis" },
                { text: "Agents and Ports", href: "/compliance/agents" }
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

// Policy configuration
const policies = [
    { key: 'tagging', title: 'Tagging' },
    { key: 'loadbalancers', title: 'Load Balancers' },
    { key: 'database', title: 'Database' },
    { key: 'decommissioning', title: 'Decommissioning' },
    { key: 'containers', title: 'Containers' },
    { key: 'monitoring', title: 'Monitoring and Alerting' },
    { key: 'amis', title: 'AMIs' },
    { key: 'agents', title: 'Agents and Ports' }
];

// Generate policy routes dynamically
policies.forEach(policy => {
    // Main policy route redirects to teams
    app.get(`/compliance/${policy.key}`, (req, res) => {
        res.redirect(`/compliance/${policy.key}/teams`);
    });

    // Teams route
    app.get(`/compliance/${policy.key}/teams`, (req, res) => {
        res.render(`policies/${policy.key}/teams.njk`, {
            breadcrumbs: [...complianceBreadcrumbs, { text: policy.title, href: `/compliance/${policy.key}` }],
            policy_title: policy.title,
            menu_items: [
                {href: `/compliance/${policy.key}/teams`, text:'Teams Overview'},
                {href: `/compliance/${policy.key}/services`, text:'Services Overview'},
            ]
        });
    });

    // Services route
    app.get(`/compliance/${policy.key}/services`, (req, res) => {
        res.render(`policies/${policy.key}/services.njk`, {
            breadcrumbs: [...complianceBreadcrumbs, { text: policy.title, href: `/compliance/${policy.key}` }],
            policy_title: policy.title,
            menu_items: [
                {href: `/compliance/${policy.key}/teams`, text:'Teams Overview'},
                {href: `/compliance/${policy.key}/services`, text:'Services Overview'},
            ]
        });
    });
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
