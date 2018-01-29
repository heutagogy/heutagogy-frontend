import { Component, PropTypes } from 'react';

import Dialog, { DialogContent, DialogTitle, withMobileDialog } from 'material-ui-next/Dialog';

import PureRender from 'pure-render-decorator';

import Button from 'material-ui-next/Button';
import TextField from 'material-ui-next/TextField';
import Typography from 'material-ui-next/Typography';

import heutagogyLogo from '../../../../heutagogy.png';

@PureRender
class LoginForm extends Component {
  static propTypes = {
    fullScreen: PropTypes.bool,
    onGoogleSignIn: PropTypes.func,
    onLogin: PropTypes.func,
  };

  static defaultProps = {
    fullScreen: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
    };
  }

  componentDidMount = () => {
    if (this.props.onGoogleSignIn) {
      // eslint-disable-next-line no-undef
      gapi.signin2.render('my-signin2', {
        scope: 'profile email',
        longtitle: true,
        theme: 'dark',
        onsuccess: this.handleGoogleSuccess,
        onfailure: this.handleGoogleFailure,
      });
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  catchEnter = (f) => (e) => {
    if (e.key === 'Enter') {
      f(e);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.onLogin({ login: this.state.login, password: this.state.password });
  }

  handleGoogleSuccess = (googleUser) => {
    this.props.onGoogleSignIn({ googleUser });
  };

  handleGoogleFailure = (response) => {
    // eslint-disable-next-line no-console
    console.log('Gooogle SignIn Failure:', response);
  };

  render() {
    return (
      <form
        id="login"
        onSubmit={this.handleSubmit}
      >
        <Dialog
          fullScreen={this.props.fullScreen}
          open
        >
          <DialogTitle>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                alt=""
                src={heutagogyLogo}
                style={{ maxWidth: 50, margin: 10 }}
              />
              {'Heutagogy'}
            </div>
          </DialogTitle>
          <DialogContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: 300,
            }}
          >
            <TextField
              form="login"
              fullWidth
              inputProps={{
                label: 'Login',
              }}
              label="Login"
              margin="dense"
              name="login"
              value={this.state.login}
              onChange={this.handleChange}
            />
            <TextField
              form="login"
              fullWidth
              inputProps={{
                label: 'Password',
              }}
              label="Password"
              margin="dense"
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
              onKeyPress={this.catchEnter(this.handleSubmit)}
            />

            <Typography align="center">
              {"Don't have an account? "}
              <a
                href="https://heutagogy.herokuapp.com/user/register"
                rel="noopener"
                target="_blank"
              >
                {'Sign up'}
              </a>
            </Typography>

            <Button
              color="primary"
              form="login"
              raised
              style={{ margin: 30 }}
              type="submit"
            >
              {'Log in'}
            </Button>
            <div id="my-signin2" />
          </DialogContent>
        </Dialog>
      </form>
    );
  }
}

export default withMobileDialog({ breakpoint: 'xs' })(LoginForm);
