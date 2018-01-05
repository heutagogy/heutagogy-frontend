/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-magic-numbers */
import IconButton from 'material-ui/IconButton';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ReactMarkdown from 'react-markdown';
import Textarea from 'react-textarea-autosize';

import { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from './../Fields/FlatButton';


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
  doneIconStyle: {
    color: '#2196F3',
  },
  dialogBody: {
    padding: 0,
    backgroundColor: '#eee',
    minHeight: '300px',
    maxHeight: '500px',
  },
  textArea: {
    boxSizing: 'border-box',
    width: '100%',
    backgroundColor: '#eee',
  },
};


export class NotesModal extends Component {
  static propTypes = {
    articleId: PropTypes.number,
    handleClose: PropTypes.func,
    notes: PropTypes.array,
    updateArticle: PropTypes.func,
  }

  constructor(props) {
    super(props);

    // component supports only one note.
    const content = props.notes[0] || '';

    this.state = {
      editing: content === '',
      content,
    };
    this.textArea = null;

    [
      'handleMarkdownClick',
      'handleDoneClick',
      'handleClose',
      'handleOk',
    ].forEach((method) => { this[method] = this[method].bind(this); });
  }

  componentWillMount() {
    this.focusTextArea();
  }

  focusTextArea() {
    setTimeout(() => this.textArea && this.textArea.focus(), 500);
  }

  handleMarkdownClick() {
    this.focusTextArea();
    this.setState({ editing: true });
  }

  handleDoneClick() {
    this.setState({ editing: false });
  }

  handleClose() {
    this.props.handleClose();
  }

  handleOk() {
    if ((this.props.notes[0] || '') !== this.state.content) {
      const notesCopy = [...this.props.notes];

      /* eslint-disable fp/no-mutation */
      notesCopy[0] = this.state.content;
      /* eslint-enable fp/no-mutation */

      this.props.updateArticle(
        this.props.articleId,
        { notes: notesCopy }
      );
    }

    this.props.handleClose();
  }

  render() {
    const actions = [
      <FlatButton
        label={'Ok'}
        primary
        style={inlineStyles.submit}
        onTouchTap={this.handleOk}
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
          autoDetectWindowHeight
          bodyStyle={inlineStyles.dialogBody}
          open
          title={'Notes'}
          titleStyle={inlineStyles.titleStyle}
        >
          {
            this.state.editing === true
            ? <div>
              <Textarea
                inputRef={(el) => { this.textArea = el; }}
                style={inlineStyles.textArea}
                value={this.state.content}
                onChange={(e) => this.setState({ content: e.target.value })}
              />
              <IconButton
                iconStyle={inlineStyles.doneIconStyle}
                onTouchTap={this.handleDoneClick}
              >
                <DoneIcon />
              </IconButton>
            </div>
            : <div
              style={{ minHeight: '200px' }}
              onTouchTap={this.handleMarkdownClick}
            >
              <ReactMarkdown
                source={this.state.content}
              />
            </div>
          }
        </Dialog>
      </div>
    );
  }
}

export default NotesModal;
