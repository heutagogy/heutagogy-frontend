import { Component, PropTypes } from 'react';

import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from 'material-ui-next/Dialog';
import Button from 'material-ui-next/Button';

import TextField from 'material-ui-next/TextField';


const articleToState = (article) => {
  const tags = article.tags ? article.tags : [];

  return {
    title: article.title,
    url: article.url,
    tags: tags.join(' '),
  };
};

const stateToArticle = (state) => {
  const preTags = state.tags.trim();

  return {
    title: state.title,
    url: state.url,
    tags: preTags === '' ? [] : preTags.split(/[,\s]+/).map((x) => x.replace(/^@/, '')),
  };
};

class ArticleEditDialog extends Component {
  static propTypes = {
    article: PropTypes.object,
    fullScreen: PropTypes.bool.isRequired,
    open: PropTypes.bool,
    onCancel: PropTypes.func,
    onEditComplete: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = articleToState(props.article);
  }

  handleCancel = () => {
    this.setState(articleToState(this.props.article));

    this.props.onCancel();
  }

  handleOk = () => {
    const article = stateToArticle(this.state);

    this.props.onEditComplete(article);
  }

  handleChange = (name) => (e) => {
    this.setState({
      [name]: e.target.value,
    });
  }

  render() {
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
              fullWidth
              label="Title"
              margin="normal"
              value={this.state.title}
              onChange={this.handleChange('title')}
            />
            <TextField
              fullWidth
              label="URL"
              margin="normal"
              value={this.state.url}
              onChange={this.handleChange('url')}
            />
            <TextField
              fullWidth
              label="tags"
              margin="normal"
              value={this.state.tags}
              onChange={this.handleChange('tags')}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onTouchTap={this.handleCancel}>{'Cancel'}</Button>
          <Button
            color="primary"
            onTouchTap={this.handleOk}
          >
            {'Ok'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withMobileDialog()(ArticleEditDialog);
