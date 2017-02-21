import { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import { TableRowColumn } from 'material-ui/Table';

import styles from './ArticlesTable.less';

const inlineStyles = {
  wrapWordColumn: {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    width: '200px',
    paddingLeft: '0',
    paddingRight: '0',
  },
};

export class ArticleTitle extends Component {
  static propTypes = {
    read: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
    onTitleChanged: PropTypes.func,
  };

  constructor() {
    super();

    this.state = {
      isEditing: false,
      newValue: null,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
    this.handleChangeCancel = this.handleChangeCancel.bind(this);
  }

  handleClick(e) {
    this.setState({
      isEditing: true,
      newValue: this.props.title,
    });
    e.stopPropagation();
  }

  handleChange(e, newValue) {
    this.setState({
      newValue,
    });
  }

  handleChangeComplete(e) {
    this.props.onTitleChanged(this.state.newValue);
    this.setState({
      isEditing: false,
      newValue: null,
    });
    e.preventDefault();
  }

  handleChangeCancel() {
    this.setState({
      isEditing: false,
      newValue: null,
    });
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
          {this.state.isEditing
           ? <form onSubmit={this.handleChangeComplete}>
             <TextField
               autoFocus
               fullWidth
               id="text-field-input"
               value={this.state.newValue}
               onBlur={this.handleChangeCancel}
               onChange={this.handleChange}
             />
           </form>
           : <a
             href={this.props.url}
             target="_blank"
           >
             {this.props.title}
           </a>}
        </div>
      </TableRowColumn>);
  }
}
