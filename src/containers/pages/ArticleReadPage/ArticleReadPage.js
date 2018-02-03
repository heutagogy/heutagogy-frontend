/* eslint-disable react/no-danger */
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Immutable from 'immutable';

import { getArticles } from './../../../selectors/articles';

import { loadContent } from './../../../actions/entity';


const mapStateToProps = (state, ownProps) => {
  const articleId = ownProps.params.articleId;

  return {
    article: getArticles(state).get(articleId),
  };
};

class ArticleReadPage extends Component {
  static propTypes = {
    article: PropTypes.instanceOf(Immutable.Map),
    loadContent: PropTypes.func,
    params: PropTypes.object,
  };

  componentDidMount() {
    this.props.loadContent(this.props.params.articleId);
  }

  render() {
    if (!this.props.article) {
      return <div>{'no'}</div>;
    }

    return (
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <style type="text/css">
                body {
                  margin: 40px auto;
                  max-width: 650px;
                  line-height: 1.6;
                  font-size: 18px;
                  color: #444;
                  padding: 0 10px
                }
                h1,h2,h3 {
                  line-height: 1.2
                }
                img {
                  max-width: 100%;
                  height: auto;
                }
              </style>
              ${this.props.article.getIn(['content', 'html'])}`,
          }}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, { loadContent })(ArticleReadPage);
