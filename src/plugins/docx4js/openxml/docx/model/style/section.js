import Style from '../style'

const naming = {
  ...Style.Properties.naming,
  pgSz: 'size',
  pgMar: 'margin',
}

export default class section extends Style.Properties {
  static get naming() {
    return naming
  }

  pgSz(x) {
    return {
      width: this.pt2Px(this.asPt(x.attr('w:w'))),
      height: this.pt2Px(this.asPt(x.attr('w:h'))),
    }
  }

  pgMar(x) {
    const value = this.asObject(x, v => this.pt2Px(this.asPt(v)))
    if (
      value.gutter
      && this.wDoc.getPart('settings').documentElement.$1('gutterAtTop')
    ) value.gutterAtRight = 1
    return value
  }

  cols(x) {
    const o = this.asObject(x, parseInt)
    o.space && (o.space = this.pt2Px(this.asPt(o.space)))

    const data = Array.from(x.$('col')).map(a => ({
      width: this.pt2Px(this.asPt(a.attr('w:w'))),
      space: this.pt2Px(this.asPt(a.attr('w:space'))),
    }))

    if (data && data.length) o.data = data

    return o
  }

  static get type() {
    return 'section'
  }
}
