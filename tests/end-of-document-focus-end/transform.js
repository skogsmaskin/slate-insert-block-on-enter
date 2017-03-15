import assert from 'assert'

export default (plugin, state) => {
  const block = state.document.findDescendant(node => node.type == 'image')

  const withCursor = state.transform()
      .collapseToEndOf(block)
      .apply()

  const next = plugin.onKeyDown(
    {
      preventDefault: () => {},
      stopPropagation: () => {}
    },
    { key: 'enter' },
    withCursor)
  const expectedFocusKey = next.document.nodes.toArray()[2].key
  assert.deepEqual(next.focusBlock.key, expectedFocusKey)
  return next
}
