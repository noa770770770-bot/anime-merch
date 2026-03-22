'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SiteEditor() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('homepage');

  useEffect(() => {
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (key: string, value: string) => {
    setSaving(key);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      if (res.ok) {
        setContent(prev => ({ ...prev, [key]: value }));
      }
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="p-8">Loading Editor...</div>;

  const renderField = (key: string, label: string, type: 'text' | 'textarea' = 'text') => (
    <div key={key} style={{ marginBottom: 24, padding: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 12 }}>
        {type === 'textarea' ? (
          <textarea
            className="form-input"
            style={{ flex: 1, minHeight: 80, fontSize: 15 }}
            defaultValue={content[key] || ''}
            onBlur={(e) => { 
                if (e.target.value !== content[key]) handleUpdate(key, e.target.value);
            }}
          />
        ) : (
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, fontSize: 15 }}
            defaultValue={content[key] || ''}
            onBlur={(e) => {
                if (e.target.value !== content[key]) handleUpdate(key, e.target.value);
            }}
          />
        )}
        <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {saving === key ? '⏳' : '✅'}
        </div>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Key: <code>{key}</code> | Supports Emojis & URLs</p>
    </div>
  );

  return (
    <div style={{ padding: '0 20px 60px' }}>
      <div className="page-header" style={{ marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Wix-Style Site Editor 🏗️</h1>
          <p className="page-subtitle">Control every piece of text and media on Otaku Merch</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
        {['homepage', 'shop', 'global'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
            style={{ textTransform: 'capitalize', minWidth: 140 }}
          >
            {tab === 'homepage' ? '🏠 Home Page' : tab === 'shop' ? '🛍️ Shop Pages' : '🌍 Global Elements'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 900 }}>
        {activeTab === 'homepage' && (
          <section animation-fade-in>
            <h2 style={{ marginBottom: 20 }}>Hero Experience</h2>
            {renderField('home_hero_title', 'Hero Title')}
            {renderField('home_hero_subtitle', 'Hero Subtitle', 'textarea')}
            {renderField('home_hero_tagline', 'Hero Tagline (Accent Text)')}
            {renderField('home_hero_image', 'Hero Background (Image/GIF URL)')}
            {renderField('home_hero_cta_primary', 'Main Button Text')}
            {renderField('home_hero_cta_secondary', 'Secondary Button Text')}
            
            <h2 style={{ marginTop: 40, marginBottom: 20 }}>Homepage Sections</h2>
            {renderField('home_categories_title', 'Categories Section Title')}
            {renderField('home_featured_title', 'Featured Grid Title')}
            {renderField('home_newsletter_title', 'Newsletter Title')}
            {renderField('home_newsletter_subtitle', 'Newsletter Subtitle')}
          </section>
        )}

        {activeTab === 'shop' && (
          <section animation-fade-in>
            <h2 style={{ marginBottom: 20 }}>Shop All Header</h2>
            {renderField('shop_hero_title', 'Shop Title')}
            {renderField('shop_hero_subtitle', 'Shop Subtitle')}
            {renderField('shop_hero_image', 'Shop Background URL')}
            
            <h2 style={{ marginTop: 40, marginBottom: 20 }}>New Arrivals Header</h2>
            {renderField('arrivals_hero_title', 'Arrivals Title')}
            {renderField('arrivals_hero_subtitle', 'Arrivals Subtitle')}
          </section>
        )}

        {activeTab === 'global' && (
          <section animation-fade-in>
            <h2 style={{ marginBottom: 20 }}>Site Branding</h2>
            {renderField('site_title', 'Website Logo/Name')}
            {renderField('announcement_bar', 'Announcement Bar (Top)')}
            {renderField('contact_email', 'Support Email')}
            {renderField('contact_phone', 'Support Phone')}
            
            <h2 style={{ marginTop: 40, marginBottom: 20 }}>Dynamic Navigation</h2>
            {renderField('nav_shop', 'Shop Link Text')}
            {renderField('nav_arrivals', 'Arrivals Link Text')}
            {renderField('nav_faq', 'FAQ Link Text')}
            {renderField('nav_contact', 'Contact Link Text')}
          </section>
        )}
      </div>
    </div>
  );
}
