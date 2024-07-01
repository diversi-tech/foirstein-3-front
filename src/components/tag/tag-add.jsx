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
import tagStore from "../../store/tag-store";

export default function TagAdd() {
  const [addOpen, setAddOpen] = useState(true);
  const [addItem, setAddItem] = useState("");

  const dialogClose = () => {
    setAddOpen(false);
  };

  const tagAdd = () => {
    // פעולה שתשמור את התג במערכת הנתונים
    dialogClose();
  };

  return (
    <Dialog open={addOpen} onClose={dialogClose}>
      <div className="divForm" style={{ direction: "rtl" }}>
        <DialogTitle>הוספת תג חדש</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} justifyContent="flex-start">
            <Grid item xs={12}>
              <Paper elevation={3} style={{ padding: 20 }}>
                <FormControl fullWidth>
                  <TextField
                    id="tagId"
                    label="שם התג"
                    variant="outlined"
                    onChange={(e) => setAddItem(e.target.value)}
                    error={!addItem}
                  />
                  {!addItem && (
                    <Typography color="error">שדה חובה</Typography>
                  )}
                  {addItem && addItem.length < 2 && (
                    <Typography color="error">
                      השם חייב להכיל לפחות 2 תווים
                    </Typography>
                  )}
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={dialogClose}>ביטול</Button>
          <Button onClick={tagAdd} color="primary">
            הוספה
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
