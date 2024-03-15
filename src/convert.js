
import { buildDict } from './dictionary.js'
import { type, isHangulSyllable, initialSoundLaw } from './charset.js'

export const dic = buildDict('dic/hanja.filtered.txt')
export const jp = buildDict('dic/jp.txt')
export const cn = buildDict('dic/cn.txt')
export const MAX_LENGTH = 100

export function convert(str, initial=true, userDictionary={}) {
    if(str.includes(' ')) return str.split(' ').map((word, i) => [...(i == 0 ? [] : [[' ', ' ']]), ...convert(word, true, userDictionary)]).flat()
    if(str.length > MAX_LENGTH) return str.match(new RegExp(`.{1,${MAX_LENGTH}}`, 'gs')).flatMap((s, i) => convert(s, initial && i == 0, userDictionary))
    if(str.length == 0) return []
    str = normalizeHanja(str)
    const result = []
    for(let i = 0; i < str.length; ) {
        let found = false
        const c = str.charAt(i)
        if(isHangulSyllable(c)) {
            result.push([c, c])
            i++
            continue
        }
        for(let j = str.length; j > i; j--) {
            const key = str.slice(i, j)
            const value = userDictionary[key] || dic[key]
            if(value) {
                result.push([key, initial ? initialSoundLaw(value) : value])
                i += j - i
                found = true
            }
        }
        if(!found) {
            result.push([c, c])
            i++
        }
        initial = false
    }
    return result
}

export function normalizeHanja(str) {
    return str.normalize('NFC').split('').map((c) => dic[c] ? c : jp[c] || cn[c] || c).join('')
}

export function group(arr, merge=false) {
    const result = [['', '']]
    for(let [ainput, aoutput] of arr) {
        const [rinput, routput] = result.pop()
        if(!rinput.length && !routput.length) {
            result.push([ainput, aoutput])
        } else if(type(ainput) == type(rinput) && type(aoutput) == type(routput)) {
            if(!merge && type(ainput) == 'hanja' && type(aoutput) == 'hangul')
                result.push([rinput, routput], [ainput, aoutput])
            else
                result.push([rinput + ainput, routput + aoutput])
        } else {
            result.push([rinput, routput], [ainput, aoutput])
        }
    }
    return result.filter(([input, output]) => input.length && output.length)
}

export function stringify(arr, format = (_i, o) => o) {
    return arr.map(([input, output]) => {
        if(input == output) return input
        else return format(input, output)
    }).join('')
}

export function convertAndFormat(str, format, userDictionary={}){
    return stringify(group(convert(str, true, userDictionary)), format)
}
