import {Raw, Block} from 'slate'
import Debug from 'debug'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:insert-block-on-enter')

/**
 * A Slate plugin to insert a spesific node when enter is hit on a void node.
 *
 * @param {Mixed} ...args
 * @return {Object}
 */

function InsertBlockOnEnterPlugin(...args) {
  const blockArg = args[0]
  let blockInputProps
  let defaultProps = {kind: 'block'}

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
    * @param {Object} data
    * @param {State} state
    * @return {State}
    */

  function onKeyDown(e, data, change) {
    if (data.key === 'enter') {
      const {state} = change
      const { document, startKey, startBlock} = state

      if (startBlock && startBlock.isVoid) {
        const nextBlock = document.getNextBlock(startKey)
        const prevBlock = document.getPreviousBlock(startKey)
        const isFocusedStart = state.selection.hasEdgeAtStartOf(startBlock)
        const isFocusedEnd = state.selection.hasEdgeAtEndOf(startBlock)
        const blockToInsert = Block.create(blockInputProps)

        // Void block at the end of the document
        if (!nextBlock) {
          if (isFocusedEnd) {
            debug('no nextBlock, PrevBlock, isFocusedEnd')
            return change
              .collapseToEndOf(startBlock)
              .insertBlock(blockToInsert)
              .collapseToEnd()
          }
          if (prevBlock) {
            debug('no nextBlock, PrevBlock, isFocusedStart')
            const index = document.nodes.indexOf(prevBlock)
            return change
              .collapseToEndOf(prevBlock)
              .insertNodeByKey(document.key, index + 1, blockToInsert)
              .collapseToStartOf(startBlock)
          }
          debug('no nextBlock, no PrevBlock')
          return change
            .collapseToStartOf(startBlock)
            .insertNodeByKey(document.key, 0, blockToInsert)
        }
        // Void block between two blocks
        if (nextBlock && prevBlock) {
          if (isFocusedStart) {
            debug('nextBlock, prevBlock, isFocusedStart')
            const index = document.nodes.indexOf(prevBlock)
            return change
              .collapseToEndOf(prevBlock)
              .insertNodeByKey(document.key, index + 1, blockToInsert)
              .collapseToStartOf(startBlock)
          }
          debug('nextBlock, prevBlock, isFocusedEnd')
          // NOe rart skjer her
          return change
            .collapseToEndOf(startBlock)
            .insertBlock(blockToInsert)
        }
        // Void block in the beginning of the document
        if (nextBlock && !prevBlock) {
          if (isFocusedStart) {
            debug('nextBlock, no prevBlock, isFocusedStart')
            return change
              .collapseToStartOf(startBlock)
              .insertNodeByKey(document.key, 0, blockToInsert)
          }
          debug('nextBlock, no prevBlock, isFocusedEnd')
          return change
            .collapseToEndOf(startBlock)
            .insertBlock(blockToInsert)
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
