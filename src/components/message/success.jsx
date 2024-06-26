import  { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// import bookStore from '../../store/bookStore';
import mediaStore from '../../store/mediaStore';

function Success() {

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    // onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>הצלחה</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {mediaStore.message}
          {console.log(mediaStore.message)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Success;
