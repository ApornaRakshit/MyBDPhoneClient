import { useEffect, useState } from 'react';
import API from '../../services/api';
import { CmsHtml } from '../../components/cms/CmsHtml';
import heroBg from '../../assets/hero-bg.png';

const API_ROOT = String(
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '');

const mediaUrl = (value, fallback = '') => {
  if (!value) return fallback;
  if (/^(https?:\/\/|data:)/i.test(value)) return value;
  if (value.startsWith('/uploads/')) return `${API_ROOT}${value}`;
  return value;
};

const parseJson = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const CmsAwarePage = ({ slug, fallback: Fallback }) => {
  const [mode, setMode] = useState('loading');
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    let active = true;

    setMode('loading');
    setPage(null);
    setSections([]);

    API.get(`/cms/public/page/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!active) return;
        setPage(res.data.page);
        setSections(res.data.sections || []);
        setMode('cms');
      })
      .catch((err) => {
        if (!active) return;
        if (err.response?.status === 410) setMode('inactive');
        else setMode('fallback');
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (mode === 'loading') {
    return (
      <div className="min-h-[45vh] flex items-center justify-center text-slate-500">
        Loading page…
      </div>
    );
  }

  if (mode === 'inactive') {
    return (
      <div className="min-h-[45vh] flex items-center justify-center text-slate-500">
        This page is currently inactive.
      </div>
    );
  }

  if (mode === 'fallback') return Fallback || null;

  return (
    <div className="pb-20">
      <section
        className="relative py-16 text-center bg-[#eaf6f2] bg-cover bg-center border-b border-[#8BBB92]/30"
        style={{
          backgroundImage: `url(${mediaUrl(page.featured_image, heroBg)})`,
        }}
      >
        <div className="absolute inset-0 bg-white/35" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="inline-flex text-sm font-black uppercase tracking-wider text-[#12544F] bg-white/80 border border-[#8BBB92]/40 px-3 py-1 rounded-full">
            MyBDPhone
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-[#092328]">
            {page.title}
          </h1>
          {page.seo_description && (
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              {page.seo_description}
            </p>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10">
        {page.content_html && (
          <CmsHtml
            html={page.content_html}
            className="prose prose-slate max-w-none"
          />
        )}

        {sections.map((section) => {
          const settings = parseJson(section.settings, {});
          const sectionImage = settings.image_url || settings.image || '';

          return (
            <section key={section.id} className="space-y-4">
              {sectionImage && (
                <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img
                    src={mediaUrl(sectionImage)}
                    alt={section.title || page.title}
                    className="w-full max-h-[460px] object-cover"
                  />
                </div>
              )}

              {section.title && (
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
                  {section.title}
                </h2>
              )}

              {section.subtitle && (
                <p className="text-slate-600">{section.subtitle}</p>
              )}

              {section.content_html && (
                <CmsHtml
                  html={section.content_html}
                  className="prose prose-slate max-w-none"
                />
              )}
            </section>
          );
        })}
      </section>
    </div>
  );
};
