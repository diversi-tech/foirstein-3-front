import React, { useState } from "react";
import {
  Button,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Dialog,
} from "@mui/material";
import TagStore from "../../store/tag-store";

const TagAdd = ({ onClose }) => {
  const [addItem, setAddItem] = useState("");
  const [addOpen, setAddOpen] = useState(true);

  const dialogClose = () => {
    setAddItem("");
    setAddOpen(false);
    onClose();
  };

  const tagAdd = () => {
    TagStore.addTag({ name: addItem });
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
            error={addItem.length < 2 && addItem !== ""}
            helperText={
              addItem === ""
                ? "שדה חובה"
                : addItem.length > 0 && addItem.length < 2
                ? "השם חייב להכיל לפחות 2 תווים"
                : ""
            }
          />
        </FormControl>
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
