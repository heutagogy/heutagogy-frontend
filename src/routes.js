import { Route, IndexRedirect } from 'react-router';

import App from './containers/App';
import AuthenticationPage from './containers/pages/AuthenticationPage';
import { userIsAuthenticated } from './utils/authWrappers';
import ArticlesPage from './containers/pages/ArticlesPage';

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
