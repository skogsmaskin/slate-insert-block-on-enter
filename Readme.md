
# `slate-insert-block-on-enter`

A Slate plugin to insert a specified block (like a paragraph) when enter is hit on a void node.


## Install

```
npm install slate-insert-block-on-enter
```


## Usage

```js
import InsertBlockOnEnter from 'slate-insert-block-on-enter'

const plugins = [
  InsertBlockOnEnter({kind: 'block', type: 'paragraph', nodes: [{kind: 'text', text: '', ranges: []}]})
]
```

#### Arguments

- `blockProps: Object` — the properties of the block to insert when enter is pressed on focused void node.


## License

The MIT License

Copyright &copy; 2016, [Per-Kristian Nordnes](https://github.com/skogsmaskin)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
