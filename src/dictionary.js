import { readFileSync } from 'fs'
export const buildDict = (file, reverse=false) => readFileSync(file)
        .toString()
        .split('\n')
        .filter((line) => !line.startsWith('#') && line.trim() != '')
        .map((line) => line.split('\t').map((item) => item.trim()))
        .reduce((acc, [key, value]) => ((reverse ? (acc[value]=key) : (acc[key]=value)), acc), {})