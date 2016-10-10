export default (plugin, state) => {
  let block = state.document.findDescendant(node => node.type == 'image')

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
