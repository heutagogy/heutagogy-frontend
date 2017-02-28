import Immutable from 'immutable';
import { Component, PropTypes } from 'react';
import { arrayOf } from 'normalizr';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import Pagination from 'rc-pagination';
import en from 'rc-pagination/lib/locale/en_US';

import 'rc-pagination/assets/index.css';
import './RcPaginationOverride.css'; // should be placed after rc-pagination/assets/index.css

import articleSchema from './../../../schemas/article';
import styles from './ArticlesPage.less';
import { ARTICLES_VIEW_STATE, UPDATE_ARTICLE_VIEW_STATE } from './../../../constants/ViewStates';
import { ZERO, ONE } from './../../../constants/Constants';
import { ArticlesTable, getSelectedArticles } from './../../../components/ArticlesTable/ArticlesTable';
import { getArticles } from './../../../selectors/articles';
import { getViewState } from './../../../selectors/view';
import { getLinkHeader } from './../../../selectors/linkHeader';
import { loadEntities } from './../../../actions/entity';
import { updateArticle, deleteArticle } from './../../../actions/articles';
import HeaderBar from '../../HeaderBar';


const inlineStyles = {
  routerContainer: {
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'auto',
  },
};

const MAX_PER_PAGE = 1000;

export class ArticlesPage extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    deleteArticle: PropTypes.func,
    linkHeader: PropTypes.instanceOf(Immutable.Map),
    loadEntities: PropTypes.func,
    loadingArticlesStatus: PropTypes.instanceOf(Immutable.Map),
    updateArticle: PropTypes.func,
    updateArticleState: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);

    [
      'handleSearchChanged',
      'handleOnExport',
      'onRowSelection',
      'getCurrentArticles',
      'handleOnPageChange',
      'loadAllArticlesFromServer',
    ].forEach((method) => { this[method] = this[method].bind(this); });

    this.state = {
      pageSize: Math.min(MAX_PER_PAGE, 30), // eslint-disable-line
      selectedRows: [],
      selectedPage: 1,
      search: '',
    };
  }

  componentWillMount() {
    this.props.loadEntities({
      href: `/bookmarks?per_page=${this.state.pageSize}`,
      type: ARTICLES_VIEW_STATE,
      schema: arrayOf(articleSchema),
    }).then(() => {
      this.loadAllArticlesFromServer(this.props.linkHeader.get('last'));
    });
  }

  componentDidMount() {
    window.addEventListener('export', this.handleOnExport);
  }

  onRowSelection(selectedRows) {
    this.setState({ selectedRows });
  }

  getCurrentArticles() {
    const search = this.state.search.toLowerCase();

    return this.props.articles.filter((x) => x.get('title').toLowerCase().includes(search));
  }

  handleSearchChanged(e, search) {
    this.setState({
      search,
    });
  }

  loadAllArticlesFromServer(last) {
    if (!last) {
      return;
    }

    const pageLast = parseInt(last.get('page'), 10);
    const perPageLast = parseInt(last.get('per_page'), 10);
    const total = pageLast * perPageLast;
    const perPage = Math.trunc(Math.min(MAX_PER_PAGE, total) / perPageLast) * perPageLast;
    const numberOfRequests = Math.ceil(total / perPage);

    [...Array(numberOfRequests).keys()].reduce((seq, i) => {
      const page = i + ONE;

      return seq.then(() => this.props.loadEntities({
        href: `/bookmarks?per_page=${perPage}&page=${page}`,
        type: ARTICLES_VIEW_STATE,
        schema: arrayOf(articleSchema),
        resetState: page === ONE,
      }));
    }, Promise.resolve());
  }

  handleOnExport() {
    const tempLink = document.createElement('a');
    const newArticles = getSelectedArticles(this.getCurrentArticles(), this.state.selectedRows);
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
  }

  handleOnPageChange(selectedPage) {
    this.setState({ selectedPage });
  }

  renderStatus() {
    return (
      <div>
        { this.props.loadingArticlesStatus && this.props.loadingArticlesStatus.get('isInProgress')
          ? <div className={styles.linearProgress}>
            <div style={{ margin: 10 }}>{'Loading articles...'}</div>
            <LinearProgress mode="indeterminate" />
          </div> : null }
        { this.props.loadingArticlesStatus && this.props.loadingArticlesStatus.get('isFailed')
          ? <div className={styles.errorMessage}><i>{this.props.loadingArticlesStatus.get('message')}</i></div> : null }
      </div>
    );
  }

  render() {
    // TODO(rasendubi): leverage caching
    const allArticles = this.getCurrentArticles();
    const totalArticles = allArticles.size;
    const lastCurrentPageIndex = this.state.selectedPage * this.state.pageSize;
    const articles = allArticles.slice(lastCurrentPageIndex - this.state.pageSize, lastCurrentPageIndex);

    return (
      <div>
        <HeaderBar onSearchChanged={this.handleSearchChanged} />
        <div style={inlineStyles.routerContainer}>
          <div className={styles.table}>
            <ArticlesTable
              articles={articles}
              deleteArticle={this.props.deleteArticle}
              handleOnRowSelection={this.onRowSelection}
              selectedRows={this.state.selectedRows}
              updateArticle={this.props.updateArticle}
              updateArticleState={this.props.updateArticleState}
            />
            { this.renderStatus() }
            { totalArticles > ZERO
              ? <div className={styles.pagination}>
                <Pagination
                  current={this.state.selectedPage}
                  locale={en}
                  pageSize={this.state.pageSize}
                  total={totalArticles}
                  onChange={this.handleOnPageChange}
                />
              </div> : null }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  articles: getArticles(state),
  linkHeader: getLinkHeader(state),
  loadingArticlesStatus: getViewState(state, ARTICLES_VIEW_STATE),
  updateArticleState: getViewState(state, UPDATE_ARTICLE_VIEW_STATE),
});

export default connect(mapStateToProps, { loadEntities, updateArticle, deleteArticle })(ArticlesPage);
