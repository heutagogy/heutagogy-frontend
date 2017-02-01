/* eslint-disable react/jsx-no-bind */

import Immutable from 'immutable';
import { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';

import { getAuthenticatedUser } from './../../selectors/users';
import { logoutUser } from './../../actions/users';
import styles from './HeaderBar.less';
import userUtils from './../../utils/userUtils';

class HeaderBar extends Component {
  static propTypes = {
    logoutUser: PropTypes.func,
    user: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);

    this.bind();

    this.state = { open: false };
  }

  bind() {
    this.handleToggle = this.handleToggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.close = this.close.bind(this);
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  close() {
    this.setState({ open: false });
  }

  handleLogout() {
    this.close();
    this.props.logoutUser();
  }

  handleExport() {
    this.close();
    window.dispatchEvent(new CustomEvent('export'));
  }

  render() {
    return (
      <div>
        { userUtils.isAuthenticated(this.props.user)
        ? <AppBar
          className={styles.headerBar}
          iconElementLeft={<MenuIcon
            color="white"
            style={{ margin: '0 10px 5px 30px' }}
          />}
          iconElementRight={<span />}
          iconStyleLeft={styles.iconClassNameLeft}
          iconStyleRight={{ margin: 0 }}
          title="Heutagogy"
          onLeftIconButtonTouchTap={this.handleToggle}
        /> : null }
        <Drawer
          docked={false}
          open={this.state.open}
          width={250}
          onRequestChange={(open) => this.setState({ open })}
        >
          <MenuItem onTouchTap={this.handleLogout}>{`Logout (${this.props.user.get('login')})`}</MenuItem>
          <MenuItem onTouchTap={this.handleExport}>{'Export selected articles'}</MenuItem>
          <MenuItem>{'Open import modal'}</MenuItem>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: getAuthenticatedUser(state),
});

export default connect(mapStateToProps, { logoutUser })(HeaderBar);
