import * as React from "react";
import { useState } from "react";
import {
  Button,
  Paper,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormControl,
  Grid,
  Dialog,
} from "@mui/material";

export default function TagAdd() {
  const [addOpen, setAddOpen] = useState(true);
  const [addItem, setAddItem] = useState(null);

  const dialogClose = () => {
    setAddOpen(false);
  };

  const tagAdd = () => {
    tagStore.addTag(addItem); // Replace with actual logic to store the tag
    setAddItem(null);
    dialogClose();
  };

  return (
    <Dialog open={addOpen} style={{ direction: "rtl" }}>
      <DialogTitle>הוספת תג חדש</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <TextField
            id="tagId"
            label="שם התג"
            variant="outlined"
            onChange={(e) => setAddItem(e.target.value)}
            error={!addItem}
          />
          {!addItem && <Typography color="error">שדה חובה</Typography>}
          {addItem && addItem.length < 2 && (
            <Typography color="error">השם חייב להכיל לפחות 2 תווים</Typography>
          )}
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={dialogClose}>ביטול</Button>
        <Button onClick={tagAdd}>הוספה</Button>
      </DialogActions>
    </Dialog>
  );
}
