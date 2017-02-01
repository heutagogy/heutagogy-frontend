/* eslint-disable react/jsx-key */
import { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Dialog from 'material-ui/Dialog';

import FlatButton from './../Fields/FlatButton';
import { ArticlesTable, getSelectedArticles } from './../ArticlesTable/ArticlesTable';

import styles from './ImportModal.less';
import Spinner from './../Spinner';

const inlineStyles = {
  titleStyle: {
    textAlign: 'center',
    padding: '15px',
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
    rememberArticles: PropTypes.func,
    rememberArticlesState: PropTypes.instanceOf(Immutable.Map),
    unmount: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.bind();

    this.state = { selectedRows: [] };
  }

  onRowSelection(selectedRows) {
    this.setState({ selectedRows });
  }

  bind() {
    this.onRowSelection = this.onRowSelection.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const articlesToImport = getSelectedArticles(this.props.articles, this.state.selectedRows);

    if (!articlesToImport.isEmpty()) {
      this.props.rememberArticles({ articles: articlesToImport });
    }

    // unselect all (only works if you selected each row separately, see https://github.com/callemall/material-ui/issues/3074)
    this.state = { selectedRows: [] };
  }

  handleClose() {
    this.props.unmount();
  }

  render() {
    const actions = [
      <FlatButton
        disabled={this.props.articles.isEmpty()}
        label={this.props.rememberArticlesState && this.props.rememberArticlesState.get('isInProgress')
          ? <Spinner size={25} /> : 'Submit'}
        primary
        style={inlineStyles.submit}
        onTouchTap={this.handleSubmit}
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
          bodyStyle={{ padding: 0, backgroundColor: '#eee' }}
          modal={false}
          open
          title={'Import Articles'}
          titleStyle={inlineStyles.titleStyle}
          onRequestClose={this.handleClose}
        >
          { this.props.articles.isEmpty()
            ? <div
              className={styles.error}
              id={'message'}
            >
              {'Please, choose the file containing a valid json array with articles.'}
            </div>
            : <div className={styles.table}>
              <ArticlesTable
                articles={this.props.articles}
                handleOnRowSelection={this.onRowSelection}
                id={'importing-table'}
                selectedRows={this.state.selectedRows}
              />
            </div>}
        </Dialog>
      </div>
    );
  }
}

export default ImportModal;
