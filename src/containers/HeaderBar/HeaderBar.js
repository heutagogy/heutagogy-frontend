/* eslint-disable react/jsx-no-bind */

import Immutable from 'immutable';
import { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';

import ImportModal from './../../components/ImportModal';
import { getAuthenticatedUser } from './../../selectors/users';
import { logoutUser } from './../../actions/users';
import styles from './HeaderBar.less';
import userUtils from './../../utils/userUtils';
import { rememberArticles } from './../../actions/articles';
import { isJsonString } from './../../utils/jsonUtils';


class HeaderBar extends Component {
  static propTypes = {
    logoutUser: PropTypes.func,
    rememberArticles: PropTypes.func,
    user: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);

    this.bind();

    this.state = {
      articlesToImport: Immutable.fromJS([]),
      openImport: false,
      openMenu: false,
      selectedRows: [],
    };
  }

  bind() {
    this.close = this.close.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.handleFileUploadClick = this.handleFileUploadClick.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleOnImport = this.handleOnImport.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.unmountImport = this.unmountImport.bind(this);
  }

  handleToggle() {
    this.setState({ openMenu: !this.state.openMenu });
  }

  close() {
    this.setState({ openMenu: false });
  }

  handleLogout() {
    this.close();
    this.props.logoutUser();
  }

  handleExport() {
    this.close();
    window.dispatchEvent(new CustomEvent('export'));
  }

  handleOnImport(event) {
    const file = event.target.files[0];
    const fr = new FileReader();

    fr.onload = (e) => { // eslint-disable-line
      const res = e.target.result;


      if (isJsonString(res) && Array.isArray(JSON.parse(res))) {
        this.setState({ articlesToImport: Immutable.fromJS(JSON.parse(res)) });
      }

      this.setState({ openImport: true });
    };

    fr.readAsText(file);
  }

  unmountImport() {
    this.setState({ openImport: false });
  }

  handleFileUploadClick(event) {
    this.close();

    // allow to select the same file few times in a row.
    event.target.value = null; // eslint-disable-line
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
          open={this.state.openMenu}
          width={250}
          onRequestChange={(openMenu) => this.setState({ openMenu })}
        >
          <MenuItem onTouchTap={this.handleExport}>{'Export selected articles'}</MenuItem>
          <MenuItem>
            {'Open import modal'}
            <input
              accept=".json"
              className={styles.input}
              id="upload"
              type="file"
              onChange={this.handleOnImport}
              onClick={this.handleFileUploadClick}
            />
          </MenuItem>
          <Divider />
          <MenuItem onTouchTap={this.handleLogout}>{`Logout (${this.props.user.get('login')})`}</MenuItem>
        </Drawer>
        <div>
          { this.state.openImport
            ? <ImportModal
              articles={this.state.articlesToImport}
              rememberArticles={this.props.rememberArticles}
              unmount={this.unmountImport}
            /> : null }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: getAuthenticatedUser(state),
});

export default connect(mapStateToProps, { logoutUser, rememberArticles })(HeaderBar);
