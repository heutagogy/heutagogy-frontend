/* eslint-disable fp/no-mutation */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import pureRender from 'pure-render-decorator';
import Radium from 'radium';
import moment from 'moment';
import { arrayOf } from 'normalizr';
import { Paper, RaisedButton } from 'material-ui';

import ViewStateWrapper from './../../../components/ViewStateWrapper';

import { ARTICLES_VIEW_STATE } from './../../../constants/ViewStates';
import { loadEntities } from './../../../actions/entity';
import { getFilteredArticles } from './../../../selectors/articles';
import { getViewState } from './../../../selectors/view';
import articleSchema from './../../../schemas/article';

const inlineStyles = {
  articles: {
    display: 'flex',
  },
  articleCard: {
    height: 140,
    width: 250,
    margin: 10,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
  },
  articleField: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 15px 0 15px',
    width: 220,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  buttonsContainer: {
    margin: '0 0 0 60px',
  },
  buttons: {
    margin: '70px 25px',
  },
};

@Radium
@pureRender
class ArticlesPage extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    loadEntities: PropTypes.func,
    viewState: PropTypes.instanceOf(Immutable.Map),
  }

  componentWillMount() {
    this.props.loadEntities({ href: '/bookmarks', type: ARTICLES_VIEW_STATE, schema: arrayOf(articleSchema) });
  }

  truncateTitle(title) {
    const start = 0;
    const end = 25;

    if (title.length > end) {
      return `${title.substring(start, end)}...`;
    }

    return title;
  }

  handleOpenImport() {
    window.location = '/import';
  }

  handleOpenExport() {
    window.location = '/export';
  }

  renderArticles() {
    return this.props.articles.map((article) => (
      <Paper
        key={article.get('id')}
        style={inlineStyles.articleCard}
      >
        <div style={inlineStyles.articleField}>
          <div>{'Title:'}</div>
          <div>{this.truncateTitle(article.get('title'))}</div>
        </div>
        <div style={inlineStyles.articleField}>
          <div>{'Date:'}</div>
          <div>{moment(article.get('timestamp')).format('ll')}</div>
        </div>
        <div style={inlineStyles.cardFooter}>
          <RaisedButton
            href={article.get('url')}
            label="Open article"
            secondary
            target="_blank"
          />
        </div>
      </Paper>
    ));
  }

  render() {
    return (
      <div>
        <ViewStateWrapper viewState={this.props.viewState}>
          <div style={inlineStyles.articles}>
            {this.renderArticles()}
          </div>
        </ViewStateWrapper>
        <div style={inlineStyles.buttonsContainer} >
          <RaisedButton
            label={'import page'}
            primary
            style={inlineStyles.buttons}
            onClick={this.handleOpenImport}
          />
          <RaisedButton
            label={'export page'}
            primary
            style={inlineStyles.buttons}
            onClick={this.handleOpenExport}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  articles: getFilteredArticles(state),
  viewState: getViewState(state, ARTICLES_VIEW_STATE),
});

export default connect(mapStateToProps, { loadEntities })(ArticlesPage);
