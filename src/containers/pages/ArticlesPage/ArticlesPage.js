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
import { updateArticle } from './../../../actions/articles';


const MAX_PER_PAGE = 1000;

export class ArticlesPage extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    linkHeader: PropTypes.instanceOf(Immutable.Map),
    loadEntities: PropTypes.func,
    loadingArticlesStatus: PropTypes.instanceOf(Immutable.Map),
    updateArticle: PropTypes.func,
    updateArticleState: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);

    ['handleOnExport',
      'onRowSelection',
      'getCurrentArticles',
      'handleOnPageChange',
      'loadAllArticlesFromServer',
    ].forEach((method) => { this[method] = this[method].bind(this); });

    this.state = {
      pageSize: Math.min(MAX_PER_PAGE, 30), // eslint-disable-line
      selectedRows: [],
      selectedPage: null,
      total: 1,
    };
  }

  componentWillMount() {
    this.props.loadEntities({
      href: `/bookmarks?per_page=${this.state.pageSize}`,
      type: ARTICLES_VIEW_STATE,
      schema: arrayOf(articleSchema),
    }).then(() => {
      this.setState({ selectedPage: ONE });
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
    if (this.state.selectedPage === null) {
      return this.props.articles;
    }

    const lastCurrentPageIndex = this.state.selectedPage * this.state.pageSize;

    return this.props.articles.slice(lastCurrentPageIndex - this.state.pageSize, lastCurrentPageIndex);
  }

  loadAllArticlesFromServer(last) {
    if (!last) {
      return;
    }

    const pageLast = parseInt(last.get('page'), 10);
    const perPageLast = parseInt(last.get('per_page'), 10);
    const total = pageLast * perPageLast;

    this.setState({ total });

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
    setTimeout(() => this.setState({ selectedPage }), ZERO);
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
    return (
      <div>
        <div className={styles.table}>
          <ArticlesTable
            articles={this.getCurrentArticles()}
            handleOnRowSelection={this.onRowSelection}
            selectedRows={this.state.selectedRows}
            updateArticle={this.props.updateArticle}
            updateArticleState={this.props.updateArticleState}
          />
          { this.renderStatus() }
          { this.state.total > ONE
          ? <div className={styles.pagination}>
            <Pagination
              locale={en}
              pageSize={this.state.pageSize}
              total={this.state.total}
              onChange={this.handleOnPageChange}
            />
          </div> : null }
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

export default connect(mapStateToProps, { loadEntities, updateArticle })(ArticlesPage);
