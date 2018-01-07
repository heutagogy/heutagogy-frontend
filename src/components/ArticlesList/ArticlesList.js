/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-multi-comp */
import Immutable from 'immutable';

import { Component, PropTypes } from 'react';

import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui-next/List';
import Menu, { MenuItem } from 'material-ui-next/Menu';
import IconButton from 'material-ui-next/IconButton';
import TextField from 'material-ui-next/TextField';

import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui-next/Dialog';
import Button from 'material-ui-next/Button';
import Divider from 'material-ui-next/Divider';

import MoreVertIcon from 'material-ui-icons/MoreVert';
import EditIcon from 'material-ui-icons/Edit';
import DeleteForeverIcon from 'material-ui-icons/DeleteForever';
import InfoIcon from 'material-ui-icons/Info';
import CheckIcon from 'material-ui-icons/Check';
import CheckBoxOutlineBlankIcon from 'material-ui-icons/CheckBoxOutlineBlank';
import CheckBoxIcon from 'material-ui-icons/CheckBox';
import InsertCommentIcon from 'material-ui-icons/InsertComment';

import moment from 'moment';

import NotesPopup from '../NotesPopup/NotesPopup';
import { formatTimeToUser } from './../../utils/timeUtils';

const Tag = ({ tag }) => <span style={{ marginRight: '5px' }}>{`@${tag}`}</span>;

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
};

class ArticleMenu extends Component {
  static propTypes = {
    article: PropTypes.object,
    onDeleteClicked: PropTypes.func,
    onEditClicked: PropTypes.func,
    onNotesClicked: PropTypes.func,
    onReadClicked: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };
  }

  handleMenuClicked = (e) => {
    this.setState({
      anchorEl: e.currentTarget,
    });
  }

  closeMenu = () => {
    this.setState({
      anchorEl: null,
    });
  }

  handleEditClicked = () => {
    this.closeMenu();

    this.props.onEditClicked();
  }

  handleDeleteClicked = () => {
    this.closeMenu();

    this.props.onDeleteClicked();
  }

  handleReadClicked = () => {
    this.closeMenu();

    this.props.onReadClicked();
  }

  handleNotesClicked = () => {
    this.closeMenu();

    this.props.onNotesClicked();
  }

  render() {
    const article = this.props.article;

    // const menuId = `more-menu-${article.id}`;
    const menuId = 'more-menu';

    const readMenuItem = article.read
                       ? <MenuItem
                         onTouchTap={this.handleReadClicked}
                       >
                         <ListItemIcon>
                           <CheckBoxIcon />
                         </ListItemIcon>
                         <ListItemText primary={`Read: ${formatTimeToUser(article.read)}`} />
                       </MenuItem>
                       : <MenuItem
                         onTouchTap={this.handleReadClicked}
                       >
                         <ListItemIcon>
                           <CheckBoxOutlineBlankIcon />
                         </ListItemIcon>
                         <ListItemText primary="Not read" />
                       </MenuItem>;

    return (
      <div>
        <IconButton
          aria-haspopup="true"
          aria-label="More"
          aria-owns={this.state.anchorEl ? menuId : null}
          onTouchTap={this.handleMenuClicked}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={this.state.anchorEl}
          id={menuId}
          open={Boolean(this.state.anchorEl)}
          onClose={() => this.closeMenu()}
        >
          <MenuItem disabled>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText
              primary={`Saved: ${formatTimeToUser(article.timestamp)}`}
            />
          </MenuItem>

          {readMenuItem}

          <Divider />

          <MenuItem onTouchTap={this.handleNotesClicked}>
            <ListItemIcon>
              <InsertCommentIcon />
            </ListItemIcon>
            <ListItemText primary={`Notes (${(article.notes ? article.notes : []).length})`} />
          </MenuItem>

          <MenuItem onTouchTap={this.handleEditClicked}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>

          <Divider />

          <MenuItem onTouchTap={this.handleDeleteClicked}>
            <ListItemIcon>
              <DeleteForeverIcon />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

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
    tags: preTags === '' ? [] : preTags.split(/[,\s]+/),
  };
};

class EditDialog extends Component {
  static propTypes = {
    article: PropTypes.object,
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
        open={this.props.open}
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

class Article extends Component {
  static propTypes = {
    article: PropTypes.object,
    onDelete: PropTypes.func,
    onRead: PropTypes.func,
    onUpdate: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      editDialogOpen: false,
      deleteDialogOpen: false,
      notesDialogOpen: false,
    };
  }

  handleNotesClicked = () => {
    this.setState({
      notesDialogOpen: true,
    });
  }

  handleNotesClose = () => {
    this.setState({
      notesDialogOpen: false,
    });
  }

  handleEditClicked = () => {
    this.setState({
      editDialogOpen: true,
    });
  }

  handleEditCancel = () => {
    this.setState({
      editDialogOpen: false,
    });
  }

  handleEditFinished = (article) => {
    this.props.onUpdate(article);

    this.setState({
      editDialogOpen: false,
    });
  }

  handleDeleteClicked = () => {
    this.setState({
      deleteDialogOpen: true,
    });
  }

  closeDeleteDialog = () => {
    this.setState({
      deleteDialogOpen: false,
    });
  }

  handleDeleteCancel = () => {
    this.closeDeleteDialog();
  }

  handleDeleteConfirmed = () => {
    this.props.onDelete();
    this.closeDeleteDialog();
  }

  render() {
    const article = this.props.article;

    return (
      <ListItem
        button
        component="a"
        href={article.url}
        target="_blank"
      >
        {
          article.read ? <ListItemIcon><CheckIcon /></ListItemIcon> : null
        }
        <ListItemText
          inset={!article.read}
          primary={article.title}
          secondary={article.tags === null ? null : article.tags.map((tag) =>
            <Tag
              key={`tag-${tag}`}
              tag={tag}
            />)}
        />
        <ListItemSecondaryAction>
          <ArticleMenu
            article={article}
            onDeleteClicked={this.handleDeleteClicked}
            onEditClicked={this.handleEditClicked}
            onNotesClicked={this.handleNotesClicked}
            onReadClicked={this.props.onRead}
          />

          <Dialog
            open={this.state.deleteDialogOpen}
          >
            <DialogTitle>{`Delete ${article.title}?`}</DialogTitle>
            <DialogContent>{'Are you sure you want to delete article?'}</DialogContent>
            <DialogActions>
              <Button onTouchTap={this.handleDeleteCancel}>{'Cancel'}</Button>
              <Button
                color="primary"
                onTouchTap={this.handleDeleteConfirmed}
              >
                {'Ok'}
              </Button>
            </DialogActions>
          </Dialog>

          <EditDialog
            article={article}
            open={this.state.editDialogOpen}
            onCancel={this.handleEditCancel}
            onEditComplete={this.handleEditFinished}
          />

          { this.state.notesDialogOpen
          ? <NotesPopup
            articleId={article.id}
            /* eslint-disable react/jsx-handler-names */
            handleClose={this.handleNotesClose}
            notes={article.notes}
            title={article.title}
          />
          : null}
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export class ArticlesList extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    onDeleteArticle: PropTypes.func,
    onUpdateArticle: PropTypes.func,
  };

  render() {
    return <List>
      {this.props.articles.toJS().map((article) =>
        <Article
          article={article}
          key={`article-${article.id}`}
          onDelete={() => this.props.onDeleteArticle(article.id)}
          onRead={() => this.props.onUpdateArticle(article.id, {
            read: article.read ? null : moment().format(),
          })}
          onUpdate={(update) => this.props.onUpdateArticle(article.id, update)}
        />)}
    </List>;
  }
}
