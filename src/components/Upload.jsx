var React = require('react');
var NotesItem = require('./NotesItem.jsx');
var NotesDot = require('./NotesDot.jsx');
var DeleteNote = require('./DeleteNote.jsx');
var jsonFile = null;

var Upload = React.createClass({
  getInitialState: function() {
    return {
      file: '',
      imagePreviewUrl: '',
      allowAddNotes: true,
      showNotesDot: false,
      showInputNotes: false,
      showInputForm: true,
      showDeleteNote: false,
      currentActiveDot: '',
      currentActiveIndex: 0,
      currentKeyValue: {
        key: '',
        value: ''
      },
      posX: '',
      posY: '',
      notesItemsArray: []
    };
  },

  /* For image upload */
  handleImageChange: function(e) {
    e.preventDefault();

    var reader = new FileReader();
    var file = e.target.files[0];
    var that = this;

    if (file) {
      reader.onload = function(upload) {
        that.setState({
          file: file,
          imagePreviewUrl: upload.target.result
        });
      }
      reader.readAsDataURL(file);
    }
  },
  /*
    Function: handleImageClick
    Purpose: To handle the click event when the image is being clicked
    Parameters: event for the mouse position
    Return value: none
  */
  handleImageClick: function(e) {
    if (this.state.showInputNotes) {
      this.setState({
        allowAddNotes: false,
        showInputNotes: false,
        showInputForm: false,
        currentActiveDot: ''
      });

      this.refs.notesItem.hideErrorMsg();
      this.refs.notesItem.hideCancelLink();
      this.removeFirstDot();
    }

    if (this.state.showDeleteNote) {
      this.setState({
        showDeleteNote: false
      });
    }

    if (this.state.allowAddNotes) {
      var notesDotDiv = document.getElementsByClassName("notesDot");
      var posX = this.getMousePosX(e.pageX);
      var posY = this.getMousePosY(e.pageY);

      notesDotDiv[0].style.left = (posX - 12) + 'px';
      notesDotDiv[0].style.top = (posY - 12) + 'px';

      this.setState({
        allowAddNotes: false,
        showNotesDot: true,
        showInputNotes: true,
        showInputForm: true,
        currentActiveIndex: notesDotDiv.length - 1,
        currentKeyValue: {
          key: '',
          value: ''
        },
        posX: posX,
        posY: posY
      });

      this.refs.notesItem.resetKeyValue();
    }
  },

  /* For NotesDot Component */
  /*
    Function: showInputBox
    Purpose: To show the popover input box
    Parameters: the current notes index
    Return value: none
  */
  showInputBox: function(index) {
    var notesDotDiv = document.getElementsByClassName("notesDot");
    if (notesDotDiv.length != index + 1) {
      this.removeFirstDot();
    }

    if ((this.state.showInputNotes && (index != this.state.currentActiveIndex)) || this.state.currentActiveIndex == 0) {
      var showNotes = true;
      this.state.currentActiveIndex = index;
    }

    if (!this.state.showInputNotes || showNotes) {
      if (index >= 0) {
        var currentItem = this.state.notesItemsArray[index];

        if (currentItem) {
          this.setState({
            showInputNotes: true,
            showInputForm: false,
            showDeleteNote: false,
            currentActiveDot: currentItem,
            currentActiveIndex: index,
            currentKeyValue: {
              key: currentItem.key,
              value: currentItem.value
            }
          });

          this.refs.notesItem.showNotesField();
          this.refs.notesItem.hideCancelLink();
        } else {
          this.setState({
            showInputNotes: true,
            showInputForm: true,
            showDeleteNote: false
          });
        }
      }
    }
  },
  /*
    Function: removeInputBox
    Purpose: To hide the popover input box when the notes dot is being dragged
    Parameters: the current notes index
    Return value: none
  */
  removeInputBox: function(index) {
    var notesDotDiv = document.getElementsByClassName("notesDot");
    if (notesDotDiv.length != index + 1) {
      this.removeFirstDot();
    }

    this.setState({
      showInputNotes: false,
      showInputForm: false
    });
  },
  /*
    Function: setNewDotsPos
    Purpose: To set the new mouse position when the notes dot is dragged to the new position
    Parameters: current notes index, new position X, new position Y
    Return value: none
  */
  setNewDotsPos: function(index, pageX, pageY) {
    var posX = this.getMousePosX(pageX) + 12;
    var posY = this.getMousePosY(pageY) - 12;

    if (this.state.notesItemsArray.length > 0) { //Only the dots with input value is draggable
      if (posX > 0 && posY > 0 && posX < 1190 && posY < 700) { //Check if the dots is being dragged out of bound
        this.state.notesItemsArray[index].posX = posX;
        this.state.notesItemsArray[index].posY = posY;

        this.setState({
          posX: posX,
          posY: posY
        });
      }
    }
  },
  /*
    Function: showDeleteNote
    Purpose: Show the delete option box when the user performs the right click
    Parameters: current notes index
    Return value: none
  */
  showDeleteNote: function(index) {  
    var currentItem = this.state.notesItemsArray[index];

    if (this.state.notesItemsArray.length > 0) {
      this.setState({
        showInputNotes: false,
        showInputForm: false,
        showDeleteNote: true,
        currentActiveDot: currentItem,
        currentActiveIndex: index
      });
    }
  },
  /*
    Function: removeDeleteNote
    Purpose: hide the delete option box
    Parameters: none
    Return value: none
  */
  removeDeleteNote: function() {
    if (this.state.notesItemsArray.length > 0) {
      this.setState({
        showDeleteNote: false
      });
    }
  },

  /* For NotesItem Component */
  /*
    Function: addNotes
    Purpose: Add the new/existing notes when the 'Save' button is click
    Parameters: none
    Return value: true/false - return true if the key is unique, otherwise return false
  */
  addNotes: function() {
    if (this.refs.notesItem.state.type == "new") { //For adding new notes
      for (var i in this.state.notesItemsArray) {
        if (this.state.notesItemsArray[i].key == this.refs.notesItem.state.key) {
          this.refs.notesItem.showErrorMsg();
          return false;
        }
      }

      var newNotesObj = {
        posX: this.state.posX,
        posY: this.state.posY,
        key: this.refs.notesItem.state.key,
        value: this.refs.notesItem.state.value
      };

      var currentNotesItems = this.state.notesItemsArray;
      currentNotesItems.push(newNotesObj);

      this.setState({
        showInputForm: false,
        currentActiveIndex: currentNotesItems.length - 1,
        currentKeyValue: {
          key: this.refs.notesItem.state.key,
          value: this.refs.notesItem.state.value
        },
        notesItemsArray: currentNotesItems
      });

      this.removeFirstDot();
    } else if (this.refs.notesItem.state.type == "edit") { //For editing existing notes
      for (var i = 0; i < this.state.notesItemsArray.length; i++) {
        if (this.state.notesItemsArray[i].key == this.refs.notesItem.state.key) {
          if (this.state.currentActiveIndex != i) {
            this.refs.notesItem.showErrorMsg();
            return false;
          }
        }
      }

      this.state.notesItemsArray[this.state.currentActiveIndex].key = this.refs.notesItem.state.key;
      this.state.notesItemsArray[this.state.currentActiveIndex].value = this.refs.notesItem.state.value;

      this.setState({
        showInputForm: false,
        currentKeyValue: {
          key: this.refs.notesItem.state.key,
          value: this.refs.notesItem.state.value
        }
      });
      this.refs.notesItem.showOptionsEdit();
      this.refs.notesItem.hideCancelLink();
    }

    //Generate the JSON file
    var generateFile = document.getElementById("saveBtnLink");
    generateFile.href = this.makeJsonFile();

    this.refs.notesItem.hideErrorMsg();
    return true;
  },
  /*
    Function: showInputForm
    Purpose: Show the input form when the 'Edit' button is click
    Parameters: none
    Return value: none
  */
  showInputForm: function() {
    this.setState({
      showInputForm: true
    });
  },
  /*
    Function: hideInputForm
    Purpose: Hide the input form
    Parameters: none
    Return value: none
  */
  hideInputForm: function() {
    this.setState({
      showInputForm: false
    });
  },

  /* For delete confirmation modal window */
  /*
    Function: cancelDelete
    Purpose: Remove the confirmation modal when the 'Cancel' button is click
    Parameters: none
    Return value: none
  */
  cancelDelete: function() {
    var modalWindow = document.getElementById("modalWindow");
    var modalBox = document.getElementById("modalBox");

    modalWindow.setAttribute("style", "display: none;");
    modalBox.setAttribute("style", "display: none;");
  },
  /*
    Function: removeNotes
    Purpose: Remove the notes and confirmation modal when the 'Delete' button is click
    Parameters: none
    Return value: none
  */
  removeNotes: function() {
    this.state.notesItemsArray.splice(this.state.currentActiveIndex, 1);
    this.setState({
      showInputNotes: false,
      showDeleteNote: false
    });

    var modalWindow = document.getElementById("modalWindow");
    var modalBox = document.getElementById("modalBox");
    var generateFile = document.getElementById("saveBtnLink");
    
    modalWindow.setAttribute("style", "display: none;");
    modalBox.setAttribute("style", "display: none;");

    if (this.state.notesItemsArray.length > 0) {
      generateFile.href = this.makeJsonFile();  
    } else {
      generateFile.removeAttribute("href");
    }
  },

  /* For user action options */
  /*
    Function: addNotesBtn
    Purpose: Allow the user to add notes over the image
    Parameters: none
    Return value: none
  */
  addNotesBtn: function() {
    var notesDotDiv = document.getElementsByClassName("notesDot");

    for (var i = 0; i < notesDotDiv.length; i++) {
      notesDotDiv[i].setAttribute("class", "notesDot block");
    }

    this.setState({
      allowAddNotes: true,
      showNotesDot: true
    });
  },
  /*
    Function: toggleNotesDot
    Purpose: Toggle the visibility of notes on/off
    Parameters: none
    Return value: none
  */
  toggleNotesDot: function() {
    var notesDotDiv = document.getElementsByClassName("notesDot");

    if (this.state.showNotesDot === false) {
      for (var i = 0; i < notesDotDiv.length; i++) {
        notesDotDiv[i].setAttribute("class", "notesDot block");
      }
    } else {
      for (var i = 0; i < notesDotDiv.length; i++) {
        notesDotDiv[i].setAttribute("class", "notesDot none");
      }
    }

    this.setState({
      showNotesDot: !this.state.showNotesDot,
      showInputNotes: false
    });
  },
  /*
    Function: makeJsonFile
    Purpose: Generate the JSON file out of the notes array
    Parameters: none
    Return value: jsonFile in blob format
  */
  makeJsonFile: function() {
    var notesArr = this.state.notesItemsArray;
    var notesJson = {};

    notesArr.forEach(function(i) {
      notesJson[i.key] = i.value;
    });

    var notes = JSON.stringify(notesJson);
    var data = new Blob([notes], {type: 'application/json'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (jsonFile !== null) {
      window.URL.revokeObjectURL(jsonFile);
    }

    jsonFile = window.URL.createObjectURL(data);
    return jsonFile;
  },
  /*
    Function: checkFile
    Purpose: Show the message if the notes is empty
    Parameters: none
    Return value: none
  */
  checkFile: function() {
    var generateFile = document.getElementById("saveBtnLink");
    if (!generateFile.href) {
      alert("No file to download");
    }
  },

  /* General functions */
  /*
    Function: removeFirstDot
    Purpose: Hide the first notes dot
    Parameters: none
    Return value: none
  */
  removeFirstDot: function() {
    var notesDotDiv = document.getElementsByClassName("notesDot");
    notesDotDiv[0].style.left = -100 + 'px';
    notesDotDiv[0].style.top = -100 + 'px';
  },
  /*
    Function: getMousePosX
    Purpose: Get the X position of the mouse relative to the image
    Parameters: X position of the mouse
    Return value: X position relative to the image
  */
  getMousePosX: function(pageX) {
    var imageDiv = document.getElementById("image-container");
    var offsetLeft = imageDiv.offsetLeft;
    return pageX - offsetLeft;
  },
  /*
    Function: getMousePosY
    Purpose: Get the Y position of the mouse relative to the image
    Parameters: Y position of the mouse
    Return value: Y position relative to the image
  */
  getMousePosY: function(pageY) {
    var imageDiv = document.getElementById("image-container");
    var offsetTop = imageDiv.offsetTop;
    return pageY - offsetTop;
  },
  render: function() {
    if (this.state.allowAddNotes) {
      var showCross = "showCross";
    }
    if (this.state.showNotesDot) {
      var showNotesDot = true;
    }
    
    return (
      <div>
        <form name="uploadForm">
          <input type="file" onChange={this.handleImageChange} />
        </form>
        
        <div id="image-container">
          {/*<img id="uploadedImage" className={showCross} src="img/screenshot.png" onClick={this.handleImageClick} />*/}

          <img id="uploadedImage" className={showCross} src={this.state.imagePreviewUrl} onClick={this.handleImageClick} />
          
          <NotesDot currentIndex={this.state.notesItemsArray.length} showInputBox={this.showInputBox} dotsDrag={this.removeInputBox} newDotsPos={this.setNewDotsPos} rightClick={this.showDeleteNote} removeDeleteNote={this.removeDeleteNote} dotDraggable="false" />

          {this.state.notesItemsArray.map(function(object, index) {
            return <NotesDot key={index} object={object} showInputBox={this.showInputBox} dotsDrag={this.removeInputBox} newDotsPos={this.setNewDotsPos} rightClick={this.showDeleteNote} removeDeleteNote={this.removeDeleteNote} currentIndex={index} dotDraggable="true" />;
          }, this)}

          <NotesItem ref="notesItem" notesItem={this.state} addNotes={this.addNotes} editClick={this.showInputForm} cancelClick={this.hideInputForm} />

          <DeleteNote notesItem={this.state} hideDeleteNote={this.removeDeleteNote} />
        </div>

        <div id="modalWindow"></div>
        <div id="modalBox">
          <div className="title">Delete this entry?</div>
          <div className="body">Deleted entry cannot be restored.</div>
          <div className="button-group">
            <button type="button" className="btn button cancel-btn" onClick={this.cancelDelete}>CANCEL</button>
            <button type="button" className="btn button delete-btn" onClick={this.removeNotes}>DELETE</button>
          </div>
        </div>
        
        <button type="button" id="plusBtn" className="btn btn-default" onClick={this.addNotesBtn}>
          <span className="glyphicon glyphicon-plus"></span>
        </button>

        <button type="button" id="eyesBtn" className="btn btn-default" onClick={this.toggleNotesDot}>
          { this.state.showNotesDot ? <span className="glyphicon glyphicon-eye-open"></span> : <span className="glyphicon glyphicon-eye-close"></span> }
        </button>

        <button type="button" id="saveBtn" className="btn btn-default" onClick={this.checkFile}>
          <a id="saveBtnLink" download="key_value.json"><span className="glyphicon glyphicon-save-file"></span></a>
        </button>
      </div>
    );
  }
});

module.exports = Upload;