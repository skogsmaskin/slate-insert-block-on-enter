export default (plugin, state) => {
  let block = state.document.findDescendant(node => node.type == 'image')

  let withCursor = state.transform()
      .collapseToEndOf(block)
      .apply()

  return plugin.onKeyDown(
    {
      preventDefault: () => {},
      stopPropagation: () => {}
    },
    { key: 'enter' },
    withCursor)
  }
