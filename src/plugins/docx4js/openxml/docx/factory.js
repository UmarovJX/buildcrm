import Model from './model'
import { Factory as Base } from '../document'

function attr(node, name = 'w:val') {
  return node ? node.attr(name) : undefined
}

export default class Factory extends Base {
  create(wXml, doc, parent, more) {
    let tag = wXml.localName
    let swap

    if (tag == 'document') return new (require('./model/document'))(wXml, doc, parent)
    if (tag == 'styles') return new (require('./model/documentStyles'))(wXml, doc)
    if (tag == 'abstractNum') return new (require('./model/style/numberingDefinition'))(wXml, doc)
    if (tag == 'num') return new (require('./model/style/list'))(wXml, doc)
    if (tag == 'style') {
      switch (wXml.attr('w:type')) {
        case 'paragraph':
          return new (require('./model/style/paragraph'))(wXml, doc)
        case 'character':
          return new (require('./model/style/inline'))(wXml, doc)
        case 'table':
          return new (require('./model/style/table'))(wXml, doc)
        case 'numbering':
          return new (require('./model/style/numbering'))(wXml, doc)
      }
    } else if (tag == 'docDefaults') return new (require('./model/style/document'))(wXml, doc)
    else if (tag == 'body') return new (require('./model/body'))(wXml, doc, parent)
    else if (tag == 'p') {
      const styleId = attr(wXml.$1('>pPr>pStyle'), 'w:val')
      const style = doc.style.get(styleId)
      if (wXml.$1('>pPr>numPr') || (style && style.getNumId() != -1)) return new (require('./model/list'))(wXml, doc, parent)

      let outlineLvl = -1
      let tmp
      if (style) outlineLvl = style.getOutlineLevel()
      else if ((tmp = wXml.$1('>pPr>outlineLvl'))) {
        tmp = parseInt(attr(tmp))
        outlineLvl = parseInt(tmp)
      }

      if (outlineLvl != -1) return new (require('./model/heading'))(wXml, doc, parent, outlineLvl)

      return new (require('./model/paragraph'))(wXml, doc, parent)
    } else if (tag == 'r') {
      const style = doc.style.get(attr(wXml.$1('>rPr>rStyle'), 'w:val'))

      let outlineLvl = -1
      let tmp
      if (style) outlineLvl = style.getOutlineLevel()
      else if ((tmp = wXml.$1('>rPr>outlineLvl'))) {
        tmp = attr(tmp)
        outlineLvl = parseInt(tmp)
      }

      if (outlineLvl != -1) {
        return new (require('./model/headingInline'))(
          wXml,
          doc,
          parent,
          outlineLvl,
        )
      }

      if (
        wXml.childNodes.length == 1
        || (wXml.childNodes == 2 && wXml.firstChild.localName == 'rPr')
      ) {
        switch (wXml.lastChild.localName) {
          case 'fldChar':
          case 'instrText':
            return factory(wXml.lastChild, doc, parent)
        }
      }

      return new (require('./model/inline'))(wXml, doc, parent)
    } else if (tag == 'instrText') return new (require('./model/fieldInstruct'))(wXml, doc, parent)
    else if (tag == 't') return new (require('./model/text'))(wXml, doc, parent)
    else if (tag == 'sym' && wXml.parentNode.localName == 'r') return new (require('./model/symbol'))(wXml, doc, parent)
    else if (tag == 'softHyphen' && wXml.parentNode.localName == 'r') return new (require('./model/softHyphen'))(wXml, doc, parent)
    else if (tag == 'noBreakHyphen' && wXml.parentNode.localName == 'r') return new (require('./model/noBreakHyphen'))(wXml, doc, parent)
    else if (tag == 'tab' && wXml.parentNode.localName == 'r') return new (require('./model/tab'))(wXml, doc, parent)
    else if (tag == 'fldSimple') return new (require('./model/fieldSimple'))(wXml, doc, parent)
    else if (tag == 'fldChar') {
      switch (wXml.attr('w:fldCharType')) {
        case 'begin':
          return new (require('./model/fieldBegin'))(wXml, doc, parent)
          break
        case 'end':
          return new (require('./model/fieldEnd'))(wXml, doc, parent)
          break
        case 'separate':
          return new (require('./model/fieldSeparate'))(wXml, doc, parent)
          break
      }
    } else if (tag == 'tbl') return new (require('./model/table'))(wXml, doc, parent)
    else if (tag == 'tr') return new (require('./model/row'))(wXml, doc, parent)
    else if (tag == 'tc') return new (require('./model/cell'))(wXml, doc, parent)
    else if (tag == 'br') return new (require('./model/br'))(wXml, doc, parent)
    else if (tag == 'hyperlink' && wXml.parentNode.localName == 'p') return new (require('./model/hyperlink'))(wXml, doc, parent)
    else if (tag == 'AlternateContent') return new (require('./model/drawingAnchor'))(wXml, doc, parent)
    else if (tag == 'wsp') return new (require('./model/shape'))(wXml, doc, parent)
    else if (tag == 'inline') {
      const type = wXml.$1('>graphic>graphicData').attr('uri').split('/').pop()
      switch (type) {
        case 'picture':
          return new (require('./model/image'))(wXml, doc, parent)
        case 'diagram':
          return new (require('./model/diagram'))(wXml, doc, parent)
        case 'chart':
          return new (require('./model/chart'))(wXml, doc, parent)
        default:
          console.error(`inline ${type} is not suppored yet.`)
      }
    } else if (tag == 'sdt') {
      const elBinding = wXml.$1('>sdtPr>dataBinding')
      if (elBinding) {
        // properties
        const path = attr(elBinding, 'w:xpath')
        const d = path.split(/[\/\:\[]/)
        const name = (d.pop(), d.pop())
        return new (require('./model/documentProperty'))(
          wXml,
          doc,
          parent,
          name,
        )
      }
      // controls
      const elType = wXml
        .$1('>sdtPr')
        .$1(
          'text, picture, docPartList, comboBox, dropDownList, date, checkbox',
        )
      tag = elType ? elType.localName : 'richtext'

      const control = this.createControl(tag, ...arguments)

      if (control) return control
    } else if (tag == 'bookmarkStart') return new (require('./model/bookmarkStart'))(wXml, doc, parent)
    else if (tag == 'bookmarkEnd') return new (require('./model/bookmarkEnd'))(wXml, doc, parent)
    else if (tag == 'oMath') return new (require('./model/equation'))(wXml, doc, parent)
    else if (tag == 'object') return new (require('./model/OLE'))(wXml, doc, parent)
    else if (tag == 'sectPr') return new (require('./model/section'))(wXml, doc, parent)

    return new Model(wXml, doc, parent)
  }

  createControl(type, wXml, doc, parent) {
    if (type == 'text') return new (require('./model/control/text'))(wXml, doc, parent)
    if (type == 'picture') return new (require('./model/control/picture'))(wXml, doc, parent)
    if (type == 'docPartList') return new (require('./model/control/gallery'))(wXml, doc, parent)
    if (type == 'comboBox') return new (require('./model/control/combobox'))(wXml, doc, parent)
    if (type == 'dropDownList') return new (require('./model/control/dropdown'))(wXml, doc, parent)
    if (type == 'date') return new (require('./model/control/date'))(wXml, doc, parent)
    if (type == 'checkbox') return new (require('./model/control/checkbox'))(wXml, doc, parent)
    if (type == 'richtext') return new (require('./model/control/richtext'))(wXml, doc, parent)
  }
}
