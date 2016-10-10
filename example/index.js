
import InsertBlockOnEnter from '..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import { Editor, Raw } from 'slate'

const schema = {
  nodes: {
    image: (props) => {
      const { node, state } = props
      const isFocusedStart = state.selection.hasEdgeAtStartOf(node)
      const isFocusedEnd = state.selection.hasEdgeAtEndOf(node)
      const src = node.data.get('src')
      const className = (isFocusedStart || isFocusedEnd) ? (isFocusedStart ? 'active-start' : 'active-end') : 'non-active'
      return (
        <img src={src} className={className} {...props.attributes} />
      )
    }
  }
}


class Example extends React.Component {

  plugins = [
    InsertBlockOnEnter({kind: 'block', type: 'paragraph', nodes: [{kind: 'text', text: '', ranges: []}]})
  ];

  state = {
    state: Raw.deserialize(initialState, { terse: true })
  };

  onChange = (state) => {
    this.setState({ state })
  }

  render = () => {
    return (
      <Editor
        onChange={this.onChange}
        plugins={this.plugins}
        schema={schema}
        state={this.state.state}
      />
    )
  }

}

const example = <Example />
const root = document.body.querySelector('main')
ReactDOM.render(example, root)
