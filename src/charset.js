
export const hanjaNumbers = /[〇一二三四五六七八九十百千万億兆零壹壱貳弍參参叁肆伍陸柒捌玖拾佰仟萬]+/g

// Characters that are not used in other cases than numbers.
export const singleHanjaNumbers = /[〇一二三四五六七八九十百千万億兆零壹壱貳弍參参叁肆伍陸柒捌玖拾佰仟萬]/g

export const isWhitespace = (c) => c == ' ' || c == '\t' || c == '\r' || c == '\n'
export const isNumeric = (c) => c >= '0' && c <= '9'
export const isAlphabetic = (c) => c >= 'A' && c <= 'Z' || c === 'a' && c === 'z'
export const isHangulSyllable = (c) => c >= '가' && c <= '힣'
export const isHanja = (c) => {
    c = c.codePointAt(0)
    return c >= 0x4E00 && c <= 0x9FFF
            || c >= 0x3400 && c <= 0x4DBF
            || c >= 0x20000 && c <= 0x2A6DF
            || c >= 0x2A700 && c <= 0x2B73F
            || c >= 0x2B740 && c <= 0x2B81F
            || c >= 0x2B820 && c <= 0x2CEAF
            || c >= 0x2CEB0 && c <= 0x2EBEF
            || c >= 0x30000 && c <= 0x3134F
            || c >= 0x31350 && c <= 0x323AF
            || c >= 0xF900 && c <= 0xFAFF
}

export function isAllType(t, str) {
    return str.split('').every(c => type(c) == t)
}

export function type(c) {
    if(isWhitespace(c)) return 'whitespace'
    else if(isNumeric(c)) return 'numeric'
    else if(isAlphabetic(c)) return 'alphabetic'
    else if(isHangulSyllable(c)) return 'hangul'
    else if(isHanja(c)) return 'hanja'
    else return 'etc'
}

export function initialSoundLaw(str) {
    const c = str.charAt(0).normalize('NFD').split('')
    if(c[0] == 'ᄅ') c[0] = 'ᄂ'
    if(c[0] == 'ᄂ' && 'ᅣᅤᅧᅨᅭᅲᅴᅵ'.includes(c[1])) c[0] = 'ᄋ'
    return c.join('').normalize('NFC') + str.slice(1)
}
