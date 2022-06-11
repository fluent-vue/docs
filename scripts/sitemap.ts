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

console.log('Fixing html')
glob
  .sync('**/*.html', { cwd: outDir })
  .forEach(file => {
    let newHtml = readFileSync(resolve(outDir, file), 'utf-8')
    newHtml = newHtml
      .replace(/<meta name="description" content="A VitePress site">/g, '')
      .replace(/<img class="logo"/g, '<img class="logo" alt="fluent-vue logo"')

    const metaDescription = newHtml.match(/<meta name="description" content="(.*?)">/)
    if (metaDescription) {
      // Change twitter:description to match meta description
      newHtml = newHtml.replace(/<meta name="twitter:description" content="(.*?)">/, `<meta name="twitter:description" content="${metaDescription[1]}">`)

      // Change og:description to match meta description
      newHtml = newHtml.replace(/<meta property="og:description" content="(.*?)">/, `<meta property="og:description" content="${metaDescription[1]}">`)
    } else {
      // Remove twitter:description and og:description
      newHtml = newHtml.replace(/<meta name="twitter:description" content="(.*?)">/, '')
      newHtml = newHtml.replace(/<meta property="og:description" content="(.*?)">/, '')
    }

    // Change og:url to match canonical url
    const url = new URL(file.replace(/index\.html/g, ''), hostname).href
    newHtml = newHtml.replace(/<meta property="og:url" content="(.*?)">/, `<meta property="og:url" content="${url}">`)

    writeFileSync(resolve(outDir, file), newHtml)
  })
console.log('Done')
