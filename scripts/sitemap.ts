import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { SitemapStream, streamToPromise } from 'sitemap'
import glob from 'fast-glob'

const outDir = './src/.vitepress/dist'
const hostname = 'https://fluent-vue.demivan.me'
const changefreq = 'weekly'

function generateSitemap() {
  const stream = new SitemapStream()

  glob
    .sync('**/*.html', { cwd: outDir })
    .map((route) => route.replace(/index\.html/g, ''))
    .map(route => ({
      url: new URL(route, hostname).href,
      changefreq: changefreq,
      priority: 1,
      lastmod: new Date(),
    }))
    .forEach(item => stream.write(item))
  
  streamToPromise(stream).then((sitemap) => {
    const utfSitemap = sitemap.toString('utf-8')
    writeFileSync(resolve(outDir, 'sitemap.xml'), utfSitemap)
  })
  stream.end()
}

console.log('Generating sitemap.xml')
generateSitemap()
console.log('Done')

console.log('Fixing description')
glob
  .sync('**/*.html', { cwd: outDir })
  .forEach(file => {
    const html = readFileSync(resolve(outDir, file), 'utf-8')
    const newHtml = html.replace(/<meta name="description" content="A VitePress site">/g, '')
    writeFileSync(resolve(outDir, file), newHtml)
  })
console.log('Done')
