-- =======================================================
-- Service card summaries (≤15 words) – paste into Supabase SQL Editor
-- =======================================================
-- Updates ONLY the summary (description) of each service card.
-- Preserves all other content: fields, linkText, order, and any other keys.
-- Note: Only runs when a row with id = 'services' already exists.
-- =======================================================

WITH sc AS (
  SELECT id, content FROM site_content WHERE id = 'services' LIMIT 1
),
summary_updates AS (
  SELECT * FROM (VALUES
    ('/services/virtual-cfo', 'Strategic financial expertise without a full-time CFO. Planning, reporting, and investor relations.'),
    ('/services/equity-financing', 'Strategic equity investment for growth-stage and established companies across global markets.'),
    ('/services/real-estate-financing', 'Global property financing for developers, asset owners, and institutional investors.'),
    ('/services/reits', 'Institutional-grade REITs for diversified exposure to income-generating real estate.'),
    ('/services/share-financing', 'Unlock liquidity using listed shares as collateral. Non-dilutive financing for companies and shareholders.'),
    ('/services/merger-acquisition', 'Strategic advisory for mergers, acquisitions, and corporate restructuring.'),
    ('/services/tokenization', 'Tokenize real-world assets for fractional ownership and global investor access.'),
    ('/services/asset-insurance', 'Structured protection for high-value assets, investment portfolios, and strategic holdings.'),
    ('/services/ppli', 'Wealth preservation and estate planning through life insurance and tax-efficient structures.'),
    ('/services/gig', 'Curated access to global investors and strategic partners for qualified companies.'),
    ('/services/private-wealth', 'Exclusive investment and lifestyle platform for ultra-high-net-worth individuals.'),
    ('/services/aum', 'Discretionary and advisory asset management for institutions, family offices, and high-net-worth clients.')
  ) AS t(link, new_summary)
),
items_with_updated_summary AS (
  SELECT
    t.ord,
    (elem || jsonb_build_object('summary', COALESCE(s.new_summary, elem->>'summary'))) AS new_elem
  FROM sc, jsonb_array_elements(sc.content->'items') WITH ORDINALITY AS t(elem, ord)
  LEFT JOIN summary_updates s ON elem->>'link' = s.link
),
new_content AS (
  SELECT (SELECT content FROM sc) || jsonb_build_object('items', (
    SELECT jsonb_agg(new_elem ORDER BY ord) FROM items_with_updated_summary
  )) AS content
)
UPDATE site_content
SET content = (SELECT content FROM new_content), updated_at = NOW()
WHERE id = 'services';

-- Verify (run after: you should see 12 and unchanged structure)
SELECT id, jsonb_array_length(content->'items') AS card_count FROM site_content WHERE id = 'services';
