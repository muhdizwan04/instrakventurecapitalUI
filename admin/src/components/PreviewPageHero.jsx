import React from 'react';

const PreviewPageHero = ({ title, subtitle, className, style }) => {
    return (
        <section className={`preview-page-hero ${className || ''}`} style={style}>
            <div className="preview-container">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            <div className="preview-overlay"></div>

            <style>{`
                .preview-page-hero {
                    position: relative;
                    height: 250px; /* Slightly smaller for admin preview */
                    display: flex;
                    align-items: center;
                    background: #FAFBFC;
                    padding-top: 40px;
                    overflow: hidden;
                    border-bottom: 1px solid #e2e8f0;
                }

                .preview-container {
                    position: relative;
                    z-index: 10;
                    padding: 0 2rem;
                    width: 100%;
                }

                .preview-page-hero h1 {
                    font-size: 2rem; /* Scaled down */
                    margin-bottom: 0.75rem;
                    color: #1A365D;
                    font-weight: 700;
                    font-family: 'Outfit', sans-serif; /* Assume font is available */
                }

                .preview-page-hero p {
                    font-size: 1rem;
                    color: #4A5568;
                    max-width: 600px;
                    line-height: 1.6;
                }

                .preview-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        linear-gradient(rgba(26, 54, 93, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(26, 54, 93, 0.03) 1px, transparent 1px);
                    background-size: 50px 50px;
                    z-index: 1;
                }

                .preview-overlay::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 15%;
                    bottom: 15%;
                    width: 4px;
                    background: linear-gradient(180deg, transparent, #B8860B 30%, #1A365D 70%, transparent);
                    z-index: 2;
                }

                .preview-page-hero::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #1A365D 0%, #B8860B 50%, #1A365D 100%);
                    z-index: 5;
                }
            `}</style>
        </section>
    );
};

export default PreviewPageHero;
