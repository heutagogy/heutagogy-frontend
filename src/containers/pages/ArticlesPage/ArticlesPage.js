/* eslint-disable react/jsx-no-bind */

// due to lazy cache
/* eslint-disable react/no-unused-prop-types */

import Immutable from 'immutable';
import { Component, PropTypes } from 'react';
import { schema, denormalize } from 'normalizr';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import Pagination from 'rc-pagination';
import en from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import lazyCache from 'react-lazy-cache';

import { replace } from 'react-router-redux';

import 'rc-pagination/assets/index.css';
import './RcPaginationOverride.css'; // should be placed after rc-pagination/assets/index.css

import articleSchema from './../../../schemas/article';
import styles from './ArticlesPage.less';
import { ARTICLES_VIEW_STATE } from './../../../constants/ViewStates';
import { ZERO, ONE, TWO } from './../../../constants/Constants';
import { ArticlesList } from './../../../components/ArticlesList/ArticlesList';
import { getArticles, getArticlesOrder, getNotes } from './../../../selectors/articles';
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
const localStorageDateOrderingKey = 'heutagogy-date-ordering';

const transformStrToTags = (str) =>
  str.split(' ').map((s) => s.replace(/@/g, ''));

export class ArticlesPage extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.Map),
    articlesOrder: PropTypes.instanceOf(Immutable.List),
    deleteArticle: PropTypes.func,
    linkHeader: PropTypes.instanceOf(Immutable.Map),
    loadEntities: PropTypes.func,
    loadingArticlesStatus: PropTypes.instanceOf(Immutable.Map),
    notes: PropTypes.instanceOf(Immutable.Map),
    replace: PropTypes.func,
    updateArticle: PropTypes.func,
  }

  constructor(props) {
    super(props);

    [
      'handleUpdateInput',
      'onRowSelection',
      'onDateOrderingChange',
      'getCurrentArticles',
      'handleOnPageChange',
      'loadAllArticlesFromServer',
    ].forEach((method) => { this[method] = this[method].bind(this); });

    this.state = {
      dateOrdering: false,
      pageSize: Math.min(MAX_PER_PAGE, 30), // eslint-disable-line
      selectedRows: [],
      selectedPage: 1,
      searchText: '',
    };
  }

  componentWillMount() {
    this.props.loadEntities({
      href: `/bookmarks?per_page=${this.state.pageSize}`,
      type: ARTICLES_VIEW_STATE,
      schema: new schema.Array(articleSchema),
    }).then(() => {
      this.loadAllArticlesFromServer(this.props.linkHeader.get('last'));
    });

    this.setState({
      dateOrdering: localStorage.getItem(localStorageDateOrderingKey) === 'true',
    });

    this.cache = lazyCache(this, {
      denormalizedArticles: {
        params: ['articlesOrder', 'articles', 'notes'],
        fn: (articlesOrder, articles, notes) => (denormalize(
          { articles: articlesOrder },
          { articles: [articleSchema] },
          new Immutable.Map({
            articles,
            notes,
          })).articles),
      },

      tags: {
        params: ['articles'],
        fn: (articles) => (
          articles.
            toList().
            flatMap((a) => a.get('tags')).
            toSet().
            delete(null).
            toList()
        ),
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    this.cache.componentWillReceiveProps(nextProps);
  }

  onRowSelection(selectedRows) {
    this.setState({ selectedRows });
  }

  onDateOrderingChange() {
    const newDateOrderingState = this.state.dateOrdering === false;

    this.setState({
      dateOrdering: newDateOrderingState,
    });

    localStorage.setItem(localStorageDateOrderingKey, newDateOrderingState);
  }

  getCurrentArticles() {
    const articles = this.cache.denormalizedArticles;

    const searchText = this.state.searchText.toLowerCase();
    const tags = transformStrToTags(searchText);

    /* eslint-disable */

    let predicate = (a) => a.get('title').toLowerCase().includes(searchText);

    if (searchText.startsWith('@')) {

      predicate = (a) => tags.every((t1) =>
        (a.get('tags') || []).some((t2) =>
          t2.toLowerCase().includes(t1.toLowerCase())));

    } else if (searchText.startsWith('//')) {

      predicate = (a) => (
        a.get('notes') && a.get('notes').toJS().length > 0
          ? a.get('notes').toJS()[0].text
          : ''
      ).toLowerCase().
        includes(searchText.substring(TWO).toLowerCase());

    }

    /* eslint-enable */

    const filtered = articles.filter(predicate);

    return this.state.dateOrdering === true
      ? filtered.sort((a, b) =>
        moment(b.get('timestamp')) - moment(a.get('timestamp'))
      )
      : filtered;
  }

  handleUpdateInput = (searchText) => {
    this.setState({
      searchText,
    });
  };

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
        schema: new schema.Array(articleSchema),
        resetState: page === ONE,
      }));
    }, Promise.resolve());
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
    const matchingArticles = this.getCurrentArticles();
    const totalArticles = matchingArticles.size;
    const lastCurrentPageIndex = this.state.selectedPage * this.state.pageSize;
    const articles = matchingArticles.slice(lastCurrentPageIndex - this.state.pageSize, lastCurrentPageIndex);

    return (
      <div>
        <HeaderBar
          autoCompleteDataSource={this.cache.tags}
          dateOrdering={this.state.dateOrdering}
          handleDateOrderingChange={this.onDateOrderingChange}
          searchText={this.state.searchText}
          onUpdateInput={this.handleUpdateInput}
        />
        <div style={inlineStyles.routerContainer}>
          <ArticlesList
            allArticles={this.props.articles}
            articles={articles}
            onDeleteArticle={(articleId) => this.props.deleteArticle(articleId)}
            onReadCached={(articleId) => this.props.replace(`/articles/${articleId}`)}
            onUpdateArticle={(articleId, update) => this.props.updateArticle(articleId, update)}
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
    );
  }
}
const mapStateToProps = (state) => ({
  articles: getArticles(state),
  notes: getNotes(state),
  articlesOrder: getArticlesOrder(state),
  linkHeader: getLinkHeader(state),
  loadingArticlesStatus: getViewState(state, ARTICLES_VIEW_STATE),
});

export default connect(mapStateToProps, { loadEntities, updateArticle, deleteArticle, replace })(ArticlesPage);
