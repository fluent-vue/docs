import { defineConfig } from 'vitepress'

import { SFCFluentPlugin } from 'unplugin-fluent-vue/vite'

import { BUNDLED_LANGUAGES, Theme, getHighlighter } from 'shiki'
import VueGrammar from 'shiki/languages/vue.tmLanguage.json'
import FluentGrammar from './fluent.tmLanguage.json'

const shikiLanguages = BUNDLED_LANGUAGES
  .filter(lang => lang.id !== 'vue')

Object.assign(VueGrammar.repository, FluentGrammar.repository)

// Add fluent support to shiki Vue lang definition
VueGrammar.patterns.unshift(
  {
    "begin": "(<)(fluent)",
    "beginCaptures": {
      "1": {
        "name": "punctuation.definition.tag.begin.html"
      },
      "2": {
        "name": "entity.name.tag.style.html"
      }
    },
    "end": "(</)(fluent)(>)",
    "endCaptures": {
      "1": {
        "name": "punctuation.definition.tag.begin.html"
      },
      "2": {
        "name": "entity.name.tag.style.html"
      },
      "3": {
        "name": "punctuation.definition.tag.end.html"
      }
    },
    "patterns": [
      {
        "begin": "(>)",
        "end": "(?=</fluent>)",
        "contentName": "source.ftl",
        "patterns": [{
          "include": "#comment"
        },{
          "include": "#message"
        }]
      }
    ]
  }
)

export type ThemeOptions = Theme | { light: Theme; dark: Theme }

export async function highlight(theme: ThemeOptions = 'material-palenight') {
  const themes = typeof theme === 'string' ? [theme] : [theme.dark, theme.light]
  const highlighter = await getHighlighter({
    themes,
    langs: [
      ...shikiLanguages, {
        id: 'vue',
        scopeName: 'source.vue',
        grammar: VueGrammar
      }, {
        id: 'ftl',
        scopeName: 'source.ftl',
        grammar: FluentGrammar
      }
    ]
  })
  const preRE = /^<pre.*?>/

  return (str: string, lang: string) => {
    lang = lang || 'text'

    if (typeof theme === 'string') {
      return highlighter
        .codeToHtml(str, { lang, theme })
        .replace(preRE, '<pre v-pre>')
    }

    const dark = highlighter
      .codeToHtml(str, { lang, theme: theme.dark })
      .replace(preRE, '<pre v-pre class="vp-code-dark">')

    const light = highlighter
      .codeToHtml(str, { lang, theme: theme.light })
      .replace(preRE, '<pre v-pre class="vp-code-light">')

    return dark + light
  }
}

const domain = 'https://fluent-vue.demivan.me'

const meta = {
  title: 'fluent-vue - Internationalization plugin for Vue.js',
  description: 'Vue.js integration for Fluent.js - JavaScript implementation of Mozilla\'s Project Fluent',
  image: `${domain}/preview.png`,
}

export default async() => defineConfig({
  title: 'fluent-vue',
  titleTemplate: ':title - fluent-vue',
  description: meta.description,
  head: [
    ['meta', { name: 'keywords', content: 'vue, i18n, vue i18n, vue.js, internationalization, localization, vue plugin, fluent, project fluent' }],
    ['meta', { property: 'og:url', content: domain }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: meta.title }],
    ['meta', { property: 'og:description', content: meta.description }],
    ['meta', { property: 'og:image', content: meta.image }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: meta.title }],
    ['meta', { name: 'twitter:description', content: meta.description }],
    ['meta', { name: 'twitter:image', content: meta.image }],
    ['meta', { name: 'twitter:creator', content: '@IvanDemchuk' }],
  ],
  transformHead(ctx) {
    return [
      ['meta', { property: 'og:url', content: `${domain}/${ctx.pageData.relativePath.replace('.md', '.html').replace('index.html', '')}` }],
    ]
  },

  themeConfig: {
    logo: {
      src: '/assets/logo.svg',
      alt: 'fluent-vue Logo',
    },
    siteTitle: 'fluent-vue',

    algolia: {
      appId: 'KY7MO3VGVQ',
      apiKey: 'e6f42eada0a04e0b9d9fd48b210d64db',
      indexName: 'fluent-vue-demivan',
    },

    nav: [
      {
        text: 'Guide',
        link: '/introduction.html'
      },
      {
        text: 'Syntax',
        link: '/fluent-syntax.html'
      },
      {
        text: 'API',
        link: '/api/instance-methods.html'
      },
      {
        text: 'Comparison with vue-i18n',
        link: '/vue-i18n-comparison.html'
      }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Fluent syntax', link: '/fluent-syntax' },
          { text: 'Installation', link: '/installation' },
          { text: 'Comparison with vue-i18n', link: '/vue-i18n-comparison' },
        ]
      },
      {
        text: 'API',
        items: [
          { text: '$t and $ta instance methods', link: '/api/instance-methods' },
          { text: 'Composition API', link: '/api/composition-api' },
          { text: 'v-t directive', link: '/api/v-t-directive' },
          { text: 'i18n component', link: '/api/i18n-component' },
        ]
      },
      {
        text: 'How-to',
        items: [
          { text: 'Changing locale', link: '/howto/change-locale' },
          { text: 'Localizing date and time', link: '/howto/date-time' },
          { text: 'Importing .ftl files', link: '/howto/importing-ftl-files' },
          { text: 'Access outside of component', link: '/howto/access-outside-of-component' },
        ]
      },
      {
        text: 'Tooling and integrations',
        items: [
          { text: 'Overview', link: '/integrations/' },
          { text: 'Unplugin', link: '/integrations/unplugin' },
          { text: 'Webpack loader', link: '/integrations/webpack' },
          { text: 'Rollup plugin', link: '/integrations/rollup' },
          { text: 'Vite plugin', link: '/integrations/vite' },
        ]
      }
    ],

    editLink: {
      pattern: 'https://github.com/fluent-vue/docs/edit/main/src/:path',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fluent-vue/fluent-vue' }
    ],

    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2020-present Ivan Demchuk'
    }
  },
  markdown: {
    highlight: await highlight(),
  },
  vite: {
    plugins: [
      SFCFluentPlugin()
    ]
  }
})
