/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-multi-comp */
import Immutable from 'immutable';

import { Component, PropTypes } from 'react';

import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui-next/List';
import Menu, { MenuItem } from 'material-ui-next/Menu';
import IconButton from 'material-ui-next/IconButton';

import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui-next/Dialog';
import Button from 'material-ui-next/Button';
import Divider from 'material-ui-next/Divider';

import Collapse from 'material-ui-next/transitions/Collapse';

import { withStyles } from 'material-ui-next/styles';

import MoreVertIcon from 'material-ui-icons/MoreVert';
import DeleteForeverIcon from 'material-ui-icons/DeleteForever';
import InfoIcon from 'material-ui-icons/Info';
import Toggle from 'material-ui/Toggle';
import InsertCommentIcon from 'material-ui-icons/InsertComment';

import moment from 'moment';

import { formatTimeToUser } from './../../utils/timeUtils';

import NotesPopup from '../NotesPopup/NotesPopup';
import ArticleEditDialog from './ArticleEditDialog';

const articleListStyles = (theme) => ({
  nested: {
    paddingLeft: theme.spacing.unit * 2,
  },
});

const listItemStyles = (theme) => ({
  secondaryAction: {
    paddingRight: theme.spacing.unit * 12,
  },
});

const articleStyles = {
  articleLink: {
    color: '#265c83',
    '&:hover': {
      textDecoration: 'none',
    },
  },
};

const Tag = ({ tag }) => <span style={{ marginRight: '5px' }}>{`@${tag}`}</span>;

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
};

class ArticleMenu extends Component {
  static propTypes = {
    article: PropTypes.object,
    onDeleteClicked: PropTypes.func,
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

    const readMenuItem =
      <MenuItem
        onTouchTap={this.handleReadClicked}
      >
        <Toggle
          defaultToggled={Boolean(article.read)}
          label={article.read ? 'Mark as unread' : 'Mark as read'}
          labelPosition={'right'}
          labelStyle={{ marginLeft: '0.7em' }}
        />
      </MenuItem>;

    const hasNotes = (article.notes || []).length !== 0;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
        }}
      >
        <IconButton
          onTouchTap={this.props.onNotesClicked}
        >
          <InsertCommentIcon
            color={hasNotes ? null : 'silver'}
          />
        </IconButton>
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

          {readMenuItem}

          <Divider />

          <MenuItem disabled>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText
              primary={`Saved: ${formatTimeToUser(article.timestamp)}`}
            />
          </MenuItem>
          {
            article.read
              ? <MenuItem disabled>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`Read: ${formatTimeToUser(article.read)}`}
                />
              </MenuItem>
             : null
          }

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

const MyListItem = withStyles(listItemStyles)(ListItem);

@withStyles(articleStyles)
class Article extends Component {
  static propTypes = {
    article: PropTypes.object,
    articles: PropTypes.instanceOf(Immutable.List).isRequired,
    classes: PropTypes.object,
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
      <MyListItem
        button
        key={String(article.id)}
        onTouchTap={this.handleEditClicked}
      >
        <ListItemText
          primary={
            <a
              className={this.props.classes.articleLink}
              href={article.url}
              rel="noopener"
              target="_blank"
              onTouchTap={(e) => e.stopPropagation()}
            >
              {article.title}
            </a>
          }
          secondary={article.tags === null ? null : article.tags.map((tag) =>
            <Tag
              key={`tag-${tag}`}
              tag={tag}
            />)}
          style={{ opacity: article.read ? 0.4 : 1.0 }}
        />
        <ListItemSecondaryAction>
          <ArticleMenu
            article={article}
            onDeleteClicked={this.handleDeleteClicked}
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

          <ArticleEditDialog
            article={article}
            articles={this.props.articles}
            open={this.state.editDialogOpen}
            onCancel={this.handleEditCancel}
            onEditComplete={this.handleEditFinished}
          />

          <NotesPopup
            articleId={article.id}
            /* eslint-disable react/jsx-handler-names */
            handleClose={this.handleNotesClose}
            notes={article.notes}
            open={this.state.notesDialogOpen}
            title={article.title}
          />
        </ListItemSecondaryAction>
      </MyListItem>
    );
  }
}

@withStyles(articleListStyles)
export class ArticlesList extends Component {
  static propTypes = {
    allArticles: PropTypes.instanceOf(Immutable.List),
    articles: PropTypes.instanceOf(Immutable.List),
    classes: PropTypes.object,
    onDeleteArticle: PropTypes.func,
    onUpdateArticle: PropTypes.func,
  };

  renderArticle = (article) => (
    <Article
      article={article}
      articles={this.props.allArticles}
      key={`article-${article.id}`}
      onDelete={() => this.props.onDeleteArticle(article.id)}
      onRead={() => this.props.onUpdateArticle(article.id, {
        read: article.read ? null : moment().format(),
      })}
      onUpdate={(update) => this.props.onUpdateArticle(article.id, update)}
    />
  );

  renderChildren = (article) => {
    if (!article.children) {
      return null;
    }

    return (
      <Collapse
        className={this.props.classes.nested}
        in
        key={`children-${article.id}`}
      >
        <List disablePadding>
          {article.children.map((child) => [
            this.renderArticle(child),
            this.renderChildren(child),
          ])}
        </List>
      </Collapse>
    );
  };

  render() {
    return <List>
      {this.props.articles.toJS().map((article) => {
        if (article.parent) {
          return null;
        }

        return [
          this.renderArticle(article),
          this.renderChildren(article),
        ];
      })}
    </List>;
  }
}
