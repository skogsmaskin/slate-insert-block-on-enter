import InsertBlockOnEnterPlugin from '../lib'
import expect from 'expect'
import fs from 'fs'
import path from 'path'
import Slate from 'slate'
import readMetadata from 'read-metadata'


describe('slate-insert-block-on-enter', () => {
    const tests = fs.readdirSync(__dirname)
    const plugin = InsertBlockOnEnterPlugin({kind: 'block', type: 'paragraph', nodes: [{kind: 'text', text: '', ranges: []}]})

    tests.forEach(test => {
        if (test[0] === '.' || path.extname(test).length > 0) return

        it(test, () => {
            const dir = path.resolve(__dirname, test)
            const input = readMetadata.sync(path.resolve(dir, 'input.yaml'))
            const expected = readMetadata.sync(path.resolve(dir, 'expected.yaml'))
            const runTransform = require(path.resolve(dir, 'transform.js')).default

            const stateInput = Slate.Raw.deserialize(input, { terse: true })

            const newState = runTransform(plugin, stateInput)

            const newDocJSon = Slate.Raw.serialize(newState, { terse: true })
            expect(newDocJSon).toEqual(expected)
        })
    })
})
