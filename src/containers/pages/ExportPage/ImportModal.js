/* eslint-disable react/jsx-key */
import { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Dialog from 'material-ui/Dialog';

import FlatButton from './../../../components/Fields/FlatButton';
import { ArticlesTable } from './ArticlesTable';

import styles from './ImportModal.less';

const inlineStyles = {
  titleStyle: {
    fontFamily: 'Ubuntu, sans-serif',
    textAlign: 'center',
  },
  submit: {
    float: 'left',
    margin: '0 10px',
  },
  close: {
    margin: '0 10px',
  },
};

export class ImportModal extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    open: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = { selectedRows: [] };
  }

  onRowSelection(selectedRows) {
    this.setState({ selectedRows });
  }

  handleClose() {
  }

  render() {
    const actions = [
      <FlatButton
        label={'Submit'}
        primary
        style={inlineStyles.submit}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={'Cancel'}
        primary
        style={inlineStyles.close}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          actions={actions}
          autoScrollBodyContent
          modal={false}
          open={this.props.open}
          title={'Import Articles'}
          titleStyle={inlineStyles.titleStyle}
          onRequestClose={this.handleClose}
        >
          { this.props.articles.isEmpty()
            ? 'Please, choose the file containing a valid json array.'
            : <div className={styles.table}>
              <ArticlesTable
                articles={this.props.articles}
                handleOnRowSelection={this.onRowSelection}
                selectedRows={this.state.selectedRows}
              />
            </div>}
        </Dialog>
      </div>
    );
  }
}
