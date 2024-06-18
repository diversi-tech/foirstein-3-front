import * as React from 'react';
import { useState } from "react";
import { observer } from "mobx-react-lite";
import bookStore from '../../store/bookStore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Select } from '@mui/material';
import {InputLabel} from '@mui/material';
// import { Dialog } from '@mui/material';

const FormBook = (observer(() => {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [tag, setTag] = useState();
  const [shelf, setShelf] = useState();

  // const handleClickOpen = () => {
  //   setOpen(true);
  // }

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpload = () =>{
    bookStore.addBookData(title, description, tag, shelf);
  }

  return (
    <div>
    <React.Fragment>
    {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            // const email = formJson.email;
            // console.log(email);
            handleClose();
          },
        }}
      /> */}
        <DialogTitle>Upload Book</DialogTitle>
        <DialogContent>
        <Typography gutterBottom>
          <TextField id="titleId" label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} /> <br />
          <TextField id="descId" label="Description" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} /> <br />
          {/* <TextField id="tagId" label="Tag" variant="outlined" type='select' value={tag} onChange={(e) => setTag(e.target.value)} /> <br /> */}
          <InputLabel id="demo-simple-select-label">Tag</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tag}
              label="Tag"
              onChange={(e) => setTag(e.target.value)}
            /> <br />
          <TextField id="shelfId" label="Shelf" type='number' variant="outlined" value={shelf} onChange={(e) => setShelf(e.target.value)} /> 

        </Typography>
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handleUpload}>Upload</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
    </React.Fragment>
    </div>

  );
}))
export default FormBook
