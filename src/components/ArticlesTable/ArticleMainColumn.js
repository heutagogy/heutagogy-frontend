import { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import DoneIcon from 'material-ui/svg-icons/action/done';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import { TableRowColumn } from 'material-ui/Table';

import styles from './ArticlesTable.less';

const inlineStyles = {
  wrapWordColumn: {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    width: '200px',
    paddingLeft: '7px',
    paddingRight: '0',
  },
  tag: {
    backgroundColor: 'lightgrey',
    border: '1px solid gray',
    borderRadius: '3px',
    padding: '0 5px',
    marginRight: '7px',
    opacity: '0.50',
  },
  tagEdit: {
    fontSize: '14px',
    lineHeight: '24px',
  },
  doneIconStyle: {
    color: '#2196F3',
  },
  cancelIconStyle: {
    color: '#f44336',
  },
};

const initialState = {
  isEditing: false,
  newTitle: null,
  newTags: [],
};

export class ArticleMainColumn extends Component {
  static propTypes = {
    read: PropTypes.string,
    tags: PropTypes.array,
    title: PropTypes.string,
    url: PropTypes.string,
    onArticleChanged: PropTypes.func,
  };

  constructor() {
    super();

    this.state = initialState;

    this.handleClick = this.handleClick.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
    this.handleChangeCancel = this.handleChangeCancel.bind(this);
  }

  handleClick() {
    if (this.state.isEditing === true) {
      return;
    }

    this.setState({
      isEditing: true,
      newTitle: this.props.title,
      newTags: this.props.tags,
    });
  }

  handleTitleChange(e, newTitle) {
    this.setState({
      newTitle,
    });
  }

  handleTagsChange(e, newTags) {
    this.setState({
      newTags: newTags !== ''
        ? newTags.
          split(',').
          map((s) => s.replace(/ /g, ''))
        : [],
    });
  }

  handleChangeComplete() {
    this.props.onArticleChanged({
      title: this.state.newTitle,
      tags: this.state.newTags,
    });

    this.setState(initialState);
  }

  handleChangeCancel() {
    this.setState(initialState);
  }

  render() {
    return (
      <TableRowColumn
        className={styles.preventCellClick}
        style={inlineStyles.wrapWordColumn}
        onClick={this.handleClick}
      >
        <div
          className={this.props.read ? styles.linkDivRead : styles.linkDivUnread}
        >
          {this.state.isEditing === true
           ? <form onSubmit={this.handleChangeComplete}>
             <TextField
               autoFocus
               fullWidth
               id="title-field-input"
               value={this.state.newTitle}
               onChange={this.handleTitleChange}
             />
             <TextField
               hintText="tags"
               id="tags-field-input"
               style={inlineStyles.tagEdit}
               underlineShow={false}
               value={this.state.newTags.join(', ')}
               onChange={this.handleTagsChange}
             /><br />
             <div>
               <IconButton
                 iconStyle={inlineStyles.doneIconStyle}
                 type="submit"
               >
                 <DoneIcon />
               </IconButton>
               <IconButton
                 iconStyle={inlineStyles.cancelIconStyle}
                 style={{ float: 'right' }}
                 onClick={this.handleChangeCancel}
               >
                 <CancelIcon />
               </IconButton>
             </div>
           </form>
           : <div>
             <a
               href={this.props.url}
               target="_blank"
               onClick={(e) => e.stopPropagation()} // eslint-disable-line react/jsx-no-bind
             >
               {this.props.title}
             </a><br />
             {
               this.props.tags.map((tag, i) =>
                 (
                   <span
                     key={`${tag}${i}`}
                     style={inlineStyles.tag}
                   >{tag}</span>
                 )
               )
             }
           </div>
          }
        </div>
      </TableRowColumn>);
  }
}
