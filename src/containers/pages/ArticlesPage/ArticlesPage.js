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
import { ARTICLES_VIEW_STATE } from './../../../constants/ViewStates';
import { ZERO, ONE } from './../../../constants/Constants';
import { ArticlesTable, getSelectedArticles } from './../../../components/ArticlesTable/ArticlesTable';
import { getArticles } from './../../../selectors/articles';
import { getViewState } from './../../../selectors/view';
import { getLinkHeader } from './../../../selectors/linkHeader';
import { loadEntities } from './../../../actions/entity';


const MAX_PER_PAGE = 1000;

export class ArticlesPage extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    linkHeader: PropTypes.instanceOf(Immutable.Map),
    loadEntities: PropTypes.func,
    loadingArticlesStatus: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);

    ['handleOnExport',
      'onRowSelection',
      'handleOnPageChange',
      'loadAllArticlesFromServer',
    ].forEach((method) => { this[method] = this[method].bind(this); });

    this.state = {
      currentArticles: Immutable.fromJS([]),
      pageSize: 30,
      selectedRows: [],
      total: 1,
    };
  }

  componentWillMount() {
    this.props.loadEntities({
      href: `/bookmarks?per_page=${this.state.pageSize}`,
      type: ARTICLES_VIEW_STATE,
      schema: arrayOf(articleSchema),
    }).then(() => {
      this.setState({ currentArticles: this.props.articles });
      this.loadAllArticlesFromServer(this.props.linkHeader.get('last'));
    });
  }

  componentDidMount() {
    window.addEventListener('export', this.handleOnExport);
  }

  onRowSelection(selectedRows) {
    this.setState({ selectedRows });
  }

  loadAllArticlesFromServer(last) {
    if (!last) {
      return;
    }

    const total = parseInt(last.get('per_page'), 10) * parseInt(last.get('page'), 10);

    this.setState({ total });

    const numberOfRequests = Math.ceil(total / MAX_PER_PAGE);
    const perPage = Math.min(total, MAX_PER_PAGE);

    [...Array(numberOfRequests).keys()].reduce((seq, i) => {
      const page = i + ONE;

      return seq.then(() => this.props.loadEntities({
        href: `/bookmarks?per_page=${perPage}&page=${page}`,
        type: ARTICLES_VIEW_STATE,
        schema: arrayOf(articleSchema),
        resetState: page === ONE,
      }));
    }, Promise.resolve()).then(
      () => console.log('ArticlesPage: all articles are loaded.'),
      (e) => console.log('ArticlesPage: ', e),
    );
  }

  handleOnExport() {
    const tempLink = document.createElement('a');
    const newArticles = getSelectedArticles(this.state.currentArticles, this.state.selectedRows);
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

    // unselect all (only works if you selected each row separately, see https://github.com/callemall/material-ui/issues/3074)
    this.setState({ selectedRows: [] });
  }

  handleOnPageChange(selectedPage) {
    setTimeout(() => this.setState((prevState, props) => {
      const lastCurrentPageIndex = selectedPage * prevState.pageSize;

      return { currentArticles: props.articles.slice(lastCurrentPageIndex - prevState.pageSize, lastCurrentPageIndex) };
    }), ZERO);
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
            articles={this.state.currentArticles}
            handleOnRowSelection={this.onRowSelection}
            selectedRows={this.state.selectedRows}
          />
          {this.renderStatus()}
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
});

export default connect(mapStateToProps, { loadEntities })(ArticlesPage);
