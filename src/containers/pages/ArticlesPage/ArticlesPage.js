/* eslint-disable */

import Immutable from 'immutable';
import { Component, PropTypes } from 'react';
import { arrayOf } from 'normalizr';
import { connect } from 'react-redux';

import articleSchema from './../../../schemas/article';
import { ARTICLES_VIEW_STATE } from './../../../constants/ViewStates';
import { ArticlesTable, getSelectedArticles } from './../../../components/ArticlesTable/ArticlesTable';
import { getFilteredArticles } from './../../../selectors/articles';
import { loadEntities } from './../../../actions/entity';
import styles from './ArticlesPage.less';


export class ArticlesPage extends Component {
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
    this.props.loadEntities({ href: '/bookmarks?per_page=200', type: ARTICLES_VIEW_STATE, schema: arrayOf(articleSchema) });
  }

  componentDidMount() {
    window.addEventListener('export', this.handleOnExport);
  }

  onRowSelection(selectedRows) {
    this.setState({ selectedRows });
  }

  bind() {
    this.handleOnExport = this.handleOnExport.bind(this);
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

  render() {
    return (
      <div>
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

export default connect(mapStateToProps, { loadEntities })(ArticlesPage);
