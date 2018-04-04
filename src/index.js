import {Block} from 'slate'

/**
 * A Slate plugin to insert a spesific node when enter is hit on a void node.
 *
 * @param {Mixed} ...args
 * @return {Object}
 */

function InsertBlockOnEnterPlugin(...args) {
  const blockArg = args[0]
  let blockInputProps
  let defaultProps = {object: 'block'}

  if (!blockArg) {
    throw new Error('You must pass a block type (string) or object for the block to insert.')
  }
  if (args[0].constructor.name === 'String') {
    blockInputProps = Object.assign({}, defaultProps, {type: blockArg})
  } else {
    blockInputProps = Object.assign(
      {},
      defaultProps,
      blockArg
    )
  }

  /**
    *
    * @param {Event} e
    * @param {Change} change
    * @return {Change}
    */

  function onKeyDown(e, change) {
    const { value } = change
    if (e.key === 'Enter') {
      const { document, startKey, endKey, startBlock} = value
      if (startBlock && startBlock.isVoid && startKey === endKey) {
        const nextBlock = document.getNextBlock(startKey)
        const prevBlock = document.getPreviousBlock(startKey)
        const isFocusedStart = value.selection.hasEdgeAtStartOf(startBlock)
        const isFocusedEnd = value.selection.hasEdgeAtEndOf(startBlock)
        const blockToInsert = Block.create(blockInputProps)

        // Void block at the end of the document
        if (!nextBlock) {
          return change
            .collapseToEndOf(startBlock)
            .insertBlock(blockToInsert)
            .collapseToEnd()
        }
        // Void block between two blocks
        if (nextBlock && prevBlock) {
          return change
            .collapseToEndOf(startBlock)
            .insertBlock(blockToInsert)
        }
        // Void block in the beginning of the document
        if (nextBlock && !prevBlock) {
          return change
            .collapseToStartOf(startBlock)
            .insertNodeByKey(document.key, 0, blockToInsert)
        }
      }
    }
  }


  /**
   * Return the plugin.
   */

  return {
    onKeyDown
  }
}


/**
 * Export.
 */

export default InsertBlockOnEnterPlugin
