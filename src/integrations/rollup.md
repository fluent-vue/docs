---
description: rollup-plugin-fluent-vue - official Rollup plugin for fluent-vue that allows defining locale messages directly in Vue SFC files
---

# Rollup plugin

**Deprecated. Use [`unplugin-fluent-vue`](/integrations/unplugin.html) instead.**

Rollup support for custom blocks in SFC is provided by [rollup-plugin-fluent-vue](https://www.npmjs.com/package/rollup-plugin-fluent-vue).

```js
import vue from 'rollup-plugin-vue'
import fluentPlugin from 'rollup-plugin-fluent-vue'

module.exports = {
  plugins: [
    vue({
      customBlocks: ['fluent']
    }),
    fluentPlugin()
  ]
};
```

## Options

### blockType

Type: `string`<br>
Default: `fluent`

Custom block tag name.
