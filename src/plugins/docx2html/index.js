import docx4js from "../docx4js/openxml/document";
import converters from "./docx/html/factory";

/**
 *
 * @param {*} file
 * @param {*} options {
 * 	container: optional, default is document.body, a HTMLElement to contain converted html
 * 	asImageURL: only nodejs required, a function to convert image data to url
 * }
 * @returns
 */
export function docx2html(file, opt) {
  return docx4js.load(file).then((docx) => {
    const html = docx.parse(docx4js.createVisitorFactory(converters, {}));
    console.log(html);
    // return Object.create({
    //     content: html.content,
    //     toString() {
    //         return html.toString(...arguments)
    //     },
    //     asZip() {
    //         return html.asZip(...arguments)
    //     },
    //     download() {
    //         return html.download(...arguments)
    //     },
    //     save() {
    //         return html.save(...arguments)
    //     },
    //     release() {
    //         html.release()
    //     }
    // })
  });
}
