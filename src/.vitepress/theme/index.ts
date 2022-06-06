import DefaultTheme from 'vitepress/theme'

import { FluentBundle } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'

import { format } from 'date-fns'

import './theme.css'

const bundle = new FluentBundle('en', {
  functions: {
    DATEFNS (positionalArgs, namedArgs) {
      const [date, formatString] = positionalArgs as [string, string]
      return format(new Date(date), formatString)
    }
  }
})

const fluent = createFluentVue({
  bundles: [bundle],
})

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.use(fluent)
  }
}
