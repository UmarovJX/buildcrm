import {isEmptyObject, isEmptyString, isUndefined} from "@/util/inspect";

const stylePack = {
    background: '#2c2c2c',
    color: '#fff',
    padding: '2px',
    margin: '2px',
}

function joinDefaultStyleProperties(styleList = stylePack) {
    if (!styleList || isUndefined(styleList) || isEmptyObject(styleList)) {
        styleList = stylePack
    }

    let defaultStyle = ''

    for (let [property, value] of Object.entries(styleList)) {
        if (isEmptyString(value)) {
            continue
        }
        defaultStyle += `${property}:${value}; `
    }

    return defaultStyle
}

export function runConsoleLog(message, ...rPrm) {
    const styles = rPrm.pop()
    console.log(`%c ${message} ${rPrm.join(' ')}`, joinDefaultStyleProperties(styles))
}