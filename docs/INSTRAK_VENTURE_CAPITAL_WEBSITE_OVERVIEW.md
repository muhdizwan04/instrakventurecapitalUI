# INSTRAK VENTURE CAPITAL - WEBSITE OVERVIEW

## Document Purpose

This document explains the Instrak Venture Capital website in business terms for management, buyers, partners, and non-technical stakeholders.

It is based on a review of the current implementation in this repository as of April 4, 2026. The purpose of this version is to describe the product at a business level while staying accurate to what is currently built.

## 1. Overview

### 1.1 What This Product Is

Instrak Venture Capital currently operates a dual-platform website solution:

- A public corporate website for brand presentation, service promotion, investor communication, lead generation, and public engagement.
- A private admin panel for internal teams to manage content, branding, inquiries, selected forms, and registered client records without relying on developers for daily updates.

In practical terms, this is not just a brochure website. It is a business-managed website platform with built-in content management and lead-handling capability.

### 1.2 What the Website Is Designed to Achieve

The platform is designed to help Instrak Venture Capital:

- Present the company professionally to clients, investors, and partners.
- Explain services in a structured and scalable way.
- Capture leads and inquiries from multiple public entry points.
- Allow internal teams to update content, images, forms, and menus without code changes.
- Maintain brand consistency across pages.
- Support internal follow-up through a centralized inquiry management workflow.

### 1.3 Who This Product Is For

The current solution serves several business audiences:

| Audience | How They Use the Website |
| --- | --- |
| Prospects and clients | Learn about the company, explore services, submit inquiries, complete qualification flows |
| Investors | Review investor-facing content and submit investor interest forms |
| Partners and industry contacts | Review strategic positioning, project listings, and contact information |
| Job seekers | Review openings and apply through email or external application links |
| Marketing and operations team | Update pages, content, menus, forms, branding, and media through the admin panel |
| Leadership and management | Review inquiries, monitor website activity, and maintain a professional digital presence |

### 1.4 Core Business Value

At a business level, the main value of this system is:

- Content can be managed by internal teams rather than developers.
- Leads from different parts of the website are stored in one place.
- The website can grow over time through structured page and service management.
- Branding, navigation, and SEO defaults can be maintained centrally.
- The platform supports both open public browsing and controlled gated flows where needed.

### 1.5 High-Level Product Summary

| Component | Business Purpose | Current Status |
| --- | --- | --- |
| Public website | Brand, services, news, careers, investor communication, project visibility, contact capture | Implemented |
| Admin panel | Internal content and inquiry management | Implemented |
| Inquiry management | Centralized follow-up workflow for submissions | Implemented |
| Client login and verification | Used for gated forms and assessments | Implemented |
| Investor portal dashboard | Full logged-in investor portal experience | Not fully implemented |
| Client self-service dashboard | Full logged-in client portal experience | Not currently exposed |

## 2. Feature List Detail

### 2.1 Public Website Features

### A. Home Page

The home page is designed to act as the main brand and conversion entry point. It currently supports:

- A configurable hero section
- Editable headlines, subheadings, and body copy
- Configurable call-to-action buttons
- Focus services presentation
- Trust indicators and business signals
- Metrics or credibility highlights
- Focus industries section
- Additional custom homepage sections

Business value:

- Gives the business team control over first impressions.
- Allows ongoing messaging updates without redeveloping the page.
- Supports promotional campaigns, positioning updates, and seasonal content refreshes.

### B. About Page

The About page is more than a simple company profile. It supports structured corporate storytelling, including:

- Company introduction
- Mission or positioning sections
- Board and leadership presentation
- Strategic partner content
- Milestone or company-progress content
- Additional custom content blocks

Business value:

- Helps build trust and credibility with investors, clients, and partners.
- Supports deeper storytelling than a typical corporate profile page.
- Allows leadership and partner information to be maintained by internal teams.

### C. Services Landing Page

