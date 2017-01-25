import Immutable from 'immutable';
import { Component, PropTypes } from 'react';
import { arrayOf } from 'normalizr';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import { isJsonString } from './../../../utils/jsonUtils';
import articleSchema from './../../../schemas/article';
import { ARTICLES_VIEW_STATE } from './../../../constants/ViewStates';
import { getFilteredArticles } from './../../../selectors/articles';
import { loadEntities } from './../../../actions/entity';
import { ArticlesTable, getSelectedArticles } from './ArticlesTable';
import { ImportModal } from './ImportModal';

import styles from './ExportPage.less';

const inlineStyles = {
  topButton: {
    disable: 'inline-block',
    margin: '110px 70px 30px 40px',
  },
  bottomButton: {
    disable: 'inline-block',
    margin: '30px 70px 30px 40px',
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

    this.state = {
      selectedRows: [],
      articlesToImport: Immutable.fromJS([]),
      importModalIsOpened: false,
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
    this.onRowSelection = this.onRowSelection.bind(this);
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

      this.setState({ importModalIsOpened: true });
    };

    fr.readAsText(file);
  }

  render() {
    return (
      <div>
        <div className={styles.buttons}>
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
                className={styles.input}
                id="upload"
                type="file"
                onChange={this.handleOnImport}
              />
            </RaisedButton>
          </div>
        </div>
        <div>
          <ImportModal
            articles={this.state.articlesToImport}
            open={this.state.importModalIsOpened}
          />
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

export default connect(mapStateToProps, { loadEntities })(ExportPage);
