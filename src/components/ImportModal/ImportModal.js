/* eslint-disable react/jsx-key */
import { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Dialog from 'material-ui/Dialog';
import { arrayOf } from 'normalizr';

import articleSchema from './../../schemas/article';
import { ARTICLES_VIEW_STATE } from './../../constants/ViewStates';
import FlatButton from './../Fields/FlatButton';
import { ArticlesTable, getSelectedArticles } from './../ArticlesTable/ArticlesTable';

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

class ImportModal extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.List),
    loadEntities: PropTypes.func,
    rememberArticles: PropTypes.func,
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
      this.props.loadEntities({ href: '/bookmarks', type: ARTICLES_VIEW_STATE, schema: arrayOf(articleSchema) });
    }

    this.props.unmount();
  }

  handleClose() {
    this.props.unmount();
  }

  render() {
    const actions = [
      <FlatButton
        disabled={this.props.articles.isEmpty()}
        label={'Submit'}
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
          modal={false}
          open
          title={'Import Articles'}
          titleStyle={inlineStyles.titleStyle}
          onRequestClose={this.handleClose}
        >
          { this.props.articles.isEmpty()
            ? <div className={styles.error}>
              {'Please, choose the file containing a valid json array with articles.'}
            </div>
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

export default ImportModal;
