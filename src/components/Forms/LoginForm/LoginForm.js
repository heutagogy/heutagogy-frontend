/* eslint-disable */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import PureRender from 'pure-render-decorator';
import { reduxForm, Field } from 'redux-form/immutable';
import { renderTextField } from './../renders';
import { blue500 } from 'material-ui/styles/colors';
import RaisedButton from './../../Fields/RaisedButton';

import { getViewState } from './../../../selectors/view';
import { LOGIN_VIEW_STATE } from './../../../constants/ViewStates';

import { loginUser } from './../../../actions/users';
import { setServerAddress } from './../../../actions/server';

import styles from './LoginForm.less';

const inlineStyles = {
  input: {
    backgroundColor: '#fafafa',
  },
  floatingLabelStyle: {
    fontSize: '18px',
  },
  blue500: {
    color: blue500,
  },
  title: {
    fontFamily: 'Ubuntu, sans-serif',
    textAlign: 'center',
    margin: '7px 0 35px 0',
  },
}

@PureRender
class LoginForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func, // from redux-form
    loginUser: PropTypes.func,
    setServerAddress: PropTypes.func,
    viewState: PropTypes.instanceOf(Immutable.Map),
  }

  static contextTypes = {
    i18n: PropTypes.object,
  }

  submit = (form) => {
    this.props.setServerAddress({ address: form.get('server') });
    this.props.loginUser({ login: form.get('login'), password: form.get('password') });
  }

  render() {
    const { l } = this.context.i18n;

    return (
      <form
        className={styles.loginForm}
        onSubmit={this.props.handleSubmit(this.submit)}
      >
        <div>
          <h2 style={inlineStyles.title}>{'Heutagogy'}</h2>
          <Field
            component={renderTextField}
            floatingLabelFixed
            floatingLabelStyle={inlineStyles.floatingLabelStyle}
            floatingLabelFocusStyle={inlineStyles.blue500}
            floatingLabelText={l('Login')}
            fullWidth
            inputStyle={inlineStyles.input}
            underlineFocusStyle={inlineStyles.blue500}
            name='login'
            placeholder={l('My username')}
          />
          <Field
            component={renderTextField}
            floatingLabelFixed
            floatingLabelStyle={inlineStyles.floatingLabelStyle}
            floatingLabelFocusStyle={inlineStyles.blue500}
            floatingLabelText={l('Password')}
            fullWidth
            inputStyle={inlineStyles.input}
            underlineFocusStyle={inlineStyles.blue500}
            name='password'
            placeholder={l('My secret password')}
            type='password'
          />
          <Field
            component={renderTextField}
            floatingLabelFixed
            floatingLabelStyle={inlineStyles.floatingLabelStyle}
            floatingLabelFocusStyle={inlineStyles.blue500}
            floatingLabelText={l('Server address')}
            fullWidth
            inputStyle={inlineStyles.input}
            underlineFocusStyle={inlineStyles.blue500}
            name='server'
          />
          <RaisedButton
            className={styles.login}
            fullWidth
            label='Login'
            primary
            spinButton={this.props.viewState && this.props.viewState.get('isInProgress')}
            type='submit'
          />
        </div>
      </form>
    );
  }
}

const LoginFormWrapped = reduxForm({ form: 'LoginForm' })(LoginForm);

const mapStateToProps = (state) => ({
  viewState: getViewState(state, LOGIN_VIEW_STATE),
  initialValues: {
    server: state.getIn(['server', 'address']) || 'https://heutagogy.herokuapp.com',
  },
});

export default connect(mapStateToProps, { loginUser, setServerAddress })(LoginFormWrapped);
