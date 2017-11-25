// lazy require symbols table
var _symbols
var removelist

function symbols (code) {
  if (_symbols) {
    return _symbols[code]
  }

  _symbols = require('unicode/category/So')
  removelist = ['sign', 'cross', 'of', 'symbol', 'staff', 'hand', 'black', 'white'].map(function (word) {
    return new RegExp(word, 'gi')
  })

  return _symbols[code]
}

function getLengths (multicharmap) {
  var lengths = []

  for (var key in multicharmap) {
    if (!multicharmap.hasOwnProperty(key)) {
      continue
    }

    if (lengths.indexOf(key.length) === -1) {
      lengths.push(key.length)
    }
  }

  return lengths
}

function setDefaults (opts) {
  var keys = ['charmap', 'lower', 'multicharmap', 'remove', 'replacement', 'symbols']

  opts = opts || {}

  for (var i = 0, length = keys.length; i < length; i++) {
    opts[keys[i]] = opts[keys[i]] === undefined ? slug.defaults[keys[i]] : opts[keys[i]]
  }

  return opts
}

function slug (string, opts) {
  if (typeof string !== 'string') {
    throw new Error('input must be a string')
  }

  opts = setDefaults(opts)

  var lengths = getLengths(opts.multicharmap)
  var code
  var unicode
  var result = ''

  for (var i = 0, length = string.length; i < length; i++) {
    var char = string[i]

    if (!lengths.some(function (len) {
      var str = string.substr(i, len)

      if (opts.multicharmap[str]) {
        i += len - 1
        char = opts.multicharmap[str]
        return true
      } else {
        return false
      }
    })) {
      if (typeof opts.charmap[char] === 'string') {
        char = opts.charmap[char]
        code = char.charCodeAt(0)
      } else {
        code = string.charCodeAt(i)
      }

      if (opts.symbols && (unicode = symbols(code))) {
        char = unicode.name.toLowerCase()

        for (var j = 0, rl = removelist.length; j < rl; j++) {
          char = char.replace(removelist[j], '')
        }

        char = char.replace(/^\s+|\s+$/g, '')
      }
    }

    char = char.replace(/[^\w\s\-._~]/g, '') // allowed

    if (opts.remove) {
      char = char.replace(opts.remove, '') // add flavour
    }

    result += char
  }

  if (opts.limit) {
    var splitArray = result.split(' ')
    splitArray.splice(opts.limit, splitArray.length - opts.limit)
    result = splitArray.join(' ')
  }

  result = result
    .trim() // trim leading/trailing spaces
    .replace(/[-\s]+/g, opts.replacement) // convert spaces
    .replace(new RegExp(opts.replacement + '$'), '') // remove trailing separator

  return (opts.lower) ? result.toLowerCase() : result
}

slug.defaults = {
  replacement: '-',
  symbols: typeof navigator === 'undefined' && typeof process !== 'undefined',
  remove: null,
  lower: true,
  charmap: slug.charmap,
  multicharmap: slug.multicharmap
}

slug.charmap = slug.defaults.charmap = require('./charmap')

slug.multicharmap = slug.defaults.multicharmap = {}

module.exports = slug
