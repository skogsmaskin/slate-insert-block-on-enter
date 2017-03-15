import assert from 'assert'

export default (plugin, state) => {
  const block = state.document.nodes.toArray()[1]

  const withCursor = state.transform()
      .collapseToStartOf(block)
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
