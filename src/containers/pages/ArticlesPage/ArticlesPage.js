import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import pureRender from 'pure-render-decorator';

import { ARTICLES_VIEW_STATE } from './../../../constants/ViewStates';
import { loadEntities } from './../../../actions/entity';
import { getFilteredArticles } from './../../../selectors/articles';

@pureRender
class ArticlesPage extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    loadEntities: PropTypes.func,
  }

  static contextTypes = {
    i18n: PropTypes.object,
  }

  componentWillMount() {
    this.props.loadEntities({ href: '/articles', type: ARTICLES_VIEW_STATE });
  }

  renderArticles() {
    return this.props.articles.map((app) => <div key={app.get('name')}>{app.get('name')}</div>);
  }

  render() {
    const { l } = this.context.i18n;

    return (
      <div>
        {l('Articles page')}
        {this.renderArticles()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  articles: getFilteredArticles(state),
});

export default connect(mapStateToProps, { loadEntities })(ArticlesPage);
