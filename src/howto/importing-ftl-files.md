# Importing .ftl files

In addition to using Vue custom blocks to define localization messages, it is possible to import them from .ftl files.

```js
import { FluentBundle, FluentResource } from '@fluent/bundle'

import enMessages from './en.ftl'

const enBundle = new FluentBundle('en')
enBundle.addResource(new FluentResource(enMessages))
```

You will need to configure your build system to support importing .ftl files as raw strings.

::: tip Note
You can code-split your localizations messages into multiple .ftl files. Just import .ftl file when you need and call `bundle.addResource`. But make sure that there are not duplicate keys in different files as localization messages added using `addResource` are global.
:::

### Webpack

For Webpack 5 you need to set .ftl files to be `type: 'asset/source'`. In earlier Webpack versions, this was done using `raw-loader`.

```js
module: {
  rules: [
    ...,
    {
      test: /\.ftl$/,
      type: 'asset/source'
    }
  ]
}
```

### Vite

For Vite you need to add `?raw` to your .ftl file imports to import them as strings.

```js
import { FluentBundle, FluentResource } from '@fluent/bundle'

import enMessages from './en.ftl?raw'

const enBundle = new FluentBundle('en')
enBundle.addResource(new FluentResource(enMessages))
```
