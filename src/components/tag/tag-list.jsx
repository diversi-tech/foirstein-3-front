import React, { useState } from "react";
import {
  Paper,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  TableContainer,
  Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import tagStore from "../../store/tag-store";

const tableStyle = {
  // width: "40%", // קבעתי את הרוחב של הטבלה ל־60% מרוחב העמודה
};

export default function TagList() {
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const [rows, setRows] = useState(tagStore.tagList);

  // פתיחת חלון
  const dialogOpen = (dialogType) => {
    switch(dialogType){
      case 'deleteOpen':
        setDeleteOpen(true);
        break;
      case 'editOpen':
        setEditOpen(true); // פתיחת דיאלוג עריכה
        break;
      case 'tagAdd':
        setAddOpen(true); // פתיחת דיאלוג הוספת תג
        break;
      default:
        break;
    }
  }

  // סגירת חלון
  const dialogClose = (dialogType) => {
    switch(dialogType){
      case 'deleteOpen':
        setDeleteOpen(false);
        break;
      case 'editOpen':
        setEditOpen(false); // סגירת דיאלוג עריכה
        break;
      default:
        break;
    }
  }

  // מחיקה
  const tagDelete = () => {
    if (deleteItem) {
      const updatedRows = rows.filter((r) => r.id !== deleteItem.id);
      setRows(updatedRows);
      // עדכון בסרבר את המחיקה
      dialogClose('deleteOpen');
    }
  }

  // עריכה
  const tagEdit = () => {
    // עריכה לסרבר
    dialogClose('editOpen');
  }

  // פתיחת הוספת תג
  const tagAdd = () => {
    setAddOpen(true);
  }

  return (
    <div className="divForm" style={{ direction: "rtl" }}>
      <Grid container spacing={1} justifyContent="center">
        {/* מרכז */}
        <Grid item xs={12} style={{ maxWidth: "100%" }}>
          {/* שוליים */}
          <TableContainer component={Paper} style={tableStyle}>
            <Table aria-label="simple table">
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell>
                      <Button onClick={() => {setEditItem(row); dialogOpen('editOpen')}}>
                        <EditIcon />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => {setDeleteItem(row); dialogOpen('deleteOpen')}}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={tagAdd}>הוספת תג</Button>
        </Grid>
      </Grid>

      {/* דיאלוג לעריכה */}
      <Dialog open={editOpen} onClose={() => dialogClose('editOpen')} style={{ direction: "rtl" }}>
        <DialogTitle>
          {`עריכת #${editItem.id}`}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="שם"
            value={editItem ? editItem.name : ""}
            fullWidth
            onChange={(e) =>
              setEditItem({ ...editItem, name: e.target.value })
            }
          />
          {editItem && !editItem.name ? (
            <Typography color="error">זהו שדה חובה</Typography>
          ) : editItem && editItem.name.length < 2 ? (
            <Typography color="error">השם חייב להכיל לפחות 2 תווים</Typography>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dialogClose('editOpen')}>ביטול</Button>
          <Button onClick={tagEdit}>שמור</Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג למחיקה */}
      <Dialog open={deleteOpen} onClose={() => dialogClose('deleteOpen')} style={{ direction: "rtl" }}>
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את הפריט הזה?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dialogClose('deleteOpen')} color="primary">
            ביטול
          </Button>
          <Button onClick={tagDelete} color="secondary">
            מחיקה
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג להוספת תג */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} style={{ direction: "rtl" }}>
        <DialogTitle>הוספת תג חדש</DialogTitle>
        <DialogContent>
          <TextField
            label="שם"
            fullWidth
            onChange={(e) => setRows([...rows, { id: rows.length + 1, name: e.target.value }])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>ביטול</Button>
          <Button onClick={() => setAddOpen(false)}>הוספה</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}