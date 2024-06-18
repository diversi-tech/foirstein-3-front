import React, { Component } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import OndemandVideoRoundedIcon from "@mui/icons-material/OndemandVideoRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PhotoRoundedIcon from "@mui/icons-material/PhotoRounded";
class Open extends Component {
  state = {};
  //This function creates an object that contains the file selected by the button
  handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      this.state.file = file;
      console.log("file name: ",this.state.file.name);
      console.log("file type: " + this.state.file.type);
    } else {
      console.log("לא נבחר קובץ");
    }
  };

  render() {
    return (
      <React.Fragment>
        <h1>hello to digital libary</h1>

        <Box sx={{ width: 500, textAlign: "center" }}>
          <BottomNavigation
            showLabels
            value="תמונות"
            // onChange={(event, newValue) => {
            //   setValue(newValue);
            // }}
          >
            <BottomNavigationAction
              label="תמונות"
              icon={<PhotoRoundedIcon />}
            />
            <BottomNavigationAction
              label="סרטונים"
              icon={<OndemandVideoRoundedIcon />}
            />
            <BottomNavigationAction
              label="קיבצי טקסט"
              icon={<DescriptionRoundedIcon />}
            />
          </BottomNavigation>
        </Box>
        <Button variant="outlined" size="medium">
          להוספת קובץ
          <input type="file" onChange={this.handleFileChange} />
        </Button>
      </React.Fragment>
    );
  }
}

export default Open;
