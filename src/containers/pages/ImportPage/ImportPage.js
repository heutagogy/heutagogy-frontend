/* eslint-disable fp/no-mutation */
/* eslint-disable fp/no-delete */
/* eslint-disable fp/no-let */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
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
import { rememberArticles } from './../../../actions/articles';

const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

const THOUSAND = 1000;
const ZERO = 0;
const ONE = 1;

const inlineStyles = {
  dialogContentStyle: {
    maxWidth: '420px',
  },
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

export class ImportPage extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    loadEntities: PropTypes.func,
    rememberArticles: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.bind();

    this.state = {
      data: [],
      openModal: false,
    };

    // tried to use state but there is a bug with checkboxes in table.
    window.heautagogy = {
      selectedRows: [],
    };
  }

  componentWillMount() {
    this.props.loadEntities({ href: '/bookmarks', type: ARTICLES_VIEW_STATE, schema: arrayOf(articleSchema) });
  }

  getSelectedRows(data) {
    const result = [];

    if (data.length === ZERO ||
        window.heautagogy.selectedRows.length === ZERO) {
      return [];
    }

    if (window.heautagogy.selectedRows.length === ONE &&
        window.heautagogy.selectedRows[ZERO] === 'all') {
      return data;
    }

    for (let i = ZERO; i < window.heautagogy.selectedRows; i++) {
      const index = window.heautagogy.selectedRows[i];

      result.push(data[index]);
    }

    return result;
  }

  bind() {
    this.handleOnFileUploadChange = this.handleOnFileUploadChange.bind(this);
    this.handleOnFileUploadClick = this.handleOnFileUploadClick.bind(this);
    this.handleOnRowSelection = this.handleOnRowSelection.bind(this);
    this.handleOnSave = this.handleOnSave.bind(this);
  }

  filterByServerEntities(data) {
    const articles = this.props.articles;

    if (!articles || articles.isEmpty() || data.length === ZERO) {
      return Immutable.fromJS(data);
    }

    const normalizedArticles = articles.map((item) => item.delete('id')).toSet();
    const newArticles = Immutable.fromJS(data).toSet().subtract(normalizedArticles);

    return newArticles.toList();
  }

  handleOnSave() {
    const data = this.getSelectedRows(this.state.data);
    const articles = this.filterByServerEntities(data);

    if (!articles.isEmpty()) {
      this.props.rememberArticles({ articles });
      this.props.loadEntities({ href: '/bookmarks', type: ARTICLES_VIEW_STATE, schema: arrayOf(articleSchema) });
    }

    this.setState({ data: [] });
  }

  handleCloseModal = () => {
    this.setState({ openModal: false });
  };

  handleOnFileUploadChange(event) {
    const file = event.target.files[0];
    const fr = new FileReader();

    fr.onload = (e) => {
      const res = e.target.result;

      if (isJsonString(res) && Array.isArray(JSON.parse(res))) {
        this.setState({ data: JSON.parse(res) });
      } else {
        this.setState({ openModal: true });
      }
    };

    fr.readAsText(file);
  }

  handleOnFileUploadClick(event) {
    // allow to select the same file few times in a row.
    event.target.value = null;

    this.setState({ data: [] });
  }

  handleOnRowSelection(selectedRows) {
    switch (selectedRows) {
      case 'all':
        window.heautagogy.selectedRows = ['all'];
        break;
      case 'none':
        window.heautagogy.selectedRows = [];
        break;
      default:
        window.heautagogy.selectedRows = selectedRows;
    }
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
          showRowHover
        >
          {this.state.data.map((item) => {
            return (
              <TableRow key={item.url}>
                <TableRowColumn>
                  <a
                    href={item.url}
                    target="_blank"
                  >
                    {item.url}
                  </a>
                </TableRowColumn>
                <TableRowColumn>{item.title}</TableRowColumn>
                <TableRowColumn>{moment.unix(item.timestamp / THOUSAND).format('MM/DD/YYYY hh:mm')}</TableRowColumn>
                <TableRowColumn>{item.state ? 'No' : 'Yes'}</TableRowColumn>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  renderModal() {
    const okButton =
      <FlatButton
        label="OK"
        primary
        onTouchTap={this.handleCloseModal}
      />;

    return (
      <Dialog
        actions={okButton}
        contentStyle={inlineStyles.dialogContentStyle}
        modal={false}
        open={this.state.openModal}
        onRequestClose={this.handleCloseModal}
      >
        {'Please, choose the file containing a valid json array.'}
      </Dialog>
    );
  }

  render() {
    return (
      <div>
        <div style={inlineStyles.buttons}>
          <div style={inlineStyles.leftButton}>
            <RaisedButton
              containerElement="label"
              id={'import-button-import'}
              label={'Import'}
              labelPosition="before"
              primary
            >
              <input
                accept=".json"
                id="upload"
                style={inlineStyles.input}
                type="file"
                onChange={this.handleOnFileUploadChange}
                onClick={this.handleOnFileUploadClick}
              />
            </RaisedButton>
          </div>
          <div style={inlineStyles.rightButton}>
            <RaisedButton
              disabled={this.state.data.length === ZERO}
              id={'save-button-import'}
              label={'Save'}
              primary
              onClick={this.handleOnSave}
            />
          </div>
        </div>
        <div style={inlineStyles.table}>
          {this.renderTable()}
        </div>
        <div>
          {this.renderModal()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  articles: getFilteredArticles(state),
});

export default connect(mapStateToProps, { rememberArticles, loadEntities })(ImportPage);
