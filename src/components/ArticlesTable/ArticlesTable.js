/* eslint-disable react/jsx-no-bind */

import Immutable from 'immutable';
import moment from 'moment';
import { Component, PropTypes } from 'react';
import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';

import { ZERO, ONE, MINUS_ONE } from './../../constants/Constants';

import styles from './ArticlesTable.less';

const inlineStyles = {
  wrapWordColumn: {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
};

const comparator = (articleA, articleB) => {
  const timestampA = articleA.get('timestamp');
  const timestampB = articleB.get('timestamp');
  const readA = articleA.get('read');
  const readB = articleB.get('read');

  const compareDates = (momentA, momentB) => {
    if (momentA > momentB) {
      return MINUS_ONE;
    } else if (momentA < momentB) {
      return ONE;
    }

    return ZERO;
  };

  if (readA && !readB) {
    return ONE;
  } else if (!readA && readB) {
    return MINUS_ONE;
  } else if (readA && readB) {
    return compareDates(moment(readA), moment(readB));
  }

  return compareDates(moment(timestampA), moment(timestampB));
};

export class ArticlesTable extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List).isRequired,
    handleOnRowSelection: PropTypes.func.isRequired,
    selectedRows: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
  }

  render() {
    return (
      <Table
        multiSelectable
        onRowSelection={this.props.handleOnRowSelection}
      >
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>{'Title'}</TableHeaderColumn>
            <TableHeaderColumn>{'Saved'}</TableHeaderColumn>
            <TableHeaderColumn>{'Read'}</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={false}
          showRowHover
        >
        {this.props.articles.sort(comparator).map((item, i) => { // eslint-disable-line
          return (
            <TableRow
              key={i}
              selected={this.props.selectedRows.indexOf(i) !== MINUS_ONE}
            >
              <TableRowColumn
                className={styles.preventCellClick}
                style={inlineStyles.wrapWordColumn}
              >
                <div
                  className={styles.linkDiv}
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={item.get('url')}
                    target="_blank"
                  >
                    {item.get('title')}
                  </a>
                </div>
              </TableRowColumn>
              <TableRowColumn className={styles.preventCellClick}>
                <div
                  className={styles.preventCellClickWrapper}
                  onClick={(e) => e.stopPropagation()}
                >
                  {moment(item.get('timestamp')).format('lll')}
                </div>
              </TableRowColumn>
              <TableRowColumn className={styles.preventCellClick}>
                <div
                  className={styles.preventCellClickWrapper}
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.get('read') ? moment(item.get('read')).format('lll') : 'No'}
                </div>
              </TableRowColumn>
            </TableRow>
          );
        })}
        </TableBody>
      </Table>
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
