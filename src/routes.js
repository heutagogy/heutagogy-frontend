import { Route, IndexRedirect } from 'react-router';

import App from './containers/App';
import AuthenticationPage from './containers/pages/AuthenticationPage';
import { userIsAuthenticated } from './utils/authWrappers';
import ArticlesPage from './containers/pages/ArticlesPage';
import ArticleReadPage from './containers/pages/ArticleReadPage';
import NotFound from './components/NotFound';

export default (
  <Route
    component={App}
    path="/"
  >
    <IndexRedirect to="/articles" />
    <Route
      component={userIsAuthenticated(ArticlesPage)}
      exact
      path="/articles"
    />
    <Route
      component={userIsAuthenticated(ArticleReadPage)}
      path="/articles/:articleId"
    />
    <Route
      component={AuthenticationPage}
      exact
      path="/login"
    />
    <Route
      component={NotFound}
      path="*"
    />
  </Route>
);
