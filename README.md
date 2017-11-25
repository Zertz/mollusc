# [mollusc](https://github.com/Zertz/mollusc) [![Build Status](https://travis-ci.org/Zertz/mollusc.svg?branch=master)](https://travis-ci.org/Zertz/mollusc) [![NPM version](https://badge.fury.io/js/mollusc.png)](http://badge.fury.io/js/mollusc) [![Coverage Status](https://coveralls.io/repos/github/Zertz/mollusc/badge.svg?branch=master)](https://coveralls.io/github/Zertz/mollusc?branch=master) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

> Make strings url-safe and replace unicode symbols with their name

- respecting [RFC 3986](https://tools.ietf.org/html/rfc3986)
- Comprehensive tests
- No dependencies, except unicode data
- Coerces foreign symbols to their english equivalent

## Install

```
npm install mollusc
```

## Usage

```js
const slug = require('mollusc')

slug('i ♥ unicode')
//= i-love-unicode

slug('unicode ♥ is ☢')
//= unicode-love-is-radioactive

slug('i ♥ unicode', {
  replacement: '_'
})
//= i_love_unicode

slug.charmap['♥'] = 'freaking love'
slug('I ♥ UNICODE')
//= i-freaking-love-unicode

slug('☏-NUMBER', {
  lower: false
})
//= telephone-NUMBER
```

## API

```js
slug(input[, options])
```

### options

#### replacement

Replace spaces with value.

Type: `string`

Default: `-`

#### symbols

Replace unicode symbols with their name.

Type: `boolean`

Default:
- Node: `true`
- Browser: `false`

#### remove

Regex to remove characters.

Type: `boolean`

Default: `null`

#### lower

Convert result to lower case.

Type: `boolean`

Default: `true`

#### limit

Result should have no more than that many words.

Type: `number`

Default: `null`

#### charmap

Replace special characters.

Type: `object`

Default: `slug.charmap`

#### multicharmap

Replace strings with another string.

Type: `object`

Default: `slug.multicharmap`

## Browser

When using browserify you might want to remove the symbols table from your bundle.

```bash
browserify slug.js --ignore unicode-json/category/So -s slug > slug-browser.js
```
