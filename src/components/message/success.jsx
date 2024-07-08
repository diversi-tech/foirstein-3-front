import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import itemStore from '../../store/item-store';

export default function Success() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 3000);

    // Clean up the timer if the component unmounts before the timer completes
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    // onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>הצלחה</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {itemStore.message}
          {itemStore.isDelete = false}
          {console.log(itemStore.message)}
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