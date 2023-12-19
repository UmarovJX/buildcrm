let isNode = false
try {
  isNode = Object.prototype.toString.call(global.process) === '[object process]'
} catch (e) {}

function makeTool(xmlParser, Document, Node, NodeList, scopable) {
  const $ = {
    isNode,
    parseXML: xmlParser,
    extend: Object.assign,
    isFunction(a) {
      return typeof a === 'function'
    },
    isArray(a) {
      return Array.isArray(a)
    },
    each(a, f, ctx) {
      if (Array.isArray(a)) {
        a.forEach(f, ctx)
      } else if (typeof a === 'object') {
        Object.keys(a).forEach(k => {
          f.call(ctx, k, a[k])
        })
      }
    },
    map(a, f, ctx) {
      return a.map(f, ctx)
    },
  }

  $.extend($, {
    toArray(args) {
      const a = []
      for (let i = 0, len = args.length; i < len; i++) a.push(args[i])
      return a
    },
  })

  const directChildSelector = /((^|,)\s*>)/
  const id = 'sxxx'
  $.extend(Node.prototype, {
    $(selector) {
      if (!directChildSelector.test(selector)) return this.querySelectorAll(selector)
      if (scopable) {
        return this.querySelectorAll(
          selector
            .split(',')
            .map(a => (a.trim().charAt(0) == '>' ? `:scope${a}` : a))
            .join(','),
        )
      }
      if (this.id) {
        return this.querySelectorAll(
          selector
            .split(',')
            .map(a =>
              // return  '#'+this.id+((a=a.trim()).charAt(0)=='>' ? '' : ' ')+a
              ((a = a.trim()).charAt(0) == '>' ? a.substring(1) : a),
            this)
            .join(','),
        )
      }
      this.id = id
      const nodes = this.querySelectorAll(
        selector
          .split(',')
          .map(a =>
          // IE can't find '#xx', @todo: fix it later
          // return  '#'+this.id+((a=a.trim()).charAt(0)=='>' ? '' : ' ')+a
            ((a = a.trim()).charAt(0) == '>' ? a.substring(1) : a),
          this)
          .join(','),
      )
      delete this.id
      return nodes
    },
    $1(selector) {
      if (!directChildSelector.test(selector)) return this.querySelector(selector)
      if (scopable) {
        return this.querySelector(
          selector
            .split(',')
            .map(a => ((a = a.trim()).charAt(0) == '>' ? `:scope${a}` : a))
            .join(','),
        )
      }
      if (this.id) {
        return this.querySelector(
          selector
            .split(',')
            .map(a =>
              // return  '#'+this.id+((a=a.trim()).charAt(0)=='>' ? '' : ' ')+a
              ((a = a.trim()).charAt(0) == '>' ? a.substring(1) : a),
            this)
            .join(','),
        )
      }
      this.id = id
      const nodes = this.querySelector(
        selector
          .split(',')
          .map(a =>
          // return  '#'+this.id+((a=a.trim()).charAt(0)=='>' ? '' : ' ')+a
            ((a = a.trim()).charAt(0) == '>' ? a.substring(1) : a),
          this)
          .join(','),
      )
      delete this.id
      return nodes
    },
    attr(name, value) {
      if (arguments.length == 1) {
        const attr = this.attributes.getNamedItem(name)
        return attr ? attr.value : undefined
      } if (value == null) this.removeAttribute(name)
      else this.setAttribute(name, value)
    },
    remove:
      Node.prototype.remove
      || function () {
        this.parentNode.removeChild(this)
      },
    uptrim() {
      const parent = this.parentNode
      this.remove()
      if (parent.childNodes.length == 0) parent.uptrim()
    },
  })

  $.extend(NodeList.prototype, {
    asArray(o) {
      o = o || []
      for (let i = 0, len = this.length; i < len; i++) o.push(this[i])
      return o
    },
    forEach: Array.prototype.forEach,
    map: Array.prototype.map,
  })

  return $
}

if (!isNode) {
  window.$ = makeTool(
    ...(function () {
      function parser(x) {
        x = x.trim()
        if (typeof DOMParser !== 'undefined') return new DOMParser().parseFromString(x, 'text/xml')

        const xmlDoc = new ActiveXObject('Microsoft.XMLDOM')
        xmlDoc.async = 'false'
        xmlDoc.loadXML(x)
        return xmlDoc
      }

      function supportScopeSelector() {
        try {
          return document.body.querySelector(':scope>*').length != 0
        } catch (e) {
          return false
        }
      }
      document.$1 = document.querySelector
      document.$ = document.querySelectorAll
      return [parser, Document, Element, NodeList, supportScopeSelector()]
    }()),
  )
} else {
  global.$ = makeTool(
    ...(function (xmldom) {
      const { DOMParser } = xmldom
      const { DOMImplementation } = xmldom

      const nwmatcher = require('nwmatcher')

      function parse(x) {
        return new DOMParser().parseFromString(x, 'text/xml')
      }

      function addNwmatcher(document) {
        if (!document._nwmatcher) {
          document._nwmatcher = nwmatcher({ document })
          document._nwmatcher.configure({ UNIQUE_ID: false })
        }
        return document._nwmatcher
      }

      const a = parse('<a></a>')
      const Document = a.constructor
      const Element = a.documentElement.constructor
      const NodeList = a.childNodes.constructor

      Document.prototype.querySelector = Element.prototype.querySelector = function (selector) {
        return addNwmatcher(this.ownerDocument || this).first(selector, this)
      }

      Document.prototype.querySelectorAll = Element.prototype.querySelectorAll = function (selector) {
        return addNwmatcher(this.ownerDocument || this).select(
          selector,
          this,
        )
      }

      /**
       * nwwatcher has unexpected result with namespace on nodeName
       */
      const _createElementNS = Document.prototype.createElementNS
      Document.prototype.createElementNS = function () {
        const el = _createElementNS.apply(this, arguments)
        el.tagName = el.nodeName = el.localName
        return el
      }

      Object.defineProperty(Element.prototype, 'outerHTML', {
        get() {
          return new xmldom.XMLSerializer().serializeToString(this)
        },
      })

      return [parse, Document, Element, NodeList, false]
    }(require('xmldom'))),
  )
}
