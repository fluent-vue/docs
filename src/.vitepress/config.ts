import { defineConfig } from 'vitepress'

import fluentPlugin from 'rollup-plugin-fluent-vue'

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

export default async() => defineConfig({
  title: 'fluent-vue',

  head: [
    ['meta', { name: 'keywords', content: 'vue, i18n, vue i18n, vue.js, internationalization, localization, vue plugin, fluent, project fluent' }]
  ],

  themeConfig: {
    logo: '/assets/logo.svg',
    siteTitle: null,

    sidebar: [
      {
        text: 'How-to',
        items: [
          { text: 'Changing locale', link: '/howto/change-locale' },
          { text: 'Localizing date and time', link: '/howto/date-time' }
        ]
      }
    ],

    editLink: {
      repo: 'fluent-vue/docs',
      dir: 'docs',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/demivan/fluent-vue' }
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
      fluentPlugin()
    ]
  }
})
