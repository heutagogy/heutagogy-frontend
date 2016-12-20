/* eslint-disable arrow-body-style */

import Immutable from 'immutable';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import { Component, PropTypes } from 'react';
import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { arrayOf } from 'normalizr';
import { connect } from 'react-redux';

import articleSchema from './../../../schemas/article';
import { ARTICLES_VIEW_STATE } from './../../../constants/ViewStates';
import { getFilteredArticles } from './../../../selectors/articles';
import { loadEntities } from './../../../actions/entity';
import { THOUSAND, MINUS_ONE, ZERO } from './../../../constants/Constants';

const inlineStyles = {
  leftButton: {
    disable: 'inline-block',
    margin: '110px 40px 30px 70px',
  },
  rightButton: {
    disable: 'inline-block',
    margin: '30px 40px 30px 70px',
  },
  buttons: {
    float: 'left',
  },
  table: {
    padding: '70px 70px 0 0',
  },
  input: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

export class ExportPage extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    loadEntities: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.bind();
    this.state = { selectedRows: [] };
  }

  getSelectedRows(articles, selectedRows) {
    if (articles.isEmpty() ||
        selectedRows === 'none' ||
        (Array.isArray(selectedRows) && selectedRows.length === ZERO)) {
      return Immutable.fromJS([]);
    }

    if (selectedRows === 'all') {
      return articles;
    }

    return articles.filter((x, i) => selectedRows.includes(i));
  }

  bind() {
    this.handleOnExport = this.handleOnExport.bind(this);
    this.handleOnRowSelection = this.handleOnRowSelection.bind(this);
    this.handleOnSave = this.handleOnSave.bind(this);
  }

  handleOnExport() {
    this.props.loadEntities({ href: '/bookmarks', type: ARTICLES_VIEW_STATE, schema: arrayOf(articleSchema) });
  }

  handleOnSave() {
    const tempLink = document.createElement('a');
    const newArticles = this.getSelectedRows(this.props.articles, this.state.selectedRows);
    const content = encodeURIComponent(JSON.stringify(newArticles));

    if (newArticles.isEmpty()) {
      return;
    }

    tempLink.setAttribute('href', `data:text/plain;charset=utf-8,${content}`);
    tempLink.setAttribute('download', 'heutagogy.json');

    if (document.createEvent) {
      const event = document.createEvent('MouseEvents');

      event.initEvent('click', true, true);
      tempLink.dispatchEvent(event);
    } else {
      tempLink.click();
    }

    this.setState({ selectedRows: [] });
  }

  handleOnRowSelection(selectedRows) {
    this.setState({ selectedRows });
  }

  renderTable() {
    return (
      <Table
        multiSelectable
        onRowSelection={this.handleOnRowSelection}
      >
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>{'Link'}</TableHeaderColumn>
            <TableHeaderColumn>{'Title'}</TableHeaderColumn>
            <TableHeaderColumn>{'Saved'}</TableHeaderColumn>
            <TableHeaderColumn>{'Read'}</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={false}
          showRowHover
        >
          {this.props.articles.map((item, i) => {
            return (
              <TableRow
                key={i}
                selected={this.state.selectedRows.indexOf(i) !== MINUS_ONE}
              >
                <TableRowColumn>
                  <a
                    href={item.get('url')}
                    target="_blank"
                  >
                    {item.get('url')}
                  </a>
                </TableRowColumn>
                <TableRowColumn>{item.get('title')}</TableRowColumn>
                <TableRowColumn>{moment.unix(item.get('timestamp') / THOUSAND).format('MM/DD/YYYY hh:mm')}</TableRowColumn>
                <TableRowColumn>{item.get('read') ? 'Yes' : 'No'}</TableRowColumn>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  render() {
    return (
      <div>
        <div style={inlineStyles.buttons}>
          <div style={inlineStyles.leftButton}>
            <RaisedButton
              id={'export-button'}
              label={'export'}
              primary
              onClick={this.handleOnExport}
            />
          </div>
          <div style={inlineStyles.rightButton}>
            <RaisedButton
              disabled={this.props.articles.isEmpty()}
              id={'save-button'}
              label={'save'}
              primary
              onClick={this.handleOnSave}
            />
          </div>
        </div>
        <div style={inlineStyles.table}>
          {this.renderTable()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  articles: getFilteredArticles(state),
});

export default connect(mapStateToProps, { loadEntities })(ExportPage);
