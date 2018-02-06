import { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';
import urlParse from 'url-parse';
import { replace } from 'react-router-redux';

import { getAuthenticatedUser } from './../../../selectors/users';
import { getStat } from './../../../selectors/statistic';
import userUtils from './../../../utils/userUtils';
import { loginUser, googleSignIn } from './../../../actions/users';
import { getStatistic } from './../../../actions/statistic';

import LoginForm from './../../../components/Forms/LoginForm';

@pureRender
class AuthenticationPage extends Component {
  static propTypes = {
    getStatistic: PropTypes.func,
    googleSignIn: PropTypes.func,
    loginUser: PropTypes.func,
    replace: PropTypes.func,
    stat: PropTypes.object,
    user: PropTypes.instanceOf(Immutable.Map),
  }

  static redirectIfAuthenticated({ user, replaceUrl }) {
    if (userUtils.isAuthenticated(user)) {
      const url = '/';

      if (typeof window !== 'undefined') {
        const query = urlParse(window.location.href, true).query;

        return replaceUrl(query.redirect || url);
      }

      return replaceUrl(url);
    }

    return null;
  }

  constructor(props) {
    super(props);
    AuthenticationPage.redirectIfAuthenticated({ user: props.user, replaceUrl: props.replace });
  }

  componentWillMount() {
    this.props.getStatistic();
  }

  componentWillReceiveProps(nextProps) {
    AuthenticationPage.redirectIfAuthenticated({ user: nextProps.user, replaceUrl: nextProps.replace });
  }

  render() {
    return (
      <div>
        <LoginForm
          totalRead={this.props.stat.total_read}
          totalRead7days={this.props.stat.total_read_7days}
          // eslint-disable-next-line react/jsx-handler-names
          onGoogleSignIn={this.props.googleSignIn}
          // eslint-disable-next-line react/jsx-handler-names
          onLogin={this.props.loginUser}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: getAuthenticatedUser(state),
  stat: getStat(state),
});

export default connect(mapStateToProps, {
  googleSignIn, loginUser, replace, getStatistic,
})(AuthenticationPage);
