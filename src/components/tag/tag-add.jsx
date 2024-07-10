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
import Fields_rtl from '../fields_rtl';

const TagAdd = ({ onClose }) => {
  const [addItem, setAddItem] = useState("");
  const [addOpen, setAddOpen] = useState(true);
  const [addAnother, setAddAnother] = useState(false); // State for checkbox
  const [showValidation, setShowValidation] = useState(false); // State for validation message

  const dialogClose = () => {
    setAddItem("");
    setAddOpen(false);
    onClose();
  };

  const tagAdd = async () => {
    if (addItem.length < 2 || addItem === "") {
      setShowValidation(true); // Show validation message if conditions not met
      return;
    }
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
      <Fields_rtl>
        <DialogContent dividers dir="rtl">
          <FormControl fullWidth>
            <TextField
              id="tagId"
              label="שם התג"
              variant="outlined"
              value={addItem}
              onChange={(e) => {
                setAddItem(e.target.value);
                setShowValidation(false);
              }}
              error={showValidation}
              helperText={
                showValidation ? "השם חייב להכיל לפחות 2 תווים" : ""
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
          <DialogActions
            style={{ display: "flex", justifyContent: "center" }}
          >
            {TagStore.message}
          </DialogActions>
        </DialogContent>
      </Fields_rtl>
      <DialogActions>
        <Button onClick={dialogClose}>ביטול</Button>
        <Button onClick={tagAdd}>הוספה</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagAdd;