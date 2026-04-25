import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import path from 'path';

const sitemap = new SitemapStream({ hostname: 'https://casted.blog' });

const pages = [
  '/', 
  '/about',
  '/contact',
  // add your real pages here
];

pages.forEach((page) => sitemap.write({ url: page, changefreq: 'daily', priority: 0.8 }));
sitemap.end();

streamToPromise(sitemap).then((data) => {
  const sitemapPath = path.resolve('public', 'sitemap.xml');
  createWriteStream(sitemapPath).write(data);
});
