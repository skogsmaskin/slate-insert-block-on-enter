import InsertBlockOnEnterPlugin from '../lib'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import Slate from 'slate'
import readMetadata from 'read-metadata'

/**
 * Strip all of the dynamic properties from a `json` object.
 *
 * @param {Object} json
 * @return {Object}
 */

function strip(json) {
    const { key, ...props } = json

    if (props.nodes) {
        props.nodes = props.nodes.map(strip)
    }

    return props
}

describe('slate-insert-block-on-enter', () => {
    const tests = fs.readdirSync(__dirname)
    const plugin = InsertBlockOnEnterPlugin('paragraph')

    tests.forEach(test => {
        if (test[0] === '.' || path.extname(test).length > 0) return

        it(test, () => {
            const dir = path.resolve(__dirname, test)
            const input = readMetadata.sync(path.resolve(dir, 'input.yaml'))
            const expected = readMetadata.sync(path.resolve(dir, 'output.yaml'))
            const fn = require(path.resolve(dir)).default

            let state = Slate.Raw.deserialize(input, { terse: true })
            const change = fn(plugin, state)

            const output = Slate.Raw.serialize(change.state, { terse: true })
            assert.deepEqual(strip(output), strip(expected))
        })
    })
})
