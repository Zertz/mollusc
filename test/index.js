var should = require('should')

var slug = require('../src')

describe('slug', function () {
  it('should throw when input is not a string', function () {
    should(function () {
      slug(42)
    }).throw('input must be a string')
  })

  it('should replace whitespaces with replacement', function () {
    slug('foo bar baz').should.eql('foo-bar-baz')
    slug('foo bar baz', {
      replacement: '_'
    }).should.eql('foo_bar_baz')
    slug('foo bar baz', {
      replacement: ''
    }).should.eql('foobarbaz')
  })

  it('should remove trailing space if any', function () {
    slug(' foo bar baz ').should.eql('foo-bar-baz')
  })

  it('should remove trailing separator if any', function () {
    slug(' foo bar baz-').should.eql('foo-bar-baz')
  })

  it('should remove not allowed chars', function () {
    slug('foo, bar baz').should.eql('foo-bar-baz')
    slug('foo- bar baz').should.eql('foo-bar-baz')
    slug('foo] bar baz').should.eql('foo-bar-baz')
  })

  it('should leave allowed chars', function () {
    var allowed = ['.', '_', '~']

    for (var i = 0, len = allowed.length; i < len; i++) {
      slug('foo ' + allowed[i] + ' bar baz').should.eql('foo-' + allowed[i] + '-bar-baz')
    }
  })

  it('should replace currencies', function () {
    var charMap = {
      '€': 'euro',
      '₢': 'cruzeiro',
      '₣': 'french franc',
      '£': 'pound',
      '₤': 'lira',
      '₥': 'mill',
      '₦': 'naira',
      '₧': 'peseta',
      '₨': 'rupee',
      '₹': 'indian rupee',
      '₩': 'won',
      '₪': 'new shequel',
      '₫': 'dong',
      '₭': 'kip',
      '₮': 'tugrik',
      '₯': 'drachma',
      '₰': 'penny',
      '₱': 'peso',
      '₲': 'guarani',
      '₳': 'austral',
      '₴': 'hryvnia',
      '₵': 'cedi',
      '¢': 'cent',
      '¥': 'yen',
      '元': 'yuan',
      '円': 'yen',
      '﷼': 'rial',
      '₠': 'ecu',
      '¤': 'currency',
      '฿': 'baht',
      '$': 'dollar'
    }

    for (var char in charMap) {
      slug('foo ' + char + ' bar baz').should.eql('foo-' + charMap[char].replace(' ', '-').toLowerCase() + '-bar-baz')
    }
  })

  it('should replace symbols', function () {
    var charMap = {
      '©': 'c',
      'œ': 'oe',
      'Œ': 'OE',
      '∑': 'sum',
      '®': 'r',
      '∂': 'd',
      'ƒ': 'f',
      '™': 'tm',
      '℠': 'sm',
      '…': '...',
      '˚': 'o',
      'º': 'o',
      'ª': 'a',
      '∆': 'delta',
      '∞': 'infinity',
      '♥': 'love',
      '&': 'and',
      '|': 'or',
      '<': 'less',
      '>': 'greater'
    }

    for (var char in charMap) {
      slug('foo ' + char + ' bar baz').should.eql(('foo-' + charMap[char].toLowerCase() + '-bar-baz'))
    }
  })

  it('should execute remove regex', function () {
    slug('foo … bar baz', {
      remove: /[.]/g
    }).should.eql('foo-bar-baz')
  })

  it('should strip symbols', function () {
    var charMap = ['†', '“', '”', '‘', '’', '•']

    for (var i = 0, len = charMap.length; i < len; i++) {
      slug('foo ' + charMap[i] + ' bar baz').should.eql('foo-bar-baz')
    }
  })

  it('should replace unicode', function () {
    var charMap = {
      '☢': 'radioactive',
      '☠': 'skull-and-bones',
      '☤': 'caduceus',
      '☣': 'biohazard',
      '☭': 'hammer-and-sickle',
      '☯': 'yin-yang',
      '☮': 'peace',
      '☏': 'telephone',
      '☔': 'umbrella-with-rain-drops',
      '☎': 'telephone',
      '☀': 'sun-with-rays',
      '★': 'star',
      '☂': 'umbrella',
      '☃': 'snowman',
      '✈': 'airplane',
      '✉': 'envelope',
      '✊': 'raised-fist'
    }

    for (var char in charMap) {
      slug('foo ' + char + ' bar baz').should.eql('foo-' + charMap[char] + '-bar-baz')
    }
  })

  it('should replace no unicode when disabled', function () {
    var charMap = '😹☢☠☤☣☭☯☮☏☔☎☀★☂☃✈✉✊'.split('')

    for (var i = 0, len = charMap.length; i < len; i++) {
      slug('foo ' + charMap[i] + ' bar baz', {
        symbols: false
      }).should.eql('foo-bar-baz')
    }
  })

  it('should allow altering the charmap', function () {
    var charmap = {
      'f': 'ph', 'o': '0', 'b': '8', 'a': '4', 'r': '2', 'z': '5'
    }

    slug('foo bar baz', {
      charmap: charmap
    }).toUpperCase().should.eql('PH00-842-845')
  })

  it('should replace lithuanian characters', function () {
    slug('ąčęėįšųūžĄČĘĖĮŠŲŪŽ').should.eql('aceeisuuzaceeisuuz')
  })

  it('should replace multichars', function () {
    slug('w/ <3 && sugar || ☠', {
      multicharmap: {
        '<3': 'love', '&&': 'and', '||': 'or', 'w/': 'with'
      }
    }).should.eql('with-love-and-sugar-or-skull-and-bones')
  })

  it('should default to lowercase', function () {
    var text = "It's Your Journey We Guide You Through."
    var expected = 'its-your-journey-we-guide-you-through.'

    slug(text).should.eql(expected)
  })

  it('should allow disabling of lowercase', function () {
    var text = "It's Your Journey We Guide You Through."
    var expected = 'Its-Your-Journey-We-Guide-You-Through.'

    slug(text, {
      mode: 'rfc3986',
      lower: false
    }).should.eql(expected)
  })

  it('should allow to limit slug words (5, i.e.)', function () {
    slug("It's Your Journey We Guide You Through.", {
      limit: 5
    }).should.eql('its-your-journey-we-guide')
  })

  it('should remove disallowed characters even if they are in the char map', function () {
    var charMap = {
      '©': '(c)'
    }
    slug('mollusc ©', {
      charmap: charMap
    }).should.eql('mollusc-c')
  })

  it('should allow you to replace valid characters with an empty string', function () {
    var charMap = {
      '.': ''
    }
    slug('my.string', {
      charmap: charMap
    }).should.eql('mystring')
  })
})
