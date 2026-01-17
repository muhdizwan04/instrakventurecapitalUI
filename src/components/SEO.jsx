import React from 'react';
import { Helmet } from 'react-helmet-async';
import { usePageContent } from '../hooks/usePageContent';

const SEO = ({ title, description, keywords, image }) => {
    // Fetch global SEO defaults
    const { content: settings } = usePageContent('global_settings');
    const seoDefaults = settings?.seoDefaults || {};
    const siteIdentity = settings?.siteIdentity || {};

    // Determine final values with fallbacks
    // Use title template if available: "%s | Site Name"
    const siteName = siteIdentity.siteName || 'Instrak Venture Capital';
    const titleTemplate = seoDefaults.metaTitleTemplate || '%s | Instrak Venture Capital';
    
    // Construct full title
    let fullTitle = title;
    if (title && titleTemplate.includes('%s')) {
        fullTitle = titleTemplate.replace('%s', title);
    } else if (!title) {
        fullTitle = siteName;
    }

    const finalDescription = description || seoDefaults.metaDescription || '';
    const finalKeywords = keywords || seoDefaults.keywords || '';
    const finalImage = image || seoDefaults.ogImage || siteIdentity.logoUrl || '';

    // URL to image (ensure absolute path if needed, or handle relative)
    // For now assuming the image path is relative to public or absolute URL
    
    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={finalDescription} />
            {finalKeywords && <meta name="keywords" content={finalKeywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            {finalImage && <meta property="og:image" content={finalImage} />}
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={finalDescription} />
            {finalImage && <meta name="twitter:image" content={finalImage} />}

            {/* Favicon - if managed here, though usually statically in HTML or via Layout effect */}
            {siteIdentity.faviconUrl && (
                <link rel="icon" href={siteIdentity.faviconUrl} />
            )}
        </Helmet>
    );
};

export default SEO;
