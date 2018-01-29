import { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import DoneIcon from 'material-ui-icons/Done';
import SpeakerNotes from 'material-ui-icons/SpeakerNotes';
import CancelIcon from 'material-ui-icons/Cancel';
import { TableRowColumn } from 'material-ui/Table';
import { ZERO } from './../../constants/Constants';

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
  notesIconStyle: {
    color: '#9e9e9e',
    height: '20px',
    width: '20px',
  },
};

const initialState = {
  isEditing: false,
  newTitle: null,
  showNotes: false,
  newTags: [],
};

export class ArticleMainColumn extends Component {
  static propTypes = {
    notesLength: PropTypes.number,
    read: PropTypes.string,
    tags: PropTypes.array,
    title: PropTypes.string,
    url: PropTypes.string,
    onArticleChanged: PropTypes.func,
    onNotesClick: PropTypes.func,
  };

  constructor() {
    super();

    this.state = initialState;

    this.handleClick = this.handleClick.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
    this.handleChangeCancel = this.handleChangeCancel.bind(this);
    this.handleNotesClick = this.handleNotesClick.bind(this);
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

  handleNotesClick(e) {
    e.stopPropagation();

    this.props.onNotesClick();
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
             <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0 3px 0' }}>
               <a
                 href={this.props.url}
                 rel="noopener"
                 target="_blank"
                 onClick={(e) => e.stopPropagation()}  // eslint-disable-line react/jsx-no-bind
               >
                 {this.props.title}
               </a>
               <IconButton
                 iconStyle={inlineStyles.notesIconStyle}
                 style={{ padding: '0 0 0 7px', marginRight: '5px', width: '20px', height: '20px' }}
                 onClick={this.handleNotesClick}
               >
                 <SpeakerNotes className={this.props.notesLength > ZERO ? styles.notesExist : styles.noNotes} />
               </IconButton>
             </div>
             <div style={{ marginBottom: '5px' }}>
               {
                 this.props.tags.map((tag, i) =>
                   (
                     <span
                       key={`${tag}${i}`}
                       style={inlineStyles.tag}
                     >
                       {tag}
                     </span>
                   )
                 )
               }
             </div>
           </div>
          }
        </div>
      </TableRowColumn>);
  }
}
