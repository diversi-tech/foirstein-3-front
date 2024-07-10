import React, { useState, useEffect } from "react";
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
  Typography,
  Box,
  styled,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import tagStore from "../../store/tag-store";
import TagAdd from "./tag-add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TagStore from "../../store/tag-store";
import Fields_rtl from "../fields_rtl";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
}));

const StickyTableRow = styled(TableRow)({
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: "#FFFFFF",
});

const TagList = observer(() => {
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);

  useEffect(() => {
    tagStore.fetchTag();
  }, []);

  const dialogOpen = (dialogType) => {
    switch (dialogType) {
      case "deleteOpen":
        setDeleteOpen(true);
        break;
      case "editOpen":
        setEditOpen(true);
        break;
      default:
        break;
    }
  };

  const dialogClose = (dialogType) => {
    switch (dialogType) {
      case "deleteOpen":
        setDeleteOpen(false);
        break;
      case "editOpen":
        setEditOpen(false);
        break;
      default:
        break;
    }
  };

  const tagDelete = async () => {
    if (deleteItem) {
      tagStore.deleteTag(deleteItem.id);
      dialogClose("deleteOpen");
    }
  };

  const tagEdit = async () => {
    if (editItem.name.length < 2 || editItem.name === "") {
      setShowValidation(true); // Show validation message if conditions not met
      return;
    }
    await tagStore.updateTag(editItem.id, { name: editItem.name });
    dialogClose("editOpen");
  };

  const tagAdd = () => {
    setIsAddTagOpen(true);
    tagStore.message = "";
  };

  return (
    <Grid
      container
      justifyContent="center"
      style={{ marginTop: "20px", direction: "rtl" }}
    >
      <Grid item xs={12} md={8} lg={6}>
        <Paper elevation={3}>
          <Box padding={2}>
            <Typography variant="h5" component="h2" align="center" gutterBottom>
              -תגים-
            </Typography>
            <TableContainer style={{ maxHeight: 450, overflow: "auto" }}>
              <Table aria-label="תגים">
                <TableBody>
                  {/* כותרות העמודות */}
                  <StickyTableRow>
                    <StyledTableCell>שם</StyledTableCell>
                    <StyledTableCell>עריכה</StyledTableCell>
                    <StyledTableCell>מחיקה</StyledTableCell>
                  </StickyTableRow>
                  {/* תוכן הטבלה */}
                  {tagStore.tagList.map((row) => (
                    <TableRow key={row.id}>
                      <StyledTableCell>{row.name}</StyledTableCell>
                      <StyledTableCell>
                        <Button
                          onClick={() => {
                            setEditItem(row);
                            dialogOpen("editOpen");
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          onClick={() => {
                            setDeleteItem(row);
                            dialogOpen("deleteOpen");
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box textAlign="center" marginTop={3}>
              <Button variant="contained" color="primary" onClick={tagAdd}>
                <AddCircleOutlineIcon />
                יצירת תג חדש
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* dialog edit */}
      <Dialog open={editOpen} maxWidth="sm" dir="rtl">
        <DialogTitle>{editItem && `עריכת #${editItem.id}`}</DialogTitle>
        <Fields_rtl>
          <DialogContent dividers dir="rtl">
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="שם"
              type="text"
              value={editItem ? editItem.name : ""}
              onChange={(e) => {
                setEditItem({ ...editItem, name: e.target.value }),
                  setShowValidation(false);
              }}
              error={showValidation}
              helperText={showValidation ? "השם חייב להכיל לפחות 2 תווים" : ""}
            />
          </DialogContent>
        </Fields_rtl>
        <DialogActions>
          <Button onClick={() => dialogClose("editOpen")}>ביטול</Button>
          <Button onClick={tagEdit} color="primary">
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog delete */}
      <Dialog open={deleteOpen} maxWidth="xs" dir="rtl">
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק את הפריט הזה?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dialogClose("deleteOpen")} color="primary">
            ביטול
          </Button>
          <Button onClick={tagDelete}>מחיקה</Button>
        </DialogActions>
      </Dialog>
      {isAddTagOpen && <TagAdd onClose={() => setIsAddTagOpen(false)} />}
    </Grid>
  );
});

export default TagList;
