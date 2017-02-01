import { PropTypes, Component } from 'react';
import Radium from 'radium';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import HeaderBar from './HeaderBar';

const inlineStyles = {
  routerContainer: {
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'auto',
  },
};

@Radium
class App extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
  }

  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div>
            <HeaderBar location={this.props.location} />
            <div style={inlineStyles.routerContainer}>
              {this.props.children}
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
