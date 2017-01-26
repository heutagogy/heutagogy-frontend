import { Route, IndexRedirect } from 'react-router';

import App from './containers/App';
import AuthenticationPage from './containers/pages/AuthenticationPage';
import { userIsAuthenticated } from './utils/authWrappers';
import ExportPage from './containers/pages/ExportPage';

export default (
  <Route
    component={App}
    path="/"
  >
    <IndexRedirect to="/articles" />
    <Route
      component={userIsAuthenticated(ExportPage)}
      path="/articles"
    />
    <Route
      component={AuthenticationPage}
      path="/login"
    />
  </Route>
);
