import { Route, IndexRedirect } from 'react-router';

import App from './containers/App';
import ArticlesPage from './containers/pages/ArticlesPage';
import AuthenticationPage from './containers/pages/AuthenticationPage';
import { userIsAuthenticated } from './utils/authWrappers.js';

export default (
  <Route
    component={App}
    path="/"
  >
    <IndexRedirect to="/articles" />
    <Route
      component={userIsAuthenticated(ArticlesPage)}
      path="/articles"
    />
    <Route
      component={AuthenticationPage}
      path="/login"
    />
  </Route>
);
