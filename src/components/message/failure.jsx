import  { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import itemStore from '../../store/item-store';

export default function Failure() {

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    },3000);

    // Clean up the timer if the component unmounts before the timer completes
    return () => clearTimeout(timer);
  }, []);
  
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    itemStore.isError = null
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