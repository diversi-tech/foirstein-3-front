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
  List,
  ListItem,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TagAdd from "./tag-add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import TagStore from "../../store/tag-store";
import Fields_rtl from "./fields_rtl";

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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemsUsingTag, setItemsUsingTag] = useState([]);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);

  useEffect(() => {
    TagStore.fetchTag();
  }, []);
  useEffect(() => {
    if (deleteItem !== null) {
      dialogOpen("deleteOpen");
    }
  }, [deleteItem]);

  const dialogOpen = async (dialogType) => {
    switch (dialogType) {
      case "deleteOpen":
          const itemsUsingTag = await TagStore.checkItemsUsingTag(deleteItem.id);
          console.log(itemsUsingTag.length);
          if (itemsUsingTag.length > 0) {
            setItemsUsingTag(itemsUsingTag);
            setConfirmDeleteOpen(true);
          } else {
            setDeleteOpen(true);
          }
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
        setConfirmDeleteOpen(false);
        break;
      case "editOpen":
        setEditOpen(false);
        break;
      case "confirmDeleteOpen":
        setConfirmDeleteOpen(false);
        break;
      default:
        break;
    }
  };

  const tagDelete = async () => {
    if (deleteItem) {
      TagStore.deleteTag(deleteItem.id);
      dialogClose("deleteOpen");
    }
  };

  const tagEdit = async () => {
    if (editItem.name.length < 2 || editItem.name === "") {
      setShowValidation(true); // Show validation message if conditions not met
      return;
    }
    await TagStore.updateTag(editItem.id, { name: editItem.name });
    dialogClose("editOpen");
  };

  const tagAdd = () => {
    setIsAddTagOpen(true);
    TagStore.message = "";
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
            {/* <Typography variant="h5" component="h2" align="center" gutterBottom>
              -תגים-
            </Typography> */}
            <Box textAlign="center" marginTop={3}>
              <Button variant="contained" color="primary" onClick={tagAdd}>
                <AddCircleOutlineIcon />
                יצירת תג חדש
              </Button>
            </Box>
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
                  {TagStore.tagList.map((row) => (
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

      {/* Confirmation dialog */}
      <Dialog open={confirmDeleteOpen} maxWidth="xs" dir="rtl">
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <Typography>התג הזה משויך לפריטים הבאים:</Typography>
          <Box sx={{ maxHeight: 200, overflow: 'auto', padding: 1, border: '1px solid #ddd' }}>
          <List>
            {itemsUsingTag.map((item) => (
              <ListItem key={item.id}><ArrowLeftIcon/> {item.title}</ListItem>
            ))}
          </List>
        </Box>
          <Typography>האם אתה בטוח שברצונך למחוק את התג הזה?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            ביטול
          </Button>
          <Button onClick={tagDelete} color="primary">
            מחק בכל זאת
          </Button>
        </DialogActions>
      </Dialog>
      {isAddTagOpen && <TagAdd onClose={() => setIsAddTagOpen(false)} />}
    </Grid>
  );
});

export default TagList;
