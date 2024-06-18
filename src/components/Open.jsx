import React, { Component } from "react";
import Button from "@mui/material/Button";

class Open extends Component {
  state = {
    selectedFile: null  // to store the selected file in the state variable
  };

  handleFileSelect = (file) => {
    this.setState({
      selectedFile: file  // Updating the state with the selected file
    });
  };  
  
  render() {
    return (
      <React.Fragment>
        <h1>hello to digital libary</h1>

        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Home</a>
                <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</a>
                <a class="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</a>
            </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">...</div>
            <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">...</div>
            <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">...</div>
        </div>

        <Button variant="outlined" size="medium">הוספה</Button>

        <div>
          <input type="file" onChange={(e) => this.handleFileSelect(e.target.files[0])} />
        </div>

      </React.Fragment>
    );
  }
}

export default Open;