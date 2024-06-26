import  { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import mediaStore from '../../store/mediaStore';
// import bookStore from '../../store/bookStore';

function Success() {

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    // onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{color: "red"}}>שגיאה</DialogTitle>
      <DialogContent>
        <DialogContentText>
         {mediaStore.message}
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