The services landing page is designed to present the firm's service portfolio in an organized way. It supports:

- Grouped service categories
- Service summaries
- Configurable hero and introduction content
- Configurable call-to-action areas
- Custom sections and supporting content

Business value:

- Helps users understand the breadth of offerings quickly.
- Makes service navigation easier as the business grows.
- Allows the business to reposition service groups without rebuilding the site.

### D. Service Detail Pages

The website contains dedicated pages for the firm's core services. These currently include:

- Business Finance Consulting / Virtual CFO
- Equity Financing
- Real Estate Financing
- REITs
- Share Financing
- Merger and Acquisition
- Tokenization
- Asset Insurance
- PPLI
- Global Investment Gateway
- Private Wealth
- Asset Under Management

Each service page can include:

- Hero content
- Service explanation sections
- Supporting content blocks
- Highlight items and structured lists
- Images and visual sections
- Inquiry forms
- Custom form fields depending on the service

Business value:

- Makes each service easier to explain in detail.
- Supports targeted lead capture by service type.
- Gives the team flexibility to expand or reorganize offerings over time.

### E. Dynamic Service Inquiry Forms

The system includes configurable forms for service pages. These forms can be tailored through the admin panel and may include:

- Standard text fields
- Email fields
- Phone fields
- Number fields
- Text areas
- Dropdown selections
- Checkbox fields
- Section headings and grouping blocks

The appearance of these forms can also be adjusted, including:

- Button style
- Card styling
- Field styling
- Labels
- Colors
- Border radius
- Input appearance

Business value:

- Different services can ask different questions without development work.
- Internal teams can improve lead quality by collecting more relevant information.
- Forms can be updated to support new campaigns or qualification criteria.

### F. AI Capital Assessment

The AI Capital Assessment is a guided qualification flow for visitors who want a more structured capital-readiness or suitability assessment. The current implementation supports:

- A multi-step question flow
- A gated access model through login
- Assessment scoring
- Recommendation output
- Risk observations
- Submission of results into the inquiry pipeline

Business value:

- Creates a more advanced lead entry point than a standard contact form.
- Helps pre-qualify prospects before manual follow-up.
- Gives the business a more consultative digital experience.

Important business note:

- The page content and questions are editable in the admin panel.
- The scoring logic itself is still code-based and not fully editable by non-technical users.

### G. Investors Page

The investors page is designed to communicate the firm's investor-facing proposition. It currently supports:

- Investor-oriented hero and positioning content
- Institutional portfolio content
- Workflow or onboarding explanation
- Investor inquiry form
- Protected submission flow requiring login

Business value:

- Creates a dedicated investor-facing entry point.
- Separates investor communication from general contact traffic.
- Supports more structured investor lead collection.

Important business note:

- The current product supports gated investor inquiry capture.
- It should not yet be described as a full investor dashboard or secure investor portal with reporting screens or document rooms.

### H. Contact Page

The contact page is a structured inquiry and contact-capture page. It currently supports:

- Contact information display
- Configurable contact form
- Optional preferred meeting date
- Optional preferred meeting time
- Required or optional scheduling fields
- Helper text and label controls

Business value:

- Centralizes general inquiries.
- Supports basic meeting-intent capture without a full booking platform.
- Gives operations teams clearer contact records in one place.

Important business note:

- The current implementation captures requested date and time information.
- It does not replace a full scheduling system with live calendar synchronization.

### I. News Page

The news page supports structured editorial publishing and currently includes:

- A configurable page header
- Magazine-style news blocks
- News and event item types
- Publish or hide controls
- Date fields
- Images
- Optional call-to-action links

Business value:

- Keeps the website active and current.
- Supports thought leadership and company updates.
- Allows the business to highlight announcements, events, and campaigns.

### J. Careers Page

The careers page currently supports:

- Hero and intro content
- Job listing display
- Apply buttons per role
- Default apply method using email or external links

Business value:

