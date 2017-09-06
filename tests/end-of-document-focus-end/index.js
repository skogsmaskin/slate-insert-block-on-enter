import assert from 'assert'

export default (plugin, state) => {
  const block = state.document.findDescendant(node => node.type == 'image')

  const change = plugin.onKeyDown(
    {
      preventDefault: () => {},
      stopPropagation: () => {}
    },
    { key: 'enter' },
    state.change().collapseToEndOf(block)
  )
  const expectedFocusKey = change.state.document.nodes.toArray()[2].key
  assert.deepEqual(change.state.focusBlock.key, expectedFocusKey)
  return change
}
