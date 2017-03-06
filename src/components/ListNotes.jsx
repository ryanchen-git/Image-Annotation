var React = require('react');

var ListNotes = React.createClass({
  getInitialState: function() {
    return {
      showOptionsEdit: false,
      showNotesField: false
    };
  },
  /*
    Function: editClick
    Purpose: Hanlde the event when the 'Edit' button is click
    Parameters: none
    Return value: none
  */
  editClick: function() {
    this.props.editClick("edit");

    this.setState({
      showOptionsEdit: false,
      showNotesField: false
    });
  },
  /*
    Function: deleteClick
    Purpose: Hanlde the event when the 'Delete' button is click
    Parameters: none
    Return value: none
  */
  deleteClick: function() {
    var modalWindow = document.getElementById("modalWindow");
    var modalBox = document.getElementById("modalBox");

    modalWindow.setAttribute("style", "display: block;");
    modalBox.setAttribute("style", "display: block;");
  },
  /*
    Function: showNotesField
    Purpose: Show the Notes (key/value pair) field
    Parameters: none
    Return value: none
  */
  showNotesField: function() {
    this.setState({
      showNotesField: true
    });
  },
  /*
    Function: hideNotesField
    Purpose: Hide the Notes (key/value pair) field
    Parameters: none
    Return value: none
  */
  hideNotesField: function() {
    this.setState({
      showNotesField: false
    });
  },
  /*
    Function: showOptionsEdit
    Purpose: Show options (Edit/Delete) field
    Parameters: none
    Return value: none
  */
  showOptionsEdit: function() {
    this.setState({
      showOptionsEdit: true
    });
  },
  /*
    Function: hideOptionsEdit
    Purpose: Show options (Edit/Delete) field
    Parameters: none
    Return value: none
  */
  hideOptionsEdit: function() {
    this.setState({
      showOptionsEdit: false
    });
  },
  render: function() {
    var fieldClass = "";
    var actionsClass = "";

    if (this.props.currentItem.key && this.state.showNotesField) {
      fieldClass = "notes-field show";
    } else if (!this.props.currentItem.key || !this.state.showNotesField) {
      fieldClass = "notes-field hide";
    }

    if (this.state.showOptionsEdit) {
      actionsClass = "action-links show";
    } else {
      actionsClass = "action-links hide";
    }

    return (
      <div className={fieldClass}>
        <span className="key">{this.props.currentItem.key}</span>: <span className="value">{this.props.currentItem.value}</span>
        <div className={actionsClass}>
          <span className="link first" onClick={this.editClick}>Edit</span> <span className="link" onClick={this.deleteClick}>Delete</span>
        </div>
      </div>
    );
  }
});

module.exports = ListNotes;