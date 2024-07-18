import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import itemStore from "../../store/item-store";
import ItemSearch from "./item-search";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  useMediaQuery,
  useTheme,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Stack,
  Checkbox,
  Grid,
  Tooltip,
  PaginationItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ItemEdit from "./item-edit";
import tagStore from "../../store/tag-store";
import ItemAdd from "./item-add";
import Swal from "sweetalert2";
import { styled } from "@mui/material/styles";
import { blue, pink } from "@mui/material/colors";
import './item.css';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import Pagination from "@mui/material/Pagination"; // Import Pagination
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const useStyles = styled((theme) => ({
  title: {
    backgroundColor: "#468585", // צבע רקע שחור לכותרת
    color: "white", // צבע טקסט לכותרת
    padding: theme.spacing(2), // מרווחים בתוך הכותרת
    textAlign: "center", // מרכז הטקסט בתוך הכותרת
  },
  addButton: {
    backgroundColor: "black", // צבע רקע שחור לכפתור ההוספה
    color: "white", // צבע טקסט לכפתור ההוספה
    "&:hover": {
      backgroundColor: "darkgrey", // צבע רקע כאשר העכבר על הכפתור
    },
  },
  headerCell: {
    backgroundColor: "black", // צבע רקע שחור לכותרת
    color: "white", // צבע טקסט לכותרת
  },
  tableContainer: {
    maxHeight: 470,
    overflow: "auto",
  },
  tableRow: {
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  },
  tableCell: {
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0.5),
    },
  },
}));

const ItemList = observer(() => {
  const classes = useStyles(); // השתמש בסגנונות של useStyles

  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteTag, setDeleteTag] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [sendItem, setSendItem] = useState(false);
  const [sendTag, setSendTag] = useState(false);
  const [deleteTagOpen, setDeleteTagOpen] = useState(false);
  const [deleteMultieItems, setDeleteMultieItems] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    itemStore.fetchMedia();
  }, []);

  useEffect(() => {
    setFilteredItems(filterItems(itemStore.mediaList));
  }, [itemStore.mediaList, filterType]);

const handleDelete = async (item) => {
  setDeleteItem(item);
  Swal.fire({
      title: "האם אתה בטוח שברצונך למחוק",
      text: "לא תוכל לשחזר",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: `ביטול`,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "כן, מחק"
  }).then(async (result) => {
      if (result.isConfirmed) {
          try {
              await itemStore.deleteMedia(item.id);
              Swal.fire({
                  title: "נמחק בהצלחה",
                  text: "הפריט נמחק בהצלחה",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500
              });
              // עדכן את רשימת הפריטים אחרי מחיקה
              itemStore.fetchMedia();
          } catch (error) {
              Swal.fire({
                  title: "שגיאה",
                  text: "התרחשה שגיאה בעת מחיקת הפריט",
                  icon: "error",
                  showConfirmButton: false,
                  timer: 1500
              });
              console.error("Error deleting item:", error);
          }
      } else if (result.isDenied) {
          Swal.fire({
              title: "בוטל",
              text: "הפריט לא נמחק",
              icon: "info",
              showConfirmButton: false,
              timer: 1500
          });
      }
  });
};

