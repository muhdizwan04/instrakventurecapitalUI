import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MagazineBlock.module.css';

const isExternalLink = (href) => {
  if (!href) return false;
  return /^https?:\/\//i.test(href) || /^mailto:/i.test(href) || /^tel:/i.test(href);
};

const formatDate = (iso) => {
  if (!iso) return '';
  // Expecting YYYY-MM-DD (admin date input) or ISO string
  const d = new Date(iso);
  // If invalid, return raw
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
};

const NavLink = ({ href, className, children }) => {
  if (!href) return <span className={className} style={{ opacity: 0.5, pointerEvents: 'none' }}>{children}</span>;
  if (isExternalLink(href)) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={href}>
      {children}
    </Link>
  );
};

const MagazineBlock = ({ block }) => {
  const blockStyles = block?.styles || {};
  const items = (block?.items || []).filter(it => it?.published !== false);

  const titleStyle = {
    fontFamily: blockStyles.titleFontFamily || undefined,
    fontSize: blockStyles.titleFontSize || undefined,
    fontWeight: blockStyles.titleFontWeight || undefined,
    color: blockStyles.titleColor || blockStyles.textColor || undefined,
    textAlign: blockStyles.titleAlign || undefined,
  };
  const subtitleStyle = {
    fontFamily: blockStyles.subtitleFontFamily || undefined,
    fontSize: blockStyles.subtitleFontSize || undefined,
    color: blockStyles.subtitleColor || blockStyles.textColor || undefined,
    opacity: blockStyles.subtitleColor || blockStyles.textColor ? 0.85 : undefined,
    textAlign: blockStyles.subtitleAlign || undefined,
  };
  const ctaStyle = (block?.ctaLabel && block?.ctaLink) ? {
    fontFamily: blockStyles.buttonFontFamily || undefined,
    fontSize: blockStyles.buttonFontSize || undefined,
    fontWeight: blockStyles.buttonFontWeight || undefined,
    color: blockStyles.buttonColor || undefined,
    borderColor: blockStyles.buttonBgColor || undefined,
  } : null;

  const sectionStyle = {
    backgroundColor: blockStyles.bgColor || 'transparent',
    color: blockStyles.textColor || undefined,
  };

  return (
    <section
      className={styles.block}
      style={sectionStyle}
    >
      <div className="container">
        <div className={styles.header} style={{ textAlign: blockStyles.titleAlign || undefined }}>
          <div className={styles.titleWrap}>
            {block?.title && (
              <h2 className={styles.title} style={titleStyle}>
                {block.title}
              </h2>
            )}
            {block?.subtitle && (
              <p className={styles.subtitle} style={subtitleStyle}>
                {block.subtitle}
              </p>
            )}
          </div>

          {(block?.ctaLabel && block?.ctaLink) && (
            <NavLink href={block.ctaLink} className={styles.cta} style={ctaStyle}>
              {block.ctaLabel}
            </NavLink>
          )}
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>No news/events published yet.</div>
        ) : (
          <div className={styles.grid}>
            {items.map((it) => {
              const isEvent = (it.type || '').toLowerCase() === 'event';
              const badgeClass = `${styles.badge} ${isEvent ? styles.badgeEvent : styles.badgeNews}`;
              const itemStyles = { ...blockStyles, ...(it.styles || {}) };
              const cardButtonText = (it.buttonLabel || itemStyles.itemButtonLabel || 'Read more').trim() || 'Read more';
              const itemTitleStyle = {
                fontFamily: itemStyles.itemTitleFontFamily || undefined,
                fontSize: itemStyles.itemTitleFontSize || undefined,
                fontWeight: itemStyles.itemTitleFontWeight || undefined,
                color: itemStyles.itemTitleColor || undefined,
              };
              const itemExcerptStyle = {
                fontFamily: itemStyles.itemExcerptFontFamily || undefined,
                fontSize: itemStyles.itemExcerptFontSize || undefined,
                color: itemStyles.itemExcerptColor || undefined,
              };
              const itemBtnStyle = {
                fontFamily: itemStyles.itemBtnFontFamily || undefined,
                fontSize: itemStyles.itemBtnFontSize || undefined,
                fontWeight: itemStyles.itemBtnFontWeight || undefined,
              };
              const itemBtnLabelStyle = {
                fontFamily: itemStyles.itemBtnFontFamily || undefined,
                fontSize: itemStyles.itemBtnFontSize || undefined,
                fontWeight: itemStyles.itemBtnFontWeight || undefined,
                color: itemStyles.itemBtnBgColor || itemStyles.itemTitleColor || undefined,
              };
              const cardStyle = {
                ...(itemStyles.itemBtnBgColor && { '--card-cta-bg': itemStyles.itemBtnBgColor }),
                ...(itemStyles.itemBtnColor && { '--card-cta-color': itemStyles.itemBtnColor }),
              };
              return (
                <article key={it.id} className={styles.card} style={Object.keys(cardStyle).length ? cardStyle : undefined}>
                  <div className={styles.media}>
                    {it.image ? <img src={it.image} alt={it.title || 'news image'} /> : null}
                    <div className={badgeClass}>{isEvent ? 'Event' : 'News'}</div>
                  </div>

                  <div className={styles.body}>
                    <div className={styles.meta}>
                      <span>{formatDate(it.date)}</span>
                      <span style={itemBtnLabelStyle}>{cardButtonText}</span>
                    </div>

                    <h3 className={styles.cardTitle} style={itemTitleStyle}>{it.title}</h3>
                    {it.excerpt && <p className={styles.excerpt} style={itemExcerptStyle}>{it.excerpt}</p>}

                    <div className={styles.cardCtaRow}>
                      <NavLink href={it.link} className={styles.cardCta} style={itemBtnStyle}>
                        {cardButtonText}
                      </NavLink>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MagazineBlock;

