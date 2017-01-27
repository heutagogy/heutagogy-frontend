import Immutable from 'immutable';
import { Component, PropTypes } from 'react';
import { arrayOf } from 'normalizr';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import ImportModal from './../../../components/ImportModal';
import articleSchema from './../../../schemas/article';
import { ARTICLES_VIEW_STATE } from './../../../constants/ViewStates';
import { ArticlesTable, getSelectedArticles } from './../../../components/ArticlesTable/ArticlesTable';
import { getFilteredArticles } from './../../../selectors/articles';
import { isJsonString } from './../../../utils/jsonUtils';
import { loadEntities } from './../../../actions/entity';
import { logoutUser } from './../../../actions/users';
import { rememberArticles } from './../../../actions/articles';

import styles from './ArticlesPage.less';

const inlineStyles = {
  topButton: {
    disable: 'inline-block',
    margin: '110px 70px 30px 40px',
  },
  button: {
    disable: 'inline-block',
    margin: '30px 70px 30px 40px',
  },
};

export class ArticlesPage extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    loadEntities: PropTypes.func,
    logoutUser: PropTypes.func,
    rememberArticles: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.bind();

    this.state = {
      selectedRows: [],
      articlesToImport: Immutable.fromJS([]),
      openImport: false,
    };
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
    this.handleLogout = this.handleLogout.bind(this);
    this.onRowSelection = this.onRowSelection.bind(this);
    this.unmountImport = this.unmountImport.bind(this);
  }

  handleLogout() {
    this.props.logoutUser();
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

  handleOnImport(event) {
    const file = event.target.files[0];
    const fr = new FileReader();

    fr.onload = (e) => { // eslint-disable-line
      const res = e.target.result;


      if (isJsonString(res) && Array.isArray(JSON.parse(res))) {
        this.setState({ articlesToImport: Immutable.fromJS(JSON.parse(res)) });
      }

      this.setState({ openImport: true });
    };

    fr.readAsText(file);
  }

  unmountImport() {
    this.setState({ openImport: false });
  }

  handleFileUploadClick(event) {
    // allow to select the same file few times in a row.

    event.target.value = null; // eslint-disable-line
  }

  render() {
    return (
      <div>
        <div className={styles.buttons}>
          <div style={inlineStyles.topButton}>
            <RaisedButton
              id={'logout-button'}
              label={'logout'}
              primary
              onClick={this.handleLogout}
            />
          </div>
          <div style={inlineStyles.button}>
            <RaisedButton
              id={'export-button'}
              label={'export'}
              primary
              onClick={this.handleOnExport}
            />
          </div>
          <div style={inlineStyles.button}>
            <RaisedButton
              containerElement="label"
              id={'import-button'}
              label={'import'}
              labelPosition="before"
              primary
            >
              <input
                accept=".json"
                className={styles.input}
                id="upload"
                type="file"
                onChange={this.handleOnImport}
                onClick={this.handleFileUploadClick}
              />
            </RaisedButton>
          </div>
        </div>
        <div>
          { this.state.openImport
            ? <ImportModal
              articles={this.state.articlesToImport}
              loadEntities={this.props.loadEntities}
              rememberArticles={this.props.rememberArticles}
              unmount={this.unmountImport}
            /> : null }
        </div>
        <div className={styles.table}>
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

export default connect(mapStateToProps, { loadEntities, logoutUser, rememberArticles })(ArticlesPage);
