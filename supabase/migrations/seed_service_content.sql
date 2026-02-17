-- =======================================================
-- 📄 SEED ALL 12 SERVICE PAGE CONTENT
-- =======================================================
-- This migration inserts/updates the service_pages content
-- in the site_content table with all 12 investment services.
--
-- Run this in Supabase Dashboard → SQL Editor → New query
-- =======================================================

INSERT INTO public.site_content (id, content)
VALUES (
  'service_pages',
  '{
    "pages": [
      {
        "id": "aum",
        "title": "ASSET UNDER MANAGEMENT (AUM)",
        "subtitle": "Structured Capital. Strategic Growth. Global Reach.",
        "introduction": "IVC provides discretionary and advisory asset management services tailored to institutional investors, family offices, and high-net-worth individuals. Our AUM platform is designed with disciplined governance, transparent processes, and institutional-grade execution to ensure long-term value creation and risk-managed growth.",
        "philosophy": [
          { "title": "Global Equities", "desc": "Strategic sector allocation across global equity markets." },
          { "title": "Private Markets", "desc": "Access to private market investments and alternative opportunities." },
          { "title": "Real Estate & Infrastructure", "desc": "Diversified exposure to real estate and infrastructure assets." },
          { "title": "Structured Financing", "desc": "Structured financing opportunities and alternative assets." }
        ],
        "services": [
          { "title": "Institutional-Grade Portfolio", "desc": "Institutional-grade portfolio construction with risk-managed strategies." },
          { "title": "Global Investment Access", "desc": "Access to global investment opportunities across multiple asset classes." },
          { "title": "Performance Monitoring", "desc": "Comprehensive performance monitoring and reporting for all mandates." },
          { "title": "Risk Management", "desc": "Disciplined risk management across all investment strategies." }
        ],
        "whoWeServe": [
          { "title": "Family Offices", "desc": "Tailored wealth preservation and growth solutions." },
          { "title": "Institutional Investors", "desc": "Pension funds, endowments, and sovereign-linked entities." },
          { "title": "Sovereign-Linked Entities", "desc": "Strategic partnerships with sovereign wealth entities." },
          { "title": "Corporate Treasury", "desc": "Corporate treasury portfolio management and optimization." }
        ],
        "approach": [
          { "title": "Understanding Objectives", "desc": "Consultation to identify goals, risk tolerance, and strategic priorities." },
          { "title": "Bespoke Mandates", "desc": "Tailored investment strategies and financing solutions." },
          { "title": "Execution Excellence", "desc": "Leverage global networks and proprietary frameworks." },
          { "title": "Ongoing Stewardship", "desc": "Continuous monitoring, governance reporting, proactive adjustments." }
        ],
        "whyChoose": [
          { "title": "Global Reach", "desc": "Access to international markets and opportunities." },
          { "title": "Institutional Discipline", "desc": "Structured governance and risk management." },
          { "title": "High-Touch Service", "desc": "Dedicated portfolio teams for every client." },
          { "title": "Confidentiality & Trust", "desc": "Strict fiduciary standards and privacy." }
        ],
        "disclaimer": "IVC provides information for general purposes only. This does not constitute an offer, solicitation, or recommendation for investment. Engagements are subject to formal mandate agreements, regulatory approvals, and professional due diligence."
      },
      {
        "id": "private-wealth",
        "title": "PRIVATE WEALTH MANAGEMENT",
        "subtitle": "The Luxury Dubai — Premium Investment & Lifestyle Platform",
        "introduction": "A premium investment and lifestyle platform designed for ultra-high-net-worth individuals (UHNWIs) seeking exclusive access to global investment opportunities and high-end lifestyle services.",
        "overview": {
          "heading": "Premium Wealth Solutions",
          "description": "Exclusive access to global investment opportunities and high-end lifestyle services for UHNWIs."
        },
        "services": [
          { "title": "Private Investment Deals", "desc": "Access to exclusive private investment deals and co-investment opportunities." },
          { "title": "Prime Real Estate", "desc": "Real estate opportunities in prime global locations including Dubai, London, and Singapore." },
          { "title": "Structured Wealth Solutions", "desc": "Bespoke wealth structuring and preservation strategies." },
          { "title": "Lifestyle Privileges", "desc": "Exclusive lifestyle privileges and concierge services in Dubai." }
        ],
        "whoWeServe": [
          { "title": "Ultra-High-Net-Worth Individuals", "desc": "Personalized wealth management for UHNWIs." },
          { "title": "Family Offices", "desc": "Multi-generational wealth preservation and growth." },
          { "title": "Global Entrepreneurs", "desc": "Strategic investment advisory for global business leaders." },
          { "title": "Corporate Principals", "desc": "Wealth management for corporate executives and principals." }
        ]
      },
      {
        "id": "share-financing",
        "title": "STOCK LOAN / SHARE FINANCING (SL/SF)",
        "subtitle": "Unlock liquidity using your listed shares as collateral.",
        "introduction": "A structured financing solution that enables publicly listed companies and major shareholders to unlock liquidity using their listed shares as collateral. Our platform connects you with global institutional lenders for fast, flexible, and non-dilutive financing.",
        "overview": {
          "heading": "Share-Backed Liquidity",
          "description": "Unlock the value of your equity holdings with flexible financing solutions."
        },
        "services": [
          { "title": "Non-Dilutive Financing", "desc": "Access capital without diluting your equity ownership or control." },
          { "title": "Fast Capital Access", "desc": "Rapid funding solutions with streamlined approval processes." },
          { "title": "Flexible Loan Structures", "desc": "Customizable loan terms, repayment schedules, and LTV ratios." },
          { "title": "Global Institutional Lenders", "desc": "Access to a network of international institutional lenders." }
        ],
        "whoWeServe": [
          { "title": "Corporate Expansion", "desc": "Financing for business growth and market expansion." },
          { "title": "Strategic Acquisitions", "desc": "Capital for mergers, acquisitions, and strategic investments." },
          { "title": "Debt Restructuring", "desc": "Solutions for corporate debt optimization and restructuring." },
          { "title": "Working Capital", "desc": "Short-term liquidity support for operational needs." }
        ]
      },
      {
        "id": "equity-financing",
        "title": "EQUITY FINANCING (EF)",
        "subtitle": "Strategic equity investors across global markets.",
        "introduction": "IVC connects growth-stage and established companies with strategic equity investors across global markets. Our platform facilitates private placements, strategic investor introductions, cross-border equity investments, and pre-IPO and growth capital funding.",
        "overview": {
          "heading": "Strategic Equity Capital",
          "description": "Connecting companies with the right equity investors for sustainable growth."
        },
        "services": [
          { "title": "Private Placements", "desc": "Structured private placement offerings for qualified investors." },
          { "title": "Strategic Investor Introductions", "desc": "Curated introductions to strategic and institutional investors." },
          { "title": "Cross-Border Investments", "desc": "Facilitating equity investments across international markets." },
          { "title": "Pre-IPO & Growth Capital", "desc": "Funding solutions for companies preparing for IPO or scaling operations." }
        ],
        "whoWeServe": [
          { "title": "Public Listed Companies", "desc": "Capital raising and investor relations for listed firms." },
          { "title": "High-Growth Private Companies", "desc": "Equity funding for rapidly scaling businesses." },
          { "title": "Expansion-Stage Enterprises", "desc": "Growth capital for companies entering new markets." }
        ]
      },
      {
        "id": "real-estate-financing",
        "title": "REAL ESTATE FINANCING (REF)",
        "subtitle": "Global property financing for developers and institutional investors.",
        "introduction": "A global property financing platform supporting developers, asset owners, and institutional investors. Our platform provides development financing, bridge financing, asset refinancing, and cross-border property investment solutions.",
        "overview": {
          "heading": "Global Property Financing",
          "description": "Comprehensive real estate financing solutions across all property segments."
        },
        "services": [
          { "title": "Development Financing", "desc": "Capital for property development projects from ground-up to completion." },
          { "title": "Bridge Financing", "desc": "Short-term financing solutions to bridge gaps in property transactions." },
          { "title": "Asset Refinancing", "desc": "Restructuring existing property debt for better terms and conditions." },
          { "title": "Cross-Border Investments", "desc": "Facilitating international property investment and financing." }
        ],
        "whoWeServe": [
          { "title": "Commercial Real Estate", "desc": "Office, retail, and industrial property financing." },
          { "title": "Hospitality & Hotels", "desc": "Financing for hotel and hospitality developments." },
          { "title": "Mixed-Use Developments", "desc": "Capital for integrated mixed-use property projects." },
          { "title": "Luxury Residential", "desc": "Financing for premium residential assets and developments." }
        ]
      },
      {
        "id": "ppli",
        "title": "MORTGAGE LOAN (ML)",
        "subtitle": "Structured mortgage solutions for high-value properties.",
        "introduction": "IVC offers structured mortgage solutions for high-value properties and strategic real estate assets. Our platform provides high-value property financing, international mortgage structures, flexible repayment terms, and asset-backed credit facilities.",
        "overview": {
          "heading": "Premium Mortgage Solutions",
          "description": "Tailored mortgage structures for high-value and strategic real estate assets."
        },
        "services": [
          { "title": "High-Value Property Financing", "desc": "Mortgage solutions for premium and luxury real estate assets." },
          { "title": "International Mortgage Structures", "desc": "Cross-border mortgage arrangements for global property portfolios." },
          { "title": "Flexible Repayment Terms", "desc": "Customizable repayment schedules aligned with client cash flow." },
          { "title": "Asset-Backed Credit Facilities", "desc": "Credit facilities secured against high-value real estate holdings." }
        ]
      },
      {
        "id": "reits",
        "title": "BOND ISSUANCE (BI)",
        "subtitle": "Advisory and structuring for corporate bond issuance.",
        "introduction": "IVC provides advisory and structuring services for corporate bond issuance across global capital markets. Our services include bond structuring, investor placement, credit positioning, and institutional distribution.",
        "overview": {
          "heading": "Capital Market Bond Solutions",
          "description": "End-to-end advisory for bond issuance across global capital markets."
        },
        "services": [
          { "title": "Bond Structuring", "desc": "Designing optimal bond structures for corporate issuers." },
          { "title": "Investor Placement", "desc": "Connecting issuers with qualified institutional bond investors." },
          { "title": "Credit Positioning", "desc": "Strategic credit positioning to optimize bond pricing and terms." },
          { "title": "Institutional Distribution", "desc": "Global distribution network for bond placement and settlement." }
        ],
        "whoWeServe": [
          { "title": "Corporate Bonds", "desc": "Standard corporate bond issuance and placement." },
          { "title": "Project Bonds", "desc": "Infrastructure and project-specific bond financing." },
          { "title": "Structured Notes", "desc": "Customized structured note offerings." },
          { "title": "Sukuk (Islamic Bonds)", "desc": "Shariah-compliant bond structuring and issuance." }
        ]
      },
      {
        "id": "merger-acquisition",
        "title": "MERGER & ACQUISITION (M&A)",
        "subtitle": "Strategic advisory for mergers, acquisitions, and corporate restructuring.",
        "introduction": "IVC offers strategic advisory for mergers, acquisitions, and corporate restructuring. Our capabilities include buy-side and sell-side advisory, strategic investor matching, valuation and negotiation support, and cross-border transaction execution.",
        "overview": {
          "heading": "Strategic M&A Advisory",
          "description": "Comprehensive advisory for corporate transactions and restructuring."
        },
        "services": [
          { "title": "Buy-Side Advisory", "desc": "Strategic acquisition support including target identification and due diligence." },
          { "title": "Sell-Side Advisory", "desc": "Maximizing value for sellers through structured sale processes." },
          { "title": "Valuation & Negotiation", "desc": "Professional valuation services and negotiation support." },
          { "title": "Cross-Border Execution", "desc": "Managing complex international merger and acquisition transactions." }
        ]
      },
      {
        "id": "gig",
        "title": "GLOBAL INVESTMENT GATEWAY (GIG)",
        "subtitle": "Your structured entry point to global capital markets and strategic partners.",
        "introduction": "A proprietary platform connecting companies with qualified global investors through a curated institutional network. GIG provides the tools, visibility, and connections necessary to scale your business on a global stage through strategic capital matching and cross-border deal introductions.",
        "overview": {
          "heading": "Global Investor Network",
          "description": "Connecting companies with qualified global investors through a curated institutional network."
        },
        "services": [
          { "title": "Global Investor Database", "desc": "Access to a comprehensive database of qualified institutional investors worldwide." },
          { "title": "Strategic Capital Matching", "desc": "AI-powered matching of companies with the most suitable capital sources." },
          { "title": "Cross-Border Introductions", "desc": "Facilitated introductions to investors across global financial hubs." },
          { "title": "Corporate Access Program", "desc": "Subscription-based corporate access to the GIG investor network." }
        ],
        "whoWeServe": [
          { "title": "International Capital Seekers", "desc": "Companies seeking international capital for growth." },
          { "title": "Expansion-Stage Businesses", "desc": "Businesses ready to scale into new markets." },
          { "title": "Strategic Joint Ventures", "desc": "Companies seeking strategic partnership opportunities." }
        ]
      },
      {
        "id": "virtual-cfo",
        "title": "VIRTUAL CFO (VCFO)",
        "subtitle": "Strategic financial management without the full-time cost.",
        "introduction": "A strategic financial management solution designed for companies that require high-level financial expertise without the cost of a full-time CFO. Our services include financial strategy and planning, capital structure optimization, investor relations support, and financial reporting and governance.",
        "overview": {
          "heading": "Strategic Financial Leadership",
          "description": "High-level financial expertise and strategic advisory on demand."
        },
        "services": [
          { "title": "Financial Strategy & Planning", "desc": "Comprehensive financial strategy development and budgeting." },
          { "title": "Capital Structure Optimization", "desc": "Optimizing debt-equity mix and capital allocation strategies." },
          { "title": "Investor Relations", "desc": "Managing investor communications, reporting, and engagement." },
          { "title": "Financial Governance", "desc": "Implementing robust financial reporting and compliance frameworks." }
        ],
        "whoWeServe": [
          { "title": "Growth-Stage Companies", "desc": "Financial leadership for rapidly scaling businesses." },
          { "title": "Public Listed Firms", "desc": "CFO-level support for listed company requirements." },
          { "title": "Cross-Border Enterprises", "desc": "Financial management for international operations." }
        ]
      },
      {
        "id": "asset-insurance",
        "title": "ASSET INSURANCE (AI)",
        "subtitle": "Structured risk management for high-value assets.",
        "introduction": "A structured risk-management solution designed to protect high-value assets, investment portfolios, and strategic holdings. Our coverage areas include corporate assets, real estate portfolios, investment-linked insurance, and structured protection solutions.",
        "overview": {
          "heading": "Comprehensive Asset Protection",
          "description": "Structured risk management solutions for high-value assets and strategic holdings."
        },
        "services": [
          { "title": "Corporate Asset Protection", "desc": "Comprehensive insurance coverage for corporate assets and operations." },
          { "title": "Real Estate Portfolio Insurance", "desc": "Protecting real estate investments across multiple jurisdictions." },
          { "title": "Investment-Linked Insurance", "desc": "Insurance products linked to investment portfolios for dual benefits." },
          { "title": "Structured Protection", "desc": "Bespoke risk management solutions for complex asset structures." }
        ]
      },
      {
        "id": "tokenization",
        "title": "TOKENIZATION (Tz)",
        "subtitle": "Digital asset structuring for fractional ownership.",
        "introduction": "A digital asset structuring platform that enables the tokenization of real-world assets for fractional ownership and global investor access. Applications include real estate tokenization, fund tokenization, infrastructure assets, and private investment vehicles.",
        "overview": {
          "heading": "Digital Asset Innovation",
          "description": "Tokenizing real-world assets for fractional ownership and global access."
        },
        "services": [
          { "title": "Real Estate Tokenization", "desc": "Converting property assets into tradeable digital tokens for fractional ownership." },
          { "title": "Fund Tokenization", "desc": "Digitizing investment fund structures for broader investor participation." },
          { "title": "Infrastructure Assets", "desc": "Tokenizing infrastructure projects for diversified investor access." },
          { "title": "Private Investment Vehicles", "desc": "Creating digital tokens for private equity and venture capital investments." }
        ],
        "whoWeServe": [
          { "title": "Increased Liquidity", "desc": "Converting illiquid assets into tradeable digital tokens." },
          { "title": "Global Participation", "desc": "Enabling worldwide investor access to tokenized assets." },
          { "title": "Transparent Ownership", "desc": "Blockchain-based ownership records and audit trails." },
          { "title": "Efficient Settlement", "desc": "Blockchain-based settlement for faster and cheaper transactions." }
        ]
      }
    ]
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE
SET content = EXCLUDED.content,
    updated_at = NOW();
