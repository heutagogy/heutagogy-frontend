/* eslint-disable react/jsx-no-bind */

import Immutable from 'immutable';
import { Component, PropTypes } from 'react';
import { TableHeader, TableHeaderColumn, Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import moment from 'moment';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { ArticleTitle } from './ArticleTitle';

import { ZERO, MINUS_ONE } from './../../constants/Constants';
import { formatTimeToUser } from './../../utils/timeUtils';
import Spinner from './../Spinner';

import styles from './ArticlesTable.less';

export class ArticlesTable extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    deleteArticle: PropTypes.func,
    handleOnRowSelection: PropTypes.func,
    selectable: PropTypes.bool,
    selectedRows: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    updateArticle: PropTypes.func,
    updateArticleState: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);

    this.state = {
      deleteArticleId: null,
    };

    [
      'getReadMenuItemText',
      'getDeleteDialog',
      'handleDelete',
      'handleDeleteConfirmed',
      'handleDeleteCancelled',
    ].forEach((method) => { this[method] = this[method].bind(this); });
  }

  getReadMenuItemText(item) {
    const readArticleClassName = 'read-article';
    const fieldName = 'Read: ';
    const handleOnRead = () => {
      this.props.updateArticle(
        item.get('id'),
        { read: moment().format() }
      );
    };

    if (item.get('read')) {
      return (
        <div className={readArticleClassName}>
          {`${fieldName}${formatTimeToUser(item.get('read'))}`}
        </div>
      );
    }

    if (!this.props.updateArticle) {
      return (
        <div className={readArticleClassName}>
          {`${fieldName}No`}
        </div>
      );
    }

    return (
      <div>
        { this.props.updateArticleState && this.props.updateArticleState.get('isInProgress')
          ? <div>{fieldName}<Spinner /></div> : <Checkbox
            className={readArticleClassName}
            iconStyle={{ marginTop: '6px' }}
            label={fieldName}
            labelPosition="left"
            labelStyle={{ width: 'auto', lineHeight: '48px' }}
            style={{ verticalAlign: 'center' }}
            onCheck={handleOnRead}
          />}
      </div>
    );
  }

  getDeleteDialog() {
    const actions = [
      <FlatButton
        key="cancel"
        label="Cancel"
        primary
        onTouchTap={this.handleDeleteCancelled}
      />,
      <FlatButton
        key="delete"
        label="Delete"
        primary
        onTouchTap={this.handleDeleteConfirmed}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        open={this.state.deleteArticleId !== null}
        onRequestClose={this.handleDeleteCancelled}
      >
        {'Are you sure you want to delete?'}
      </Dialog>);
  }

  handleDelete(id) {
    this.setState({
      deleteArticleId: id,
    });
  }

  handleDeleteConfirmed() {
    this.props.deleteArticle(this.state.deleteArticleId);
    this.setState({
      deleteArticleId: null,
    });
  }

  handleDeleteCancelled() {
    this.setState({
      deleteArticleId: null,
    });
  }

  render() {
    return (
      <div style={{ width: 'auto', maxWidth: '700px', margin: '0 auto' }}>
        {this.getDeleteDialog()}
        <Table
          fixedHeader={false}
          multiSelectable
          onRowSelection={this.props.handleOnRowSelection}
        >
          <TableHeader
            adjustForCheckbox={Boolean(this.props.selectable)}
            displaySelectAll={Boolean(this.props.selectable)}
            style={{ backgroundColor: '#eee' }}
          >
            <TableRow>
              <TableHeaderColumn>{'Title'}</TableHeaderColumn>
              <TableHeaderColumn style={{ width: '10px' }}>{'Meta'}</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            deselectOnClickaway={false}
            displayRowCheckbox={Boolean(this.props.selectable)}
          >
          {this.props.articles.map((item, i) => { // eslint-disable-line
            return (
              <TableRow
                key={i}
                selected={this.props.selectedRows.indexOf(i) !== MINUS_ONE}
                style={{ backgroundColor: '#eee' }}
              >
                <ArticleTitle
                  read={item.get('read')}
                  title={item.get('title')}
                  url={item.get('url')}
                  onTitleChanged={(title) => { this.props.updateArticle(item.get('id'), { title }); }}
                />
                <TableRowColumn
                  className={styles.preventCellClick}
                  style={{ width: '5px', paddingLeft: '13px' }}
                >
                  <div
                    className={styles.preventCellClickWrapper}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconMenu
                      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                      className="icon-menu"
                      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                      useLayerForClickAway
                    >
                      <MenuItem
                        disabled
                        primaryText={`Saved: ${formatTimeToUser(item.get('timestamp'))}`}
                      />
                      <MenuItem
                        disabled={Boolean(item.get('read')) || !this.props.updateArticle}
                      >
                        {this.getReadMenuItemText(item)}
                      </MenuItem>
                      { this.props.deleteArticle
                      ? <MenuItem
                        primaryText="Delete"
                        onTouchTap={() => this.handleDelete(item.get('id'))}
                      /> : null }
                    </IconMenu>
                  </div>
                </TableRowColumn>
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export const getSelectedArticles = (articles, selectedRows) => {
  if (articles.isEmpty() ||
      selectedRows === 'none' ||
      (Array.isArray(selectedRows) && selectedRows.length === ZERO)) {
    return Immutable.fromJS([]);
  }

  if (selectedRows === 'all') {
    return articles;
  }

  return articles.filter((x, i) => selectedRows.includes(i));
};
