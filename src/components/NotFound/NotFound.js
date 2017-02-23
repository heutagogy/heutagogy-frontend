import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import pureRender from 'pure-render-decorator';
import styles from './NotFound.less';

@pureRender
class NotFound extends Component {
  static propTypes = {
    replaceUrl: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.handleGotoMainClicked = this.handleGotoMainClicked.bind(this);
  }

  handleGotoMainClicked(e) {
    e.preventDefault();
    this.props.replaceUrl('/');
  }

  render() {
    return (
      <div className={styles.notFound}>
        <h3>{'404 Page not found'}</h3>
        <p>{'We are sorry but the page you are looking for does not exist.'}</p>
        <a
          href="/"
          onClick={this.handleGotoMainClicked}
        >
          {'Go to main page'}
        </a>
      </div>);
  }
}

export default connect(null, { replaceUrl: replace })(NotFound);
