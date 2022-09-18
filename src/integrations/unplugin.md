---
description: uplugin-fluent-vue - official fluent-vue plugin for Vite, Webpack and Rollup. It allows defining locale messages directly in Vue SFC files or in external ftl files.
---

# unplugin-fluent-vue

[unplugin-fluent-vue](https://github.com/fluent-vue/unplugin-fluent-vue) is a plugin for Vite, Webpack and Rollup.

Plugin consists of two parts:
 * `SFCFluentPlugin` - allows defining locale messages in Vue SFC files
 * `ExternalFluentPlugin` - allows defining locale messages in external ftl files

## Usage

```js
// vite.config.js
import { defineConfig } from 'vite'
import {
  ExternalFluentPlugin,
  SFCFluentPlugin,
} from 'unplugin-fluent-vue/vite'

export default defineConfig({
  plugins: [
    vue(),
    // Choose one of the following:
    SFCFluentPlugin({ // define messages in SFCs
      blockType: 'fluent', // default 'fluent' - name of the block in SFCs
      checkSyntax: true, // default true - whether to check syntax of the messages
    }),
    ExternalFluentPlugin({ // define messages in external ftl files
      baseDir: path.resolve('src'), // required - base directory for Vue files
      ftlDir: path.resolve('src/locales'), // required - directory with ftl files
      locales: ['en', 'da'], // required - list of locales
      checkSyntax: true, // default true - whether to check syntax of the messages
    }),
  ],
})
