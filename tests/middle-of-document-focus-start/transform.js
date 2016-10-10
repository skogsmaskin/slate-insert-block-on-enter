export default (plugin, state) => {
  let block = state.document.nodes.toArray()[1]

  let withCursor = state.transform()
      .collapseToStartOf(block)
      .apply()

  return plugin.onKeyDown(
    {
      preventDefault: () => {},
      stopPropagation: () => {}
    },
    { key: 'enter' },
    withCursor)
  }
