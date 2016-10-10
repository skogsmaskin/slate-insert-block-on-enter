import {Raw} from 'slate'
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
  let createBlockProps
  const blockInputProps = args[0]
  if (typeof blockInputProps !== 'object') {
    throw new Error('Expected first argument to be a hash of block properties.')
  }

  /**
    *
    * @param {Event} e
    * @param {Object} data
    * @param {State} state
    * @return {State}
    */

  function onKeyDown(e, data, state) {
    if (data.key === 'enter') {
      const { document, startKey, startBlock} = state

      if (startBlock && startBlock.isVoid) {
        const nextBlock = document.getNextBlock(startKey)
        const prevBlock = document.getPreviousBlock(startKey)
        const isFocusedStart = state.selection.hasEdgeAtStartOf(startBlock)
        const isFocusedEnd = state.selection.hasEdgeAtEndOf(startBlock)
        const blockToInsert = Raw.deserializeNode(blockInputProps)

        // Void block at the end of the document
        if (!nextBlock) {
          if (isFocusedEnd) {
            debug('no nextBlock, PrevBlock, isFocusedEnd')
            return state
              .transform()
              .collapseToEndOf(startBlock)
              .insertBlock(blockToInsert)
              .collapseToEnd()
              .apply()
          }
          if (prevBlock) {
            debug('no nextBlock, PrevBlock, isFocusedStart')
            const index = document.nodes.indexOf(prevBlock)
            return state
              .transform()
              .collapseToEndOf(prevBlock)
              .insertNodeByKey(document.key, index + 1, blockToInsert)
              .collapseToStartOf(startBlock)
              .apply()
          }
          debug('no nextBlock, no PrevBlock')
          return state
            .transform()
            .collapseToStartOf(startBlock)
            .insertNodeByKey(document.key, 0, blockToInsert)
            .apply()
        }
        // Void block between two blocks
        if (nextBlock && prevBlock) {
          if (isFocusedStart) {
            debug('nextBlock, prevBlock, isFocusedStart')
            const index = document.nodes.indexOf(prevBlock)
            return state
              .transform()
              .collapseToEndOf(prevBlock)
              .insertNodeByKey(document.key, index + 1, blockToInsert)
              .collapseToStartOf(startBlock)
              .apply()
          }
          debug('nextBlock, prevBlock, isFocusedEnd')
          return state
            .transform()
            .collapseToEndOf(startBlock)
            .insertBlock(blockToInsert)
            .collapseToEnd()
            .apply()
        }
        // Void block in the beginning of the document
        if (nextBlock && !prevBlock) {
          if (isFocusedStart) {
            debug('nextBlock, no prevBlock, isFocusedStart')
            return state
              .transform()
              .collapseToStartOf(startBlock)
              .insertNodeByKey(document.key, 0, blockToInsert)
              .apply()
          }
          debug('nextBlock, no prevBlock, isFocusedEnd')
          return state
            .transform()
            .collapseToEndOf(startBlock)
            .insertBlock(blockToInsert)
            .apply()
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
