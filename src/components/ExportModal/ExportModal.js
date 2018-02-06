import { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import Dialog from 'material-ui/Dialog'

import FlatButton from './../Fields/FlatButton'
import {
  ArticlesTable,
  getSelectedArticles
} from './../ArticlesTable/ArticlesTable'
import { TWO } from './../../constants/Constants'
import styles from './ExportModal.less'

const inlineStyles = {
  titleStyle: {
    textAlign: 'center',
    padding: '15px'
  },
  submit: {
    float: 'left',
    margin: '0 10px'
  },
  close: {
    margin: '0 10px'
  }
}

export class ExportModal extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    handleUnmount: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.bind()

    this.state = { selectedRows: [] }
  }

  onRowSelection(selectedRows) {
    this.setState({ selectedRows })
  }

  bind() {
    this.onRowSelection = this.onRowSelection.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit() {
    const tempLink = document.createElement('a')
    const newArticles = getSelectedArticles(
      this.props.articles,
      this.state.selectedRows
    )
    const content = encodeURIComponent(JSON.stringify(newArticles, null, TWO))

    if (newArticles.isEmpty()) {
      return
    }

    tempLink.setAttribute('href', `data:text/plain;charset=utf-8,${content}`)
    tempLink.setAttribute('download', 'heutagogy.json')

    if (document.createEvent) {
      const event = document.createEvent('MouseEvents')

      event.initEvent('click', true, true)
      tempLink.dispatchEvent(event)
    } else {
      tempLink.click()
    }
  }

  render() {
    const actions = [
      <FlatButton
        disabled={this.props.articles.isEmpty()}
        label={'Save'}
        primary
        style={inlineStyles.submit}
        onTouchTap={this.handleSubmit}
      />,
      <FlatButton
        label={'Cancel'}
        primary
        style={inlineStyles.close}
        onTouchTap={this.props.handleUnmount}
      />
    ]

    return (
      <div>
        <Dialog
          actions={actions}
          autoScrollBodyContent
          bodyStyle={{ padding: 0, backgroundColor: '#eee' }}
          modal={false}
          open
          title={'Export Articles'}
          titleStyle={inlineStyles.titleStyle}
          onRequestClose={this.props.handleUnmount}
        >
          <div className={styles.table}>
            <ArticlesTable
              articles={this.props.articles}
              handleOnRowSelection={this.onRowSelection}
              id={'exporting-table'}
              selectable
              selectedRows={this.state.selectedRows}
            />
          </div>
        </Dialog>
      </div>
    )
  }
}

export default ExportModal
