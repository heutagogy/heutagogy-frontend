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
  },
};

const TO_UNIX = 1000;

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

  renderArticles() {
    return this.props.articles.map((article) => (
      <Paper
        key={article.get('id')}
        style={inlineStyles.articleCard}
      >
        <div style={inlineStyles.articleField}>
          <div>{'Title:'}</div>
          <div>{article.get('title')}</div>
        </div>
        <div style={inlineStyles.articleField}>
          <div>{'Date:'}</div>
          <div>{moment.unix(article.get('timestamp') / TO_UNIX).format('MM/DD/YYYY hh:mm')}</div>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  articles: getFilteredArticles(state),
  viewState: getViewState(state, ARTICLES_VIEW_STATE),
});

export default connect(mapStateToProps, { loadEntities })(ArticlesPage);
