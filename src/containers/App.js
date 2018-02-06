import { PropTypes, Component } from 'react'
import Radium from 'radium'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

@Radium
class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          {this.props.children}
        </MuiThemeProvider>
      </div>
    )
  }
}

export default App
