import  { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import itemStore from '../../store/item-store';

export default function Failure() {

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
         {itemStore.message}
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