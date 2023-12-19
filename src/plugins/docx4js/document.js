import './tool'
import JSZip from 'jszip'

/**
 *  document parser
 *
 *  @example
 *  Document.load(file)
 *  	.then(doc=>doc.parse([visitors]))
 */
export default class Document {
  constructor(parts, raw, props) {
    this.parts = parts
    this.raw = raw
    this.props = props
  }

  getPart(name) {
    return this.parts[name]
  }

  getImagePart(name) {
    const part = this.parts[name]
    const { crc32 } = part._data
    const buffer = part[JSZip.support.nodebuffer ? 'asNodeBuffer' : 'asArrayBuffer']()
    buffer.crc32 = part._data.crc32 = crc32
    return buffer
  }

  /**
   *  parse docx with visitors created from visitor factories one by one
   */
  parse(visitorFactories) {}

  /**
   * release resources after parse
   */
  release() {}

  /**
   *  create parser for a word model
   */
  factory(wordXml, docParser, parentParser) {
    if (!this._factory) {
      const a = new this.constructor.Factory()
      this._factory = function () {
        return a.create(...arguments)
      }
    }
    return this._factory(...arguments)
  }

  static clone(doc) {
    const { parts, raw, props } = doc
    return new Document(parts, raw, props)
  }
  /**
	 *  a helper to load document file

	 *  @param inputFile {File} - a html input file, or nodejs file
	 *  @return {Promise}
	 */

  static load(inputFile) {
    const DocumentSelf = this
    return new Promise((resolve, reject) => {
      function parse(data, props = {}) {
        const raw = new JSZip(data)
        const parts = {}
        raw.filter((path, file) => {
          parts[path] = file
        })
        resolve(new DocumentSelf(parts, raw, props))
      }

      if ($.isNode) {
        // node
        if (typeof inputFile === 'string') {
          // file name
          require('fs').readFile(inputFile, (error, data) => {
            if (error) reject(error)
            else if (data) {
              parse(data, {
                name: inputFile
                  .split(/[\/\\]/)
                  .pop()
                  .replace(/\.docx$/i, ''),
              })
            }
          })
        } else {
          parse(inputFile)
        }
      } else {
        // browser
        if (inputFile instanceof Blob) {
          const reader = new FileReader()
          reader.onload = function (e) {
            parse(e.target.result, {
              name: inputFile.name.replace(/\.docx$/i, ''),
              lastModified: inputFile.lastModified,
              size: inputFile.size,
            })
          }
          reader.readAsArrayBuffer(inputFile)
        } else {
          parse(inputFile)
        }
      }
    })
  }

  static Factory = class {
    create(wordXml, docParser, parentParser) {}
  };
}