- Provides a professional recruitment page without needing a separate careers system.
- Allows hiring content to be updated by internal teams.

Important business note:

- The current public experience mainly routes applications through email or external links.
- It should not yet be described as a full on-site applicant tracking system.

### K. Project Listings Page

The project listings page currently supports:

- Project cards
- Category display
- Location
- Status
- Valuation
- Descriptions
- Images

Business value:

- Provides visibility for selected projects or opportunities.
- Supports institutional or commercial positioning.
- Gives the team a structured way to showcase relevant listings.

### L. Strategic Partners Page

The strategic partners page currently supports:

- Strategic partner presentation
- Banking partner presentation
- Trust or regulator-related content
- Additional supporting sections

Business value:

- Strengthens credibility.
- Demonstrates ecosystem relationships.
- Supports relationship-based business development.

### M. Authentication and Gated Access

The public website includes:

- User registration
- Login
- Logout
- Email verification handling
- Client-profile creation and maintenance

This is currently used to protect:

- Investor inquiry submissions
- Selected service inquiry flows
- AI Capital Assessment participation

Business value:

- Allows selected interactions to be limited to identified users.
- Improves lead quality for higher-value or more sensitive workflows.

Important business note:

- Client authentication exists.
- A separate client dashboard is not currently exposed as a full public feature.

### N. Chat Widget

The website includes a site-wide chatbot with conversation memory and backend processing. It currently supports:

- Welcome messaging
- Quick actions
- Basic guidance across services and contact pathways
- Persistent conversation history
- Intent-based response handling

Business value:

- Improves visitor engagement.
- Helps users find relevant services more quickly.
- Provides an additional conversion path for uncertain visitors.

### O. Branding, SEO, and Responsive Design

The website also includes broader operational features such as:

- Responsive design for desktop and mobile
- Shared navigation and footer
- Centralized branding controls
- Theme-color controls
- SEO defaults such as titles, descriptions, keywords, and social-sharing images

Business value:

- Keeps the brand presentation consistent.
- Reduces reliance on developers for everyday brand updates.
- Supports better discoverability and presentation in search and sharing contexts.

### 2.2 Admin Panel Features

The admin panel is the main internal operating tool for maintaining the website. It is designed so that non-developers can manage day-to-day website updates.

### A. Dashboard

The dashboard provides a management summary including:

- Inquiry totals
- New and in-progress counts
- Recent inquiry visibility
- Inquiry type breakdown
- Quick access to key modules

Business value:

- Gives internal teams a quick operational snapshot.
- Helps prioritize follow-up activity.

### B. Home Manager

This module allows the team to manage:

- Hero content
- Homepage section order
- Trust indicators
- Metrics
- Industry highlights
- Custom homepage sections

Business value:

- The homepage can be refreshed regularly without developer support.

### C. About, Board, and Partners Management

These modules allow the team to manage:

- About page sections
- Board members
- Leadership information
- Partner content
- Banking partner content
- Milestones and supporting content

Business value:

- The company story and credibility content stay current and maintainable.

### D. Services Management

The services administration area is one of the strongest modules in the system. It allows internal teams to manage:

- Service list and service ordering
- Service categories
- Services landing page settings
- Individual service detail pages
- Dynamic form fields on service pages
- Form appearance and structure

Business value:

- Services can evolve without major development work.
- The business can introduce, reorganize, or refine offerings more easily.

### E. Contact Manager

The contact manager allows the team to control:

- Contact page content
- Contact details
- Form labels
- Meeting scheduler settings
- Contact-page appearance

Business value:

- Improves operational control over a high-value lead-capture page.

### F. Investors Manager

This module allows the team to manage:

- Investor page messaging
- Portfolio items
- Onboarding steps
- Investor inquiry form fields
- Investor form appearance

Business value:

- Investor-facing messaging can be updated internally as priorities evolve.

### G. AI Assessment Manager

