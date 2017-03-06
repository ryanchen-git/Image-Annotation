var React = require('react');

var DeleteNote = React.createClass({
  /*
    Function: clickDeleteNote
    Purpose: Handle the event when the 'Delete Note' button is click
    Parameters: none
    Return value: none
  */  
  clickDeleteNote: function() {
    var modalWindow = document.getElementById("modalWindow");
    var modalBox = document.getElementById("modalBox");

    modalWindow.setAttribute("style", "display: block;");
    modalBox.setAttribute("style", "display: block;");

    this.props.hideDeleteNote();
  },
  render: function() {
    var deleteNoteClass = "";
    var deleteNoteStyle = {};

    if (this.props.notesItem.showDeleteNote) {
      deleteNoteClass = "deleteNote show";
      deleteNoteStyle.left = (this.props.notesItem.currentActiveDot.posX) + 'px';
      deleteNoteStyle.top = (this.props.notesItem.currentActiveDot.posY) + 'px';
    } else {
      deleteNoteClass = "deleteNote hide";
    }

    return (
      <div className={deleteNoteClass} style={deleteNoteStyle} onClick={this.clickDeleteNote}>
        Delete Note
      </div>
    );
  }
});

module.exports = DeleteNote;