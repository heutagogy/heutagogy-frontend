/* eslint-disable react/jsx-key */
import { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import { arrayOf } from 'normalizr';

import FlatButton from './../Fields/FlatButton';
import { ArticlesTable, getSelectedArticles } from './../ArticlesTable/ArticlesTable';
import { getArticles } from './../../selectors/articles';
import { getViewState } from './../../selectors/view';
import { getLinkHeader } from './../../selectors/linkHeader';
import { loadEntities } from './../../actions/entity';
import { ARTICLES_VIEW_STATE } from './../../constants/ViewStates';
import articleSchema from './../../schemas/article';
import { ONE, TWO } from './../../constants/Constants';
import styles from './ExportModal.less';


const inlineStyles = {
  titleStyle: {
    textAlign: 'center',
    padding: '15px',
  },
  submit: {
    float: 'left',
    margin: '0 10px',
  },
  close: {
    margin: '0 10px',
  },
};

const MAX_PER_PAGE = 1000;

export class ExportModal extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    linkHeader: PropTypes.instanceOf(Immutable.Map),
    loadEntities: PropTypes.func,
    loadingArticlesStatus: PropTypes.instanceOf(Immutable.Map),
    unmount: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.bind();

    this.state = { selectedRows: [] };
  }

  componentWillMount() {
    this.props.loadEntities({
      href: '/bookmarks?per_page=100',
      type: ARTICLES_VIEW_STATE,
      schema: arrayOf(articleSchema),
    }).then(() => {
      this.loadAllArticlesFromServer(this.props.linkHeader.get('last'));
    });
  }

  onRowSelection(selectedRows) {
    this.setState({ selectedRows });
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

  bind() {
    this.onRowSelection = this.onRowSelection.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const tempLink = document.createElement('a');
    const newArticles = getSelectedArticles(this.props.articles, this.state.selectedRows);
    const content = encodeURIComponent(JSON.stringify(newArticles, null, TWO));

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

  handleClose() {
    this.props.unmount();
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
    const actions = [
      <FlatButton
        disabled={this.props.articles.isEmpty()}
        label={'Save'}
        primary
        style={inlineStyles.submit}
        onTouchTap={this.handleSubmit}
      />,
      <FlatButton
        label={'Cancel'}
        primary
        style={inlineStyles.close}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          actions={actions}
          autoScrollBodyContent
          bodyStyle={{ padding: 0, backgroundColor: '#eee' }}
          modal={false}
          open
          title={'Export Articles'}
          titleStyle={inlineStyles.titleStyle}
          onRequestClose={this.handleClose}
        >
          <div className={styles.table}>
            <ArticlesTable
              articles={this.props.articles}
              handleOnRowSelection={this.onRowSelection}
              id={'exporting-table'}
              selectable
              selectedRows={this.state.selectedRows}
            />
            { this.renderStatus() }
          </div>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  articles: getArticles(state),
  linkHeader: getLinkHeader(state),
  loadingArticlesStatus: getViewState(state, ARTICLES_VIEW_STATE),
});

export default connect(mapStateToProps, { loadEntities })(ExportModal);
