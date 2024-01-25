
import express, { json, urlencoded } from 'express'
import { convert, group, stringify } from './index.js'

function parseFormat (str) {
    return (hanja, reading) => {
        return str.toLowerCase()
                .replace(/\{(hanja|h)\}/g, hanja)
                .replace(/\{(reading|r)\}/g, reading)
    }
}

const app = express()
    
app.use(json({limit: '10mb'}))
app.use(urlencoded({limit: '10mb', extended: true}))

app.post('/', (req, res) => {
    const format = parseFormat(req.body.format || '{r}')
    const userDictionary = req.body.userdictionary || {}
    const converted = convert(req.body.text || '', true, userDictionary)
    const merge = (req.body.merge || '').toString() == 'true'
    const grouped = group(converted, merge)
    const stringified = ((req.body.stringify || '').toString() == 'true') ? stringify(grouped, format) : grouped
    const result = {result: stringified}
    res.send(JSON.stringify(result))
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})