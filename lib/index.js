import {Block} from 'slate'
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

  createBlockProps = typeof blockInputProps == 'string'
    ? { type: createBlockProps }
    : createBlockProps

  /**
    *
    * @param {Event} e
    * @param {Object} data
    * @param {State} state
    * @return {State}
    */

  function onKeyDown(e, data, change) {
    if (data.key === 'enter') {
      const state = change.state
      const { document, startKey, startBlock} = state

      delete blockInputProps.nodes // Backward compatability
      delete blockInputProps.kind // Backward compatability

      if (startBlock && startBlock.isVoid) {
        const nextBlock = document.getNextBlock(startKey)
        const prevBlock = document.getPreviousBlock(startKey)
        const isFocusedStart = state.selection.hasEdgeAtStartOf(startBlock)
        const isFocusedEnd = state.selection.hasEdgeAtEndOf(startBlock)

        // Void block at the end of the document
        if (!nextBlock) {
          if (isFocusedEnd) {
            debug('no nextBlock, PrevBlock, isFocusedEnd')
            return change
              .collapseToEndOf(startBlock)
              .insertBlock(blockInputProps, {replaceEmpty: false})
              .collapseToEnd()
          }
          if (prevBlock) {
            debug('no nextBlock, PrevBlock, isFocusedStart')
            return change
              .collapseToEndOf(prevBlock)
              .insertBlock(blockInputProps, {replaceEmpty: false})
              .collapseToStartOf(startBlock)
          }
          debug('no nextBlock, no PrevBlock')
          return change
            .collapseToStartOf(startBlock)
            .insertBlock(blockInputProps, {replaceEmpty: false})
            .moveNodeByKey(startBlock.key, document.key, 1)
            .collapseToStartOfNextBlock()
        }
        // Void block between two blocks
        if (nextBlock && prevBlock) {
          if (isFocusedStart) {
            debug('nextBlock, prevBlock, isFocusedStart')
            const index = document.nodes.indexOf(prevBlock)
            return change
              .collapseToEndOf(prevBlock)
              .insertBlock(blockInputProps, {replaceEmpty: false})
              .collapseToStartOf(startBlock)
          }
          debug('nextBlock, prevBlock, isFocusedEnd')
          return change
            .collapseToEndOf(startBlock)
            .insertBlock(blockInputProps, {replaceEmpty: false})
            .collapseToEnd()
        }
        // Void block in the beginning of the document
        if (nextBlock && !prevBlock) {
          if (isFocusedStart) {
            debug('nextBlock, no prevBlock, isFocusedStart')
            return change
              .collapseToStartOf(startBlock)
              .insertBlock(blockInputProps, {replaceEmpty: false})
              .moveNodeByKey(startBlock.key, document.key, 1)
              .collapseToStartOfNextBlock()
          }
          debug('nextBlock, no prevBlock, isFocusedEnd')
          return change
            .collapseToEndOf(startBlock)
            .insertBlock(blockInputProps, {replaceEmpty: false})
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
