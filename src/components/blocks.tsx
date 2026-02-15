
export function HeroBlock({ title, subtitle, image, editable, onEdit }: any) {
  return (
    <section className="home-hero">
      <div>
        {editable ? (
          <input
            className="home-title"
            style={{ fontSize: '2.5rem', fontWeight: 900, width: '100%', marginBottom: 8, background: '#23232b', color: '#f59e42', border: 'none', borderRadius: 6, padding: 8 }}
            value={title || ''}
            placeholder="Title"
            onChange={e => onEdit?.({ title: e.target.value })}
          />
        ) : (
          <h1 className="home-title">{title}</h1>
        )}
        {editable ? (
          <input
            className="home-subtitle"
            style={{ width: '100%', background: '#23232b', color: '#fff', border: 'none', borderRadius: 6, padding: 8, fontSize: 18, marginBottom: 12 }}
            value={subtitle || ''}
            placeholder="Subtitle"
            onChange={e => onEdit?.({ subtitle: e.target.value })}
          />
        ) : (
          <div className="home-subtitle">{subtitle}</div>
        )}
      </div>
      <div className="home-hero-image">
        {editable ? (
          <input
            type="text"
            value={image || ''}
            placeholder="Image URL"
            style={{ width: '100%', background: '#23232b', color: '#fff', border: 'none', borderRadius: 6, padding: 8, fontSize: 16, marginBottom: 8 }}
            onChange={e => onEdit?.({ image: e.target.value })}
          />
        ) : null}
        <img src={image && image.trim() !== '' ? image : '/products/placeholder.svg'} alt="hero" style={{ maxHeight: 320, borderRadius: 16 }} />
      </div>
    </section>
  );
}

export function FeaturedBlock() {
  // Placeholder: could fetch featured products
  return (
    <section className="home-featured">
      <h2 className="home-featured-header">Featured Products</h2>
      {/* ...could map featured products here... */}
    </section>
  );
}

export function NewsletterBlock() {
  return (
    <section className="home-newsletter">
      <h2>Subscribe to our newsletter</h2>
      <form className="newsletter-form">
        <input type="email" placeholder="Your email" style={{ padding: 10, borderRadius: 8, fontSize: 18 }} />
        <button type="submit" style={{ background: '#f472b6', color: '#fff', padding: 10, borderRadius: 8 }}>Subscribe</button>
      </form>
    </section>
  );
}

export function TextBlock({ text, editable, onEdit }: any) {
  return (
    <section className="home-text-block" style={{ padding: 24, background: '#18181b', borderRadius: 12, color: '#fff', fontSize: 20 }}>
      {editable ? (
        <textarea
          value={text || ''}
          placeholder="Enter text..."
          style={{ width: '100%', minHeight: 60, background: '#23232b', color: '#fff', border: 'none', borderRadius: 6, padding: 8, fontSize: 20 }}
          onChange={e => onEdit?.({ text: e.target.value })}
        />
      ) : (
        <div>{text}</div>
      )}
    </section>
  );
}

export const BLOCKS = {
  hero: HeroBlock,
  featured: FeaturedBlock,
  newsletter: NewsletterBlock,
  text: TextBlock,
};
