
import { promisify } from 'util'
import mecab from 'mecab-sw'
import { convert } from './convert.js'
import { isAllType } from './charset.js'

const pos = promisify(mecab.pos)

export async function tokenize(str) {
    const tokens = await pos(str)
    return tokens.map(([text]) => text)
}

export function makeTable(tokens, userDictionary={}) {
    const hanjaTokens = tokens.filter((token) => isAllType('hanja', token))
    return hanjaTokens.flatMap((token) => convert(token, false, userDictionary))
}

export async function tokenizeAndConvert(str, userDictionary={}) {
    const tokens = await tokenize(str)
    const table = makeTable(tokens, userDictionary)
    console.log(str)
    console.log(table)
}