This module allows the team to manage:

- AI assessment page content
- Wizard steps
- Wizard questions
- Results-page copy
- General presentation and structure

Business value:

- The business can refine the assessment experience without redesigning the whole feature.

Important note:

- Scoring logic is still code-driven, so not every part of the assessment is controlled from the admin panel.

### H. News Manager

This module allows the team to:

- Create and organize news blocks
- Add or edit news items
- Add events
- Upload images
- Set dates
- Control publish or hide status

Business value:

- Makes content publishing easier for marketing and communications teams.

### I. Career Manager

This module allows the team to manage:

- Careers page content
- Job listings
- Apply labels
- Default application links
- Basic recruitment presentation

Business value:

- Hiring information can be kept up to date without code changes.

### J. Projects Manager

This module allows the team to manage:

- Project listing records
- Titles
- Categories
- Locations
- Status
- Valuation
- Descriptions
- Images

Business value:

- Keeps project-related content structured and easy to update.

### K. Navigation Manager

This module allows the team to manage:

- Main menu items
- Dropdown items
- Ordering
- Labels
- Links
- Navigation styling

Business value:

- Menus can be changed without developer involvement.
- Navigation can evolve as the site grows.

### L. Footer Manager

This module allows the team to manage:

- Company details
- Quick links
- Footer text
- Footer styling
- Logo

Business value:

- Keeps contact and footer information accurate and on-brand.

### M. Global Settings

This module provides centralized control over:

- Site identity
- Logo
- Favicon
- Theme colors
- SEO defaults

Business value:

- Gives management a central place for brand governance and shared website settings.

### N. Inquiries Manager

The inquiries manager acts as a lightweight internal CRM for web submissions. It currently allows the team to:

- View all inquiries
- Search by basic contact details
- Filter by status
- Filter by inquiry type
- Update inquiry status
- Add notes
- Export records to CSV
- Review AI assessment result data inside inquiry records

Current workflow statuses include:

- New
- In Progress
- Contacted
- Qualified
- Resolved
- Lost

Business value:

- Gives internal teams one place to review website-originated leads.
- Supports structured follow-up and basic reporting.

Important note:

- This is a practical inquiry management layer.
- It is not a full enterprise CRM platform.

### O. Users Manager

The users manager currently focuses on registered client records. It supports:

- Viewing registered client accounts
- Searching records
- Filtering by date
- Exporting to CSV
- Print-friendly PDF output

Business value:

- Helps the team review and report on registered website users.

Important note:

- This module is not a full admin-role management system.
- Admin access is currently controlled through a whitelist and backend authorization logic.

### P. Media Upload and Shared Editing Tools

The admin system also includes shared utilities such as:

- Image upload
- Optimized image conversion
- Appearance editors
- Layout pickers
- Form builders
- Form appearance controls

Business value:

- Makes the admin experience more consistent.
- Reduces the need for custom developer involvement for common changes.

### 2.3 Lead Capture and Operational Features

One of the strongest business functions in the current website is centralized lead capture.

The system currently captures inquiries from multiple sources, including:

- Contact page
- Investor page
- AI Capital Assessment
- Service inquiry forms

These records are stored in one inquiry system and can be:

- Reviewed by the internal team
- Updated by status
- Annotated with notes
- Exported

Business value:

- Different public entry points feed into one operational workflow.
- The team can follow up on leads without checking multiple disconnected tools.

### 2.4 Security and Control Features

The platform includes several important controls that matter from a business risk perspective:

- Separate public and admin applications
- Login-protected admin access
- Admin authorization based on whitelist and backend checks
- Database-level access control
- Protected gated flows for selected public interactions

Business value:

- Reduces the risk of unauthorized content changes.
- Creates better separation between public users and internal operators.

## 3. How to Use

This section explains how the platform is typically used in day-to-day business operations.

### 3.1 How Internal Teams Use the Admin Panel

### Step 1. Log In to the Admin Panel

