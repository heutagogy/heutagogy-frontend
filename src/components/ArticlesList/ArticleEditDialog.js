import Immutable from 'immutable'

import { Component, PropTypes } from 'react'

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog
} from 'material-ui-next/Dialog'
import Button from 'material-ui-next/Button'

import TextField from 'material-ui-next/TextField'

import ArticleSelect from './ArticleSelect'

const articleToState = article => {
  const tags = article.tags ? article.tags : []

  return {
    title: article.title,
    url: article.url,
    tags: tags.join(' '),
    parentId: article.parent
  }
}

const stateToArticle = state => {
  const preTags = state.tags.trim()

  return {
    title: state.title,
    url: state.url,
    tags:
      preTags === ''
        ? []
        : preTags.split(/[,\s]+/).map(x => x.replace(/^@/, '')),
    parent: state.parentId
  }
}

class ArticleEditDialog extends Component {
  static propTypes = {
    article: PropTypes.object,
    articles: PropTypes.instanceOf(Immutable.Map).isRequired,
    fullScreen: PropTypes.bool.isRequired,
    open: PropTypes.bool,
    onCancel: PropTypes.func,
    onEditComplete: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = articleToState(props.article)
  }

  handleCancel = () => {
    this.setState(articleToState(this.props.article))

    this.props.onCancel()
  }

  handleOk = () => {
    const article = stateToArticle(this.state)

    this.props.onEditComplete(article)
  }

  handleChange = name => e => {
    this.setState({
      [name]: e.target.value
    })
  }

  handleParentSelected = parentId => {
    this.setState({
      parentId
    })
  }

  catchEnter = f => e => {
    if (e.key === 'Enter') {
      f(e)
    }
  }

  render() {
    const parentInputLabel = this.state.parentId
      ? `Parent article: #${this.state.parentId}`
      : 'Parent article: not selected'
    const initialParent = this.props.articles.get(this.props.article.parent)
    const initialParentValue = initialParent ? initialParent.get('title') : ''

    return (
      <Dialog
        fullScreen={this.props.fullScreen}
        open={this.props.open}
        onClose={this.handleCancel}
      >
        <DialogTitle>{this.props.article.title}</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              autoFocus
              fullWidth
              label="Title"
              margin="normal"
              value={this.state.title}
              onChange={this.handleChange('title')}
              onKeyPress={this.catchEnter(this.handleOk)}
            />
            <TextField
              fullWidth
              label="URL"
              margin="normal"
              value={this.state.url}
              onChange={this.handleChange('url')}
              onKeyPress={this.catchEnter(this.handleOk)}
            />
            <TextField
              fullWidth
              label="Tags"
              margin="normal"
              value={this.state.tags}
              onChange={this.handleChange('tags')}
              onKeyPress={this.catchEnter(this.handleOk)}
            />
            <ArticleSelect
              articles={this.props.articles}
              initialValue={initialParentValue}
              inputProps={{
                fullWidth: true,
                label: parentInputLabel,
                margin: 'normal'
              }}
              onArticleSelected={this.handleParentSelected}
              onKeyPress={this.catchEnter(this.handleOk)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onTouchTap={this.handleCancel}>{'Cancel'}</Button>
          <Button color="primary" onTouchTap={this.handleOk}>
            {'Ok'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withMobileDialog()(ArticleEditDialog)
