import type { APIRoute } from 'astro';

const siteUrl = 'https://spaquet.github.io/mailcatcher';

const pages = [
  { url: '', changefreq: 'weekly', priority: '1.0' },
  { url: 'usage/', changefreq: 'monthly', priority: '0.8' },
  { url: 'api/', changefreq: 'monthly', priority: '0.8' },
  { url: 'api/examples/', changefreq: 'monthly', priority: '0.8' },
  { url: 'ai-integration/', changefreq: 'monthly', priority: '0.8' },
  { url: 'advanced/', changefreq: 'monthly', priority: '0.7' },
];

const generateSiteMap = (pages: Array<{ url: string; changefreq: string; priority: string }>) =>
  `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(({ url, changefreq, priority }) => {
          return `
      <url>
        <loc>${new URL(url, siteUrl).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
      </url>
    `;
        })
        .join('')}
    </urlset>
  `;

export const GET: APIRoute = () => {
  return new Response(generateSiteMap(pages), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