const handleDeleteSelectedItems = async () => {
  Swal.fire({
      title: "האם אתה בטוח שברצונך למחוק פריטים נבחרים",
      text: "לא תוכל לשחזר אותם",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: `ביטול`,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "כן, מחק"
  }).then(async (result) => {
      if (result.isConfirmed) {
          try {
              await Promise.all(selectedItems.map(async (itemId) => {
                  await itemStore.deleteMedia(itemId);
              }));
              Swal.fire({
                  title: "נמחק בהצלחה",
                  text: "הפריטים נמחקו בהצלחה",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500
              });
              setSelectedItems([]);
              itemStore.fetchMedia();
          } catch (error) {
              Swal.fire({
                  title: "שגיאה",
                  text: "התרחשה שגיאה בעת מחיקת הפריטים",
                  icon: "error",
                  showConfirmButton: false,
                  timer: 1500
              });
              console.error('Error deleting selected items:', error);
          }
      } else if (result.isDenied) {
          Swal.fire({
              title: "בוטל",
              text: "הפריטים לא נמחקו",
              icon: "info",
              showConfirmButton: false,
              timer: 1500
          });
      }
  });
};

    const handleDeleteTag = (item, tag) => {
      setDeleteTag(tag);
      setDeleteItem(item);
      Swal.fire({
          title: "האם אתה בטוח שברצונך למחוק את התג",
          text: "התג יימחק",
          icon: "warning",
          showDenyButton: true,
          denyButtonText: `ביטול`,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "כן, מחק"
      }).then(async (result) => {
          if (result.isConfirmed) {
              await itemStore.deleteTag(item.id, tag.id);
              setDeleteTagOpen(false);
              Swal.fire({
                  title: "נמחק בהצלחה",
                  text: "התג נמחק בהצלחה",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500
              });
          } else if (result.isDenied) {
              Swal.fire({
                  title: "בוטל",
                  text: "התג לא נמחק",
                  icon: "info",
                  showConfirmButton: false,
                  timer: 1500
              });
          }
      });
  };

  const handleClickAdd = () => {
    itemStore.add = true;
  };

  const handleClickEdit = (item) => {
    setEditedItem(item);
    setEditOpen(true);
  };

  const handleClose = () => {
    setSendItem(false);
    setSendTag(false);
    setDeleteOpen(false);
    setDeleteItem(null);
    setDeleteTag(null);
    setEditOpen(false);
    setEditedItem(null);
    setDeleteTagOpen(false);
  };

  const handleSelectItem = (item) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item.id)) {
        return prevSelectedItems.filter((id) => id !== item.id);
      } else {
        return [...prevSelectedItems, item.id];
      }
    });
  };

    const handleSearch = (searchTerm) => {
        const filtered = itemStore.mediaList.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filterItems(filtered));
  };

  const filterItems = (items) => {
    if (filterType === "all") {
        console.log(items);
      return items;
    }
    if(filterType=="book"){
        console.log("book");

        return items.filter((item)=>!item.filePath.includes("https"))
    }
    console.log("file");
    const y1=items.filter((item)=>item.filePath.includes("https"));
    console.log(y1);
    return items.filter((item)=>item.filePath.includes("https"));
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  return (
    <>
      <div className="itemListDiv">
        <h2 className={classes.title}>רשימת קבצים</h2>
        <ItemSearch onSearch={handleSearch} />
        <RadioGroup
          aria-label="filter-type"
          name="filter-type"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value)}}
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",  
                justifyContent: "center", 
                margin: "10px 0",
                width: "100%",
              }}
        >
          <FormControlLabel value="all" control={<Radio />} label="הכל" />
          <FormControlLabel value="book" control={<Radio />} label="ספרים" />
          <FormControlLabel value="file" control={<Radio />} label="קבצים" />
        </RadioGroup>

        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="right" className={classes.headerCell}>
                      <Checkbox
                        indeterminate={
                          selectedItems.length > 0 &&
                          selectedItems.length < itemStore.mediaList.length
                        }
                        checked={
                          selectedItems.length === itemStore.mediaList.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(
                              itemStore.mediaList.map((item) => item.id)
                            );
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell}></TableCell>
                    <TableCell align="right" className={classes.headerCell}>
                      כותרת
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell}>
                      תיאור
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell}>
                      קטגוריה
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell}>
                      מחבר
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell}>
                      שנת הוצאה
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell}>
                      סטטוס
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell}>
                      מדף/קובץ
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell}>
                      פעולה
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell}>
                      תגית
                    </TableCell>
                    <TableCell className={classes.headerCell}>
                      <Button
                        onClick={
                          selectedItems.length > 0
                            ? handleDeleteSelectedItems
                            : handleClickAdd
                        }
                        className={classes.addButton}
                      >
                        {selectedItems.length > 0 ? (
                          <Tooltip title="למחיקת פריטים מרובים">
                            <DeleteIcon />
                          </Tooltip>
                        ) : (
                          <Tooltip title="להוספת פריט חדש" arrow>
                            <AddIcon />
                          </Tooltip>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id} className={classes.tableRow}>
                      <TableCell align="right" className={classes.tableCell}>
                        <Checkbox
                          color="primary"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item)}
                        />
                      </TableCell>
                      {!item.filePath.includes("https") ? (
                        <TableCell align="center" className={classes.tableCell}>
                          <MenuBookRoundedIcon sx={{ color: "#468585" }} />
                        </TableCell>
                      ) : (
                        <TableCell align="center" className={classes.tableCell}>
                          <TextSnippetOutlinedIcon sx={{ color: "#468585" }} />
                        </TableCell>
                      )}
                      <TableCell align="right" className={classes.tableCell}>
                        {item.title}
                      </TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        {item.description}
                      </TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        {item.category}
                      </TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        {item.author}
                      </TableCell>
                      {!item.filePath.includes("https") ? (
                        <TableCell align="center" className={classes.tableCell}>
                          {item.publishingYear}
                        </TableCell>
                      ) : (
                        <TableCell align="right" className={classes.tableCell}>
                          --
                        </TableCell>
                      )}
                      <TableCell align="right" className={classes.tableCell} style={{ color: item.isApproved ? "green" : "red" }}>
                        {item.isApproved ? "מאושר" : "ממתין לאישור"}
                      </TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        {item.filePath.includes("https") ? (
                          <a
                            href={item.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.title}

                          </a>
                        ) : (
                          item.filePath
                        )}
                      </TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        <IconButton onClick={() => handleClickEdit(item)}>
                          <EditIcon style={{ color: "#468585" }} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item)}>
                          <DeleteIcon style={{ color: "#50B498" }} />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        <Stack
                          direction="row"
                          style={{
                            flexWrap: "nowrap",
                            overflowX: "auto",
                            width: "200px",
                            color: "#A80B8BD",
                          }}
                        >
                          {item.tags.map((tagId) => {
                            const tag = tagStore.tagList.find(
                              (tag) => tag.id === tagId
                            );
                            if (tag) {
                              return (
                                <Chip
                                  key={tag.id}
                                  label={tag.name}
                                  style={{ color: "#9CDBA6" }}
                                  variant="outlined"
                                  onDelete={() => handleDeleteTag(item, tag)}
                                />
                              );
                            }
                            return null;
                          })}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
              <Pagination
                dir="ltr"
                count={Math.ceil(filteredItems.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                variant="outlined"
                color="primary"
                shape="rounded"
                renderItem={(item) => <PaginationItem {...item} />}
              />
            </Stack>
          </Grid>
        </Grid>
      </div>
      {editedItem && <ItemEdit mediaItem={editedItem} onClose={handleClose} />}
      {itemStore.add && <ItemAdd />}
    </>
  );
});

export default ItemList;
