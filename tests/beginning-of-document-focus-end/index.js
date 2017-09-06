export default (plugin, state) => {
  let block = state.document.findDescendant(node => node.type == 'image')

  return plugin.onKeyDown(
    {
      preventDefault: () => {},
      stopPropagation: () => {}
    },
    { key: 'enter' },
    state.change().collapseToEndOf(block)
  )
}
