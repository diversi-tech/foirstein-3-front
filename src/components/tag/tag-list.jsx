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
  Stack,
  Pagination,
  PaginationItem,
  List,
  ListItem,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TagStore from "../../store/tag-store";
import TagAdd from "./tag-add";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
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
  const [sortDirection, setSortDirection] = useState("asc");
  const [isSorted, setIsSorted] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      await TagStore.fetchTag();
      setIsSorted(false);
    };
    fetchData();
  }, []);

  const toggleSort = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    setIsSorted(newDirection === "desc");
    window.scrollTo(0, 0);
  };

  let displayedTags = [...TagStore.tagList];
  if (isSorted) {
    displayedTags.sort((a, b) => a.name.localeCompare(b.name));
  }

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const dialogOpen = async (dialogType, item) => {
    switch (dialogType) {
      case "deleteOpen":
        setDeleteItem(item);
        const itemsUsingTag = await TagStore.checkItemsUsingTag(item.id);
        if (itemsUsingTag.length > 0) {
          setItemsUsingTag(itemsUsingTag);
          setConfirmDeleteOpen(true);
        } else {
          setDeleteOpen(true);
        }
        break;
      case "editOpen":
        setEditItem(item);
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
        setDeleteItem(null);
        break;
      case "editOpen":
        setEditOpen(false);
        setEditItem(null);
        break;
      case "confirmDeleteOpen":
        setConfirmDeleteOpen(false);
        setDeleteItem(null);
        break;
      default:
        break;
    }
  };

  const tagDelete = async () => {
    if (deleteItem) {
      await TagStore.deleteTag(deleteItem.id);
      dialogClose("deleteOpen");
      dialogClose("confirmDeleteOpen")
    }
  };

  const tagEdit = async () => {
    if (editItem.name.length < 2 || editItem.name === "") {
      setShowValidation(true);
      return;
    }
    await TagStore.updateTag(editItem.id, { name: editItem.name });
    dialogClose("editOpen");
  };

  const tagAdd = () => {
    setIsAddTagOpen(true);
    TagStore.message = "";
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentTags = displayedTags.slice(startIndex, endIndex);

  return (
    <Grid
      container
      justifyContent="center"
      style={{ marginTop: "20px", direction: "rtl" }}
    >
      <Grid item xs={12} md={8} lg={6}>
        <Paper elevation={3}>
          <Box padding={2}>
            <Box textAlign="center" marginTop={3}>
              <Button variant="contained" color="primary" onClick={tagAdd}>
                <AddCircleOutlineIcon />
                יצירת תג חדש
              </Button>
            </Box>
            <TableContainer>
              <Table aria-label="תגים">
                <TableBody>
                  <StickyTableRow>
                    <StyledTableCell
                      onClick={toggleSort}
                      style={{ cursor: "pointer" }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <span>שם</span>
                        {sortDirection === "asc" ? (
                          <ArrowDropUpIcon style={{ marginLeft: 4 }} />
                        ) : (
                          <ArrowDropDownIcon style={{ marginLeft: 4 }} />
                        )}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>עריכה</StyledTableCell>
                    <StyledTableCell>מחיקה</StyledTableCell>
                  </StickyTableRow>
                  {currentTags.map((row) => (
                    <TableRow key={row.id}>
                      <StyledTableCell textAlign="center">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          color="#0D1E46"
                          onClick={() => dialogOpen("editOpen", row)}
                        >
                          <EditIcon />
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          onClick={() => dialogOpen("deleteOpen", row)}
                        >
                          <DeleteIcon />
                        </Button>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box textAlign="center" marginTop={2}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Pagination
                  dir="ltr"
                  count={Math.ceil(displayedTags.length / rowsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  variant="outlined"
                  color="primary"
                  shape="rounded"
                  renderItem={(item) => <PaginationItem {...item} />}
                />
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Dialog for editing */}
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
                setEditItem({ ...editItem, name: e.target.value });
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

      {/* Dialog for deleting */}
      <Dialog open={deleteOpen} maxWidth="xs" dir="rtl">
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <Typography>{`האם אתה בטוח שברצונך למחוק את התג "${
            deleteItem ? deleteItem.name : ""
          }"?`}</Typography>
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
