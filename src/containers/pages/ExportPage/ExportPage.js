import Immutable from 'immutable';
import RaisedButton from 'material-ui/RaisedButton';
import { Component, PropTypes } from 'react';
import { arrayOf } from 'normalizr';
import { connect } from 'react-redux';
import { isJsonString } from './../../../utils/jsonUtils';

import articleSchema from './../../../schemas/article';
import { ARTICLES_VIEW_STATE } from './../../../constants/ViewStates';
import { getFilteredArticles } from './../../../selectors/articles';
import { loadEntities } from './../../../actions/entity';
import { ArticlesTable, getSelectedArticles } from './ArticlesTable';

const inlineStyles = {
  topButton: {
    disable: 'inline-block',
    margin: '110px 40px 30px 70px',
  },
  bottomButton: {
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

  componentWillMount() {
    this.props.loadEntities({ href: '/bookmarks', type: ARTICLES_VIEW_STATE, schema: arrayOf(articleSchema) });
  }

  onRowSelection(selectedRows) {
    this.setState({ selectedRows });
  }

  bind() {
    this.handleOnExport = this.handleOnExport.bind(this);
    this.handleOnImport = this.handleOnImport.bind(this);
    this.onRowSelection = this.onRowSelection.bind(this);
  }

  handleOnImport() {
  }

  handleOnExport() {
    const tempLink = document.createElement('a');
    const newArticles = getSelectedArticles(this.props.articles, this.state.selectedRows);
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

  handleOnFileUploadChange(event) {
    const file = event.target.files[0];
    const fr = new FileReader();

    fr.onload = (e) => { // eslint-disable-line
      const res = e.target.result;

      if (isJsonString(res) && Array.isArray(JSON.parse(res))) {
        this.setState({ data: JSON.parse(res) });
      } else {
        this.setState({ openModal: true });
      }
    };

    fr.readAsText(file);
  }

  render() {
    console.log('•••');
    console.log(JSON.stringify(this.state.selectedRows, null, 2)); // eslint-disable-line
    console.log('•••');

    return (
      <div>
        <div style={inlineStyles.buttons}>
          <div style={inlineStyles.topButton}>
            <RaisedButton
              id={'export-button'}
              label={'export'}
              primary
              onClick={this.handleOnExport}
            />
          </div>
          <div style={inlineStyles.bottomButton}>
            <RaisedButton
              containerElement="label"
              id={'import-button'}
              label={'import'}
              labelPosition="before"
              primary
            >
              <input
                accept=".json"
                id="upload"
                style={inlineStyles.input}
                type="file"
                onChange={this.handleOnFileUploadChange}
              />
            </RaisedButton>
          </div>
        </div>
        <div style={inlineStyles.table}>
          <ArticlesTable
            articles={this.props.articles}
            handleOnRowSelection={this.onRowSelection}
            selectedRows={this.state.selectedRows}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  articles: getFilteredArticles(state),
});

export default connect(mapStateToProps, { loadEntities })(ExportPage);
