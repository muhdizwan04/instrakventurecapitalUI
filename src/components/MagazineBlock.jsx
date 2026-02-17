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

  return (
    <section
      className={styles.block}
      style={{
        backgroundColor: blockStyles.bgColor || 'transparent',
        color: blockStyles.textColor || undefined,
      }}
    >
      <div className="container">
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            {block?.title && (
              <h2 className={styles.title} style={{ color: blockStyles.textColor || undefined }}>
                {block.title}
              </h2>
            )}
            {block?.subtitle && (
              <p className={styles.subtitle} style={{ color: blockStyles.textColor ? blockStyles.textColor : undefined, opacity: blockStyles.textColor ? 0.85 : undefined }}>
                {block.subtitle}
              </p>
            )}
          </div>

          {(block?.ctaLabel && block?.ctaLink) && (
            <NavLink href={block.ctaLink} className={styles.cta}>
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
              return (
                <article key={it.id} className={styles.card}>
                  <div className={styles.media}>
                    {it.image ? <img src={it.image} alt={it.title || 'news image'} /> : null}
                    <div className={badgeClass}>{isEvent ? 'Event' : 'News'}</div>
                  </div>

                  <div className={styles.body}>
                    <div className={styles.meta}>
                      <span>{formatDate(it.date)}</span>
                      <span style={{ fontWeight: 800, color: 'var(--accent-secondary)' }}>{it.buttonLabel || 'Read more'}</span>
                    </div>

                    <h3 className={styles.cardTitle}>{it.title}</h3>
                    {it.excerpt && <p className={styles.excerpt}>{it.excerpt}</p>}

                    <div className={styles.cardCtaRow}>
                      <NavLink href={it.link} className={styles.cardCta}>
                        {it.buttonLabel || 'Read more'}
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