Authorized team members log in using approved admin credentials. Access is restricted to approved admin accounts.

### Step 2. Review the Dashboard

After login, the team can review:

- New inquiries
- In-progress inquiries
- Recent activity
- Quick links to major content areas

This helps the team decide what needs immediate attention.

### Step 3. Update Main Website Content

To update public-facing information, the team can go to the relevant manager, for example:

- Home manager for homepage messaging
- About manager for company profile content
- Services manager for service listings and service details
- News manager for articles and announcements
- Career manager for job openings
- Contact manager for contact information and form settings

### Step 4. Update Branding and Shared Website Elements

To keep the website aligned with the company's branding, the team can update:

- Navigation
- Footer
- Logo
- Theme colors
- Default SEO settings

This ensures consistency across the website.

### Step 5. Manage Service Pages and Inquiry Forms

If the business wants to improve lead quality or launch a new campaign, the team can:

- Edit service descriptions
- Reorganize service categories
- Change service page layouts
- Update form questions
- Adjust form design and call-to-action wording

### Step 6. Publish Updates

When content changes are saved in the admin panel, they are reflected on the live website through the shared content system. This reduces the need for developer deployment work for normal content edits.

### Step 7. Review Inquiries

The operations or business-development team can then open the inquiries manager to:

- Review new submissions
- Read details
- Check AI assessment information where applicable
- Add notes
- Move records through the follow-up stages

### Step 8. Export Records When Needed

For reporting, handover, or offline processing, the team can export inquiry data or registered client data.

### Step 9. Maintain Ongoing Content Hygiene

Good ongoing practice includes:

- Reviewing outdated news items
- Refreshing homepage messaging
- Updating leadership and partner content
- Checking service descriptions
- Verifying that contact information stays current

### 3.2 How Visitors and Clients Use the Public Website

### Step 1. Browse the Website

Visitors can access the main pages, review company information, read service content, and explore industry or investor-facing sections.

### Step 2. Choose a Relevant Path

Depending on their needs, visitors may:

- Read more about the company
- Explore services
- View investor information
- Read news
- Review projects or partnerships
- Visit the contact page

### Step 3. Submit an Inquiry or Complete a Guided Flow

Visitors can submit:

- General contact inquiries
- Service-related inquiries
- Investor interest forms
- AI Capital Assessment submissions

### Step 4. Register or Log In If Required

For certain protected experiences, users may need to register, log in, and verify their email before they can proceed.

### Step 5. Wait for Internal Follow-Up

After submission, the inquiry appears in the admin-side inquiry manager for review and follow-up by the Instrak team.

### 3.3 Typical Business Workflow Example

A simple real-world workflow might look like this:

1. Marketing updates the homepage banner and trust content before a campaign.
2. Management updates one or more service pages with revised messaging and form questions.
3. A prospect visits the site, reads the relevant service page, and submits an inquiry.
4. The inquiry appears in the inquiries manager.
5. The business-development team reviews the inquiry, adds notes, and changes the status.
6. Leadership can later export records for reporting or follow-up review.

## 4. Important Notes and Limitations

This section is important for keeping sales, management, and client-facing conversations accurate.

### 4.1 Full Investor Portal Is Not Yet Implemented

The website includes an investor page and gated investor inquiry flow. However, it should not currently be described as a full investor portal with secure dashboards, downloadable reports, or document-room functionality.

### 4.2 Full Client Dashboard Is Not Currently Exposed

Client registration and login exist, and selected flows are gated. However, a separate client self-service dashboard is not currently exposed as a complete public feature.

### 4.3 Admin Role Management Is Not a Full UI Workflow

The admin system includes login protection and admin authorization, but admin-role control is primarily handled through the backend whitelist and authorization logic. It is not currently a full role-management interface inside the admin panel.

### 4.4 Careers Applications Are Not Fully Native On-Site Workflows

