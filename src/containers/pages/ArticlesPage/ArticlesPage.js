import Immutable from 'immutable';
import { Component, PropTypes } from 'react';
import { arrayOf } from 'normalizr';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import Pagination from 'rc-pagination';
import en from 'rc-pagination/lib/locale/en_US';

import 'rc-pagination/assets/index.css';
import './ArticlePage.css'; // should be placed after rc-pagination/assets/index.css

import articleSchema from './../../../schemas/article';
import styles from './ArticlesPage.less';
import { ARTICLES_VIEW_STATE } from './../../../constants/ViewStates';
import { ZERO } from './../../../constants/Constants';
import { ArticlesTable, getSelectedArticles } from './../../../components/ArticlesTable/ArticlesTable';
import { getFilteredArticles } from './../../../selectors/articles';
import { getViewState } from './../../../selectors/view';
import { getLinkHeader } from './../../../selectors/linkHeader';
import { loadEntities } from './../../../actions/entity';


export class ArticlesPage extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    linkHeader: PropTypes.instanceOf(Immutable.Map),
    loadEntities: PropTypes.func,
    loadingArticlesStatus: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);

    this.bind();

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
      const last = this.props.linkHeader.get('last');

      if (last.isEmpty()) {
        return;
      }

      const total = parseInt(last.get('per_page'), 10) * parseInt(last.get('page'), 10);

      this.setState({ total });
      this.setState({ currentArticles: this.props.articles });

      this.props.loadEntities({
        href: `/bookmarks?per_page=${total}`,
        type: ARTICLES_VIEW_STATE,
        schema: arrayOf(articleSchema),
      });
    });
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
    this.handleOnPageChange = this.handleOnPageChange.bind(this);
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
    const lastCurrentPageIndex = selectedPage * this.state.pageSize;

    const currentArticles = this.props.articles.slice(lastCurrentPageIndex - this.state.pageSize, lastCurrentPageIndex);

    setTimeout(() => {
      this.setState({ currentArticles });
    }, ZERO);
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
          <div className={styles.pagination}>
            <Pagination
              locale={en}
              pageSize={this.state.pageSize}
              total={this.state.total}
              onChange={this.handleOnPageChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  articles: getFilteredArticles(state),
  linkHeader: getLinkHeader(state),
  loadingArticlesStatus: getViewState(state, ARTICLES_VIEW_STATE),
});

export default connect(mapStateToProps, { loadEntities })(ArticlesPage);
