var React = require('react');

var NotesDot = React.createClass({
  /*
    Function: showNotesBox
    Purpose: Call showInputBox function in Upload component when the notes is clilck
    Parameters: current index value
    Return value: none
  */
  showNotesBox: function() {
    this.props.showInputBox(this.props.currentIndex);
  },
  /*
    Function: removeDeleteNote
    Purpose: Call removeDeleteNote function in Upload component when the mouse is press down (active)
    Parameters: none
    Return value: none
  */
  removeDeleteNote: function() {
    this.props.removeDeleteNote();
  },
  /*
    Function: dotsDrag
    Purpose: Call dotsDrag function in Upload component when the dot is being dragged
    Parameters: current index value
    Return value: none
  */
  dotsDrag: function() {
    this.props.dotsDrag(this.props.currentIndex);
  },
  /*
    Function: newDotsPos
    Purpose: Call newDotsPos function in Upload component when the dot is draaged to the new position
    Parameters: event to get the current mouse position
    Return value: none
  */
  newDotsPos: function(e) {
    this.props.newDotsPos(this.props.currentIndex, e.pageX, e.pageY);
  },
  /*
    Function: rightClick
    Purpose: Call rightClick function in Upload component when the mouse right button is click
    Parameters: event to prevent the default mouse right click
    Return value: none
  */
  rightClick: function(e) {
    e.preventDefault();

    this.props.rightClick(this.props.currentIndex);
  },
  render: function() {
    var dotStyle = {};

    if (this.props.object) {
      dotStyle.left = (this.props.object.posX - 12) + 'px';
      dotStyle.top = (this.props.object.posY - 12) + 'px';
    }

    return (
      <div className="notesDot" style={dotStyle} onClick={this.showNotesBox} onMouseDown={this.removeDeleteNote} onDrag={this.dotsDrag} onDragEnd={this.newDotsPos} onContextMenu={this.rightClick} draggable={this.props.dotDraggable}>
        {this.props.currentIndex + 1}
      </div>
    );
  }
});

module.exports = NotesDot;