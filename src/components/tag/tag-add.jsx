import React, { useState } from "react";
import {
  Button,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Dialog,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import TagStore from "../../store/tag-store";

const TagAdd = ({ onClose }) => {
  const [addItem, setAddItem] = useState("");
  const [addOpen, setAddOpen] = useState(true);
  const [addAnother, setAddAnother] = useState(false); // State for checkbox

  const dialogClose = () => {
    setAddItem("");
    setAddOpen(false);
    onClose();
  };

  const tagAdd = async () => {
    if (addAnother) {
      TagStore.isMessage = true;
    }
    await TagStore.addTag({ name: addItem });
    if (addAnother) {
      TagStore.isMessage = false;
      setAddItem("");
    } else {
      dialogClose();
    }
  };

  return (
    <Dialog open={addOpen} maxWidth="sm" dir="rtl">
      <DialogTitle>הוספת תג חדש</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth>
          <TextField
            id="tagId"
            label="שם התג"
            variant="outlined"
            value={addItem}
            onChange={(e) => setAddItem(e.target.value)}
            error={addItem.length < 2 || addItem === ""}
            helperText={
              addItem === ""
                ? "שדה חובה"
                : addItem.length > 0 && addItem.length < 2
                ? "השם חייב להכיל לפחות 2 תווים"
                : ""
            }
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={addAnother}
              onChange={(e) => setAddAnother(e.target.checked)}
              color="primary"
            />
          }
          label="הוספת תג נוסף"
        />
        <DialogActions style={{display:"flex", justifyContent:"center"}}>
          {TagStore.message}
        </DialogActions>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialogClose}>ביטול</Button>
        <Button
          onClick={tagAdd}
          disabled={addItem === "" || addItem.length < 2}
        >
          הוספה
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagAdd;
