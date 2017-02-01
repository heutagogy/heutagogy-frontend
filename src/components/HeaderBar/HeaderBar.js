import { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import PureRender from 'pure-render-decorator';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

import styles from './HeaderBar.less';

@PureRender
class HeaderBar extends Component {
  static propTypes = {
    location: PropTypes.object,
  }

  render() {
    return (
      <div>
        <AppBar
          className={styles.headerBar}
          iconElementLeft={
            <MenuIcon
              color="white"
              style={{ margin: '0 10px 0 30px' }}
            />
          }
          iconElementRight={<span />}
          iconStyleLeft={styles.iconClassNameLeft}
          iconStyleRight={{ margin: 0 }}
          title="Heutagogy"
        />
      </div>
    );
  }
}

export default HeaderBar;
