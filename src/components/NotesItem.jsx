var React = require('react');
var ListNotes = require('./ListNotes.jsx');

var NotesItem = React.createClass({
  getInitialState: function() {
    return {
      key: '',
      value: '',
      type: "new",
      cancelBtn: false,
      errorMsg: false
    };
  },
  /*
    Purpose: Call the reference functions in the listNotes component
  */  
  showNotesField: function() {
    this.refs.listNotes.showNotesField();
  },
  showOptionsEdit: function() {
    this.refs.listNotes.showOptionsEdit();
  },
  hideOptionsEdit: function() {
    this.refs.listNotes.hideOptionsEdit();
  },
  /*
    Function: editClick
    Purpose: Call back funtion to the Upload component
    Parameters: type of the edit
    Return value: none
  */
  editClick: function(type) {
    this.props.editClick();

    if (type == "edit") {
      this.setState({
        key: this.props.notesItem.currentKeyValue.key,
        value: this.props.notesItem.currentKeyValue.value,
        type: "edit",
        cancelBtn: true,
        errorMsg: false
      });
    }
  },
  /*
    Function: cancelClick
    Purpose: Handle the 'Cancel' button
    Parameters: none
    Return value: none
  */
  cancelClick: function() {
    this.setState({
      key: '',
      value: '',      
      cancelBtn: false,
      errorMsg: false
    });
    this.props.cancelClick();
    this.refs.listNotes.showNotesField();
    this.refs.listNotes.showOptionsEdit();
  },
  /*
    Function: hidecancelBtn
    Purpose: Hide the cancel button
    Parameters: none
    Return value: none
  */
  hidecancelBtn: function() {
    this.setState({
      cancelBtn: false
    });
  },  
  /*
    Function: showErrorMsg
    Purpose: Show the error message in the popover input box
    Parameters: none
    Return value: none
  */
  showErrorMsg: function() {
    this.setState({
      errorMsg: true
    });
  },
  /*
    Function: hideErrorMsg
    Purpose: Hide the error message in the popover input box
    Parameters: none
    Return value: none
  */
  hideErrorMsg: function() {
    this.setState({
      errorMsg: false
    });
  },
  /*
    Function: hideCancelLink
    Purpose: Hide the cancel button in the popover input box
    Parameters: none
    Return value: none
  */
  hideCancelLink: function() {
    this.setState({
      cancelBtn: false
    });
  },  
  /*
    Function: handleNotesSubmit
    Purpose: Call the addNotes function in Upload component when the "Save" button is click
    Parameters: event to prevent the default form submit
    Return value: none
  */
  handleNotesSubmit: function(e) {
    e.preventDefault();

    if (this.state.key != '' && this.state.value != '') {
      var checkUnique = this.props.addNotes();

      if (checkUnique) {
        this.setState({
          key: '',
          value: ''
        });
        this.refs.listNotes.showNotesField();
      } else {
        this.refs.listNotes.hideNotesField();
      }
    }
  },
  /*
    Function: keyChange
    Purpose: Upate the value of 'Key' input field
    Parameters: none
    Return value: none
  */
  keyChange: function(e) {
    this.setState({
      key: e.target.value
    });
  },
  /*
    Function: valueChange
    Purpose: Upate the value of 'Value' input field
    Parameters: none
    Return value: none
  */
  valueChange: function(e) {
    this.setState({
      value: e.target.value
    });
  },
  /*
    Function: resetKeyValue
    Purpose: Remove the input value of 'Key' and 'Value' input field
    Parameters: none
    Return value: none
  */
  resetKeyValue: function() {
    this.setState({
      key: '',
      value: '',
      type: "new"
    });
  },
  render: function() {
    var popOverStyle = {};
    var popoverAnchorClass = "";
    var notesFormClass = "";
    var cancelClass = "";
    var errorClass = "";

    if (this.props.notesItem.showInputNotes) {
      popOverStyle.display = "block";
    }

    if (!this.props.notesItem.currentActiveDot) { //For create new entry
      if (this.props.notesItem.posX > 370) {
        popOverStyle.left = (this.props.notesItem.posX - 377) + 'px';
        popoverAnchorClass = "popoverAnchor right";
      } else {
        popOverStyle.left = (this.props.notesItem.posX + 27) + 'px';
        popoverAnchorClass = "popoverAnchor left";
      }
      popOverStyle.top = (this.props.notesItem.posY - 24) + 'px';
    } else { //For retrive existing entry
      if (this.props.notesItem.currentActiveDot.posX > 370) {
        popOverStyle.left = (this.props.notesItem.currentActiveDot.posX - 377) + 'px';
        popoverAnchorClass = "popoverAnchor right";
      }else {
        popOverStyle.left = (this.props.notesItem.currentActiveDot.posX + 27) + 'px';
        popoverAnchorClass = "popoverAnchor left";
      }
      popOverStyle.top = (this.props.notesItem.currentActiveDot.posY - 24) + 'px';
    }

    if (this.props.notesItem.showInputForm) {
      notesFormClass = "form-inline notesForm show";
    } else {
      notesFormClass = "form-inline notesForm hide";
    }

    if (this.state.cancelBtn) {
      cancelClass = "cancel-link show";
    } else {
      cancelClass = "cancel-link hide";
    }

    if (this.state.errorMsg) {
      errorClass = "error-msg show";
    } else {
      errorClass = "error-msg hide";
    }

    return (
      <div className="popoverInput" style={popOverStyle} onMouseEnter={this.showOptionsEdit} onMouseLeave={this.hideOptionsEdit}>

        <div className={popoverAnchorClass}></div>

        <ListNotes ref="listNotes" currentItem={this.props.notesItem.currentKeyValue} editClick={this.editClick} />

        <div className={cancelClass}><span onClick={this.cancelClick}>Cancel</span></div>

        <form name="notesForm" className={notesFormClass} onSubmit={this.handleNotesSubmit}>
          <input type="text" name="keyInputField" className="form-control text-field" placeholder="Key" onChange={this.keyChange} value={this.state.key} autoFocus />: 
          <input type="text" name="valueInputField" className="form-control text-field" placeholder="Value" onChange={this.valueChange} value={this.state.value} />
          <button className="btn btn-sm enter-btn">Save</button>
        </form>
        <div className={errorClass}>The key you entered already exist.</div>
      </div>
    );
  }
});

module.exports = NotesItem;