The careers page is implemented and job listings can be managed internally. However, candidate applications are currently handled mainly through email or external links rather than a complete built-in applicant management process on the website itself.

### 4.5 AI Assessment Logic Is Partly Editable, Partly Developer-Controlled

The team can update the AI assessment page content, steps, and questions. However, the scoring logic and recommendation rules still require developer changes if the business wants to change how answers are evaluated.

### 4.6 Contact Scheduling Is Basic Request Capture

The contact page can capture preferred meeting dates and times, but it is not a full scheduling tool with calendar integration, automated slot management, or appointment confirmation logic.

### 4.7 Inquiry Management Is a Lightweight Internal CRM

The inquiry manager is useful and practical, but it should not be positioned as a replacement for a full enterprise CRM platform.

### 4.8 Website URLs Should Be Reviewed Before External Promotion

Some public routes use working internal URL patterns such as `/latest-news-2` and `/join-us`. These are fully functional, but they may need review if the business wants cleaner naming for external promotion, SEO, or final launch polish.

### 4.9 The Platform Depends on Hosting, Supabase, and Admin Governance

To operate smoothly, the business still needs:

- Hosting and domain setup
- Supabase environment and database availability
- Approved admin access management
- Ongoing content governance

## 5. FAQ

### Q1. Can our team update the website without a developer?

Yes, for most routine updates. The admin panel is built so internal teams can update content, images, navigation, forms, service information, and branding settings without code changes.

### Q2. Can we change the menu and footer ourselves?

Yes. Navigation and footer content are managed from the admin panel.

### Q3. Can we add, remove, or reorganize services?

Yes. The services module supports service-list editing, grouping, service-page management, and service-specific form configuration.

### Q4. Where do all inquiries go?

The main website inquiries are stored in a centralized inquiry system. This includes general contact inquiries, investor inquiries, AI assessment submissions, and service-related inquiries.

### Q5. Can we export leads or inquiry records?

Yes. The current admin system supports CSV export for inquiries. Registered client records can also be exported.

### Q6. Can visitors request a meeting through the website?

Yes, the contact page can collect preferred meeting date and time information. However, this is currently a request-capture feature rather than a live calendar booking system.

### Q7. Can investors log in to view reports and documents?

Not as a full implemented portal at this stage. The current system supports investor-facing content and gated inquiry submission, but not a complete investor dashboard environment.

### Q8. Can clients log in to a dedicated client dashboard?

Client login exists, but a separate client self-service dashboard is not currently exposed as a complete public feature.

### Q9. Can we change the forms shown on service pages?

Yes. The service form structure and appearance can be edited through the admin panel.

### Q10. Can we publish news and updates ourselves?

Yes. The news manager allows internal teams to create, edit, organize, and publish or hide news items.

### Q11. Can job applicants submit everything directly inside the website?

Not fully in the current setup. The website currently routes most job applications through email or external links.

### Q12. Can we manage admin users directly inside the admin panel?

Not as a full role-management workflow. Admin authorization is currently controlled mainly through the backend whitelist and access rules.

### Q13. Is the website mobile-friendly?

Yes. The public website is built to work across desktop and mobile layouts.

### Q14. Can the brand colors, logo, and SEO defaults be updated?

Yes. These are managed through the global settings area in the admin panel.

## 6. Final Business Summary

Instrak Venture Capital currently has a strong business-ready website platform that combines:

- A professional public-facing corporate website
- A private internal admin panel
- Centralized content control
- Structured service presentation
- Inquiry and lead management
- Gated higher-value workflows
- Brand and SEO administration

Its biggest strength is operational independence. Day-to-day website maintenance can be handled by the business team without relying on developers for every content change.

Its main limitations are scope-related rather than structural. The platform does not yet operate as a full investor portal, full client self-service portal, full scheduling platform, or full native recruitment system. Within its current scope, however, it is a robust and practical digital platform for corporate presentation, content management, and lead handling.
