import { Component, PropTypes } from 'react'

const hljs = window.hljs

export class CodeBlock extends Component {
  static propTypes = {
    language: PropTypes.string,
    value: PropTypes.string.isRequired
  }

  static defaultProps = {
    language: ''
  }

  constructor(props) {
    super(props)

    this.setRef = this.setRef.bind(this)
  }

  componentDidMount() {
    this.highlightCode()
  }

  componentDidUpdate() {
    this.highlightCode()
  }

  setRef(el) {
    this.codeEl = el
  }

  highlightCode() {
    hljs.highlightBlock(this.codeEl)
  }

  render() {
    return (
      <pre>
        <code className={this.props.language} ref={this.setRef}>
          {this.props.value}
        </code>
      </pre>
    )
  }
}
