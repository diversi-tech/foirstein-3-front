import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import itemStore from "../../store/item-store";
import ItemSearch from "./item-search";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import theme from '../tag/fields_rtl'
import { cacheRtl } from "../tag/fields_rtl";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@emotion/react";
import Swal from 'sweetalert2'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, Button, useMediaQuery, useTheme, Chip, Box,
  Stack, Checkbox, Grid, Tooltip, Collapse, PaginationItem, Typography,
} from "@mui/material";
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ItemEdit from "./item-edit";
import tagStore from "../../store/tag-store";
import ItemAdd from "./item-add";
import { styled } from "@mui/material/styles";
import "./item.css";
import { blue, pink } from "@mui/material/colors";
import './item.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconSelectTags from "./SelectTags";


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
      fontSize: "0.8rem",
    },
  },

}))

const ItemList = observer(() => {

  const classes = useStyles(); // השתמש בסגנונות של useStyles

  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteTag, setDeleteTag] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [sendItem, setSendItem] = useState(false);
  const [sendTag, setSendTag] = useState(false);
  const [deleteTagOpen, setDeleteTagOpen] = useState(false);
  const [deleteMultieItems, setDeleteMultieItems] = useState(false);
  const [openRows, setOpenRows] = useState({});
  const [tagsList, setTagsList] = useState([]);


  useEffect(() => {
    itemStore.fetchMedia();
    tagStore.fetchTag();
  }, []);

  useEffect(() => {
    setTagsList(tagStore.getTagsList); // Make sure this returns an array of objects
  }, [tagStore.tagList]);

  useEffect(() => {
    setFilteredItems(filterItems(itemStore.mediaList));
  }, [itemStore.mediaList, filterType]);


  const handleDelete = (item) => {
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

  const handleExpandClick = (itemId) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [itemId]: !prevOpenRows[itemId]
    }));
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
    setAddTagOpen(false);
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

  const handleSearch = (searchTerm) => {
    const filtered = itemStore.mediaList.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filterItems(filtered));
  };

  const filterItems = (items) => {
    if (filterType === "all") {
      return items;
    }
    if (filterType == "book") {
      return items.filter((item) => !item.filePath.includes("https"))
    }
    console.log("file");
    const y1 = items.filter((item) => item.filePath.includes("https"));
    return items.filter((item) => item.filePath.includes("https"));
  };

  // const handleAddTagsToItems = (tags) => {
  //   tags.map(async (tagId) => {
  //     selectedItems.map(async (itemId) => {
  //       try {
  //         debugger
  //         await itemStore.addItemTag(itemId, tagId);
  //         console.log("is add: "+itemStore.isAddItemTag)
  //         Swal.fire({
  //           title: "נוסף בהצלחה",
  //           text: "התג.ים נוסף בהצלחה",
  //           icon: "success",
  //           showConfirmButton: false,
  //           timer: 1500
  //         });
  //         // if (itemStore.isAddItemTag === true) {

  //         // }
  //         // else
  //         // console.log("error add")
  //         setSelectedItems([]);
  //       }
  //       catch (error) {
  //         console.log("fail in add itemtag: " + error)
  //         Swal.fire({
  //           title: "שגיאה",
  //           text: "התרחשה שגיאה בעת מחיקת הפריט",
  //           icon: "error",
  //           showConfirmButton: false,
  //           timer: 1500
  //         });
  //       }
  //     })
  //   })
  // }

  const handleAddTagsToItems = async (tags) => {
    // משתנים לשמירה על תוצאות ההוספות
    let successfulAdds = [];
    let failedAdds = [];

    const promises = tags.flatMap((tagId) =>
      selectedItems.map(async (itemId) => {
        const item = filteredItems.find(item => item.id === itemId);
        const tag = tagsList.find(tag => tag.id === tagId);
        console.log("item: "+JSON.stringify(item))
        console.log("tag"+JSON.stringify(tag))
        console.log("tags: "+JSON.stringify(tagsList))
        try {
          debugger;
          // קריאה לפונקציה addItemTag
          await itemStore.addItemTag(itemId, tagId);
          console.log("is add: " + itemStore.isAddItemTag);

          if (itemStore.isAddItemTag) {
            successfulAdds.push({ item, tag });
          } else {
            failedAdds.push({ item, tag });
          }
          console.log("suc: "+successfulAdds)
          console.log("fail: "+failedAdds)
        } catch (error) {
          console.log("fail in add itemtag: " + error);
          failedAdds.push({ item, tag });
        }
      })
    );

    try {
      // המתן לסיום כל ההבטחות
      await Promise.all(promises);
      const successMessages = successfulAdds.map(({ item, tag }) =>
          `<p>התג "${tag.name}" נוסף לפריט "${item.title}" בהצלחה</p>`
      ).join('');

      // בניית הודעת שגיאה
      const errorMessages = failedAdds.map(({ item, tag }) =>
          `<p>הוספת התג "${tag.name}" לפריט "${item.title}" נכשלה</p>`
      ).join('');

      // בניית הטקסט לדיאלוג
      const finalMessage = `${successMessages}${successMessages && errorMessages ? '<br><br>' : ''}${errorMessages}`;

      // הצגת הודעת הצלחה או שגיאה
      Swal.fire({
          title: "תוצאות ההוספות",
          html: finalMessage || "לא היו שינויים.",
          icon: successfulAdds.length > 0 ? "success" : "error",
          showConfirmButton: true
      });

      // ניקוי הרשימה שנבחרה
      setSelectedItems([]);
  } catch (error) {
      console.log("fail in handleAddTagsToItems: " + error);
  }
};

  return (
    <>
      <div className="itemListDiv">
        <h2 className={classes.title}>רשימת קבצים</h2>
        <Grid container spacing={2} sx={{ backgroundColor: '#0D1E46', padding: 2 }}>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{
              width: '100%',
              maxWidth: 600,
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFD700',
              },
              '& .MuiTab-root': {
                color: '#dcdcdc',
                '&.Mui-selected': {
                  color: '#FFD700',
                }
              },
              display: 'flex',
              justifyContent: 'center',  // מרכז אופקית
              alignItems: 'center',      // מרכז אנכית 
            }}
            >
              <Tabs
                onChange={(e, newValue) => {
                  setFilterType(newValue);
                }}
                value={filterType}
                aria-label="Tabs where selection follows focus"
                selectionFollowsFocus
              >
                <Tab label="הכל" value="all" />
                <Tab label="ספרים" value="book" />
                <Tab label="קבצים" value="file" />
              </Tabs>
            </Box>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>
                <ItemSearch onSearch={handleSearch} />
              </ThemeProvider>
            </CacheProvider>
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table stickyHeader aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
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
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                      כותרת
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                      תיאור
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                      קטגוריה
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                      מחבר
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                      שנת הוצאה
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                      סטטוס
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                      מדף/קובץ
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                      פעולה
                    </TableCell>
                    <TableCell align="right" className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                      תגית
                    </TableCell>
                    <TableCell className={classes.headerCell} style={{ wordWrap: "break-word" }}>
                      <Grid container>
                        <Button
                          onClick={
                            selectedItems.length > 0
                              ? handleDeleteSelectedItems
                              : handleClickAdd
                          }
                          className={classes.addButton}
                        >
                          {selectedItems.length > 0 ? (
                            <Tooltip title="למחיקת פריטים מרובים" arrow>
                              <DeleteIcon />
                            </Tooltip>
                          ) : (
                            <Tooltip title="להוספת פריט חדש" arrow>
                              <AddIcon />
                            </Tooltip>
                          )}
                        </Button>
                        {selectedItems.length > 0 && (
                          <IconSelectTags handleAddItemTag={handleAddTagsToItems} />
                        )}
                      </Grid>

                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((item) => (
                    <React.Fragment key={item.id}>
                      <TableRow key={item.id} className={classes.tableRow}>
                        <TableCell align="right" className={classes.tableCell} style={{ wordWrap: "break-word" }}>
                          <Checkbox
                            color="primary"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item)}
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <Tooltip title={openRows[item.id] ? "סגור" : "פתח"}>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => handleExpandClick(item.id)}
                            >
                              {openRows[item.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        {!item.filePath.includes("https") ? (
                          <TableCell align="center" className={classes.tableCell} style={{ wordWrap: "break-word" }}>
                            <MenuBookRoundedIcon sx={{ color: '#468585' }} ></MenuBookRoundedIcon>
                          </TableCell>
                        ) : (
                          <TableCell align="center" className={classes.tableCell} style={{ wordWrap: "break-word" }}>
                            <TextSnippetOutlinedIcon sx={{ color: '#468585' }}></TextSnippetOutlinedIcon>
                          </TableCell>
                        )}
                        <TableCell align="right" className={classes.tableCell} style={{ wordWrap: "break-word" }}>
                          {item.title}
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell} style={{ wordWrap: "break-word" }}>
                          {item.description}
                        </TableCell>
                        <TableCell align="rifht" className={classes.tableCell} style={{ wordWrap: "break-word" }}>
                          {item.category}
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell} style={{ wordWrap: "break-word" }}>
                          {item.author}
                        </TableCell>
                        {!item.filePath.includes("https") ? (
                          <TableCell align="center" className={classes.tableCell} color="info" style={{ wordWrap: "break-word" }}>
                            {item.publishingYear}
                          </TableCell>
                        ) : (
                          <TableCell align="right" className={classes.tableCell} style={{ wordWrap: "break-word" }}>
                            --
                          </TableCell>
                        )}
                        <TableCell
                          align="right"
                          className={classes.tableCell}
                          style={{ color: item.isApproved ? "#2C6B2F" : "#E57373", wordWrap: "break-word" }}
                        >
                          {item.isApproved ? "מאושר" : "ממתין לאישור"}
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell} style={{ wordWrap: "break-word" }}>
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
                        <TableCell align="right" className={classes.tableCell} style={{ wordWrap: "break-word" }}>
                          <Tooltip title="עריכה" arrow>
                            <IconButton onClick={() => handleClickEdit(item)}>
                              <EditIcon style={{ color: "#334970" }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="מחיקה" arrow>
                            <IconButton onClick={() => handleDelete(item)}>
                              <DeleteIcon style={{ color: "#334970" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell} style={{ wordWrap: "break-word" }}>
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
                                    sx={{
                                      '& .MuiChip-deleteIcon': {
                                        marginLeft: '5px',
                                      },
                                    }}
                                  />
                                );
                              }
                              return null;
                            })}
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                          <Collapse in={openRows[item.id]} timeout="auto" unmountOnExit>
                            <Box display='flex' dir='rtl' margin={1}>
                              {!item.filePath.includes('https') &&
                                <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>מספר עותקים: {item.numOfCopy}</Typography>
                              }
                              {!item.filePath.includes('https') &&
                                <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>עותקים שניתנים להשאלה: {item.copiesThatCanBeBorrowed}</Typography>
                              }
                              {!item.filePath.includes('https') &&
                                <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>מספר ימי השאלה:{item.numberOfDaysOfQuestion}</Typography>
                              }
                              <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>מהדורה: {item.edition}</Typography>
                              <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>סידרה: {item.series}</Typography>
                              <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>מספר בסידרה: {item.numOfSeries}</Typography>
                              <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>מוציא לאור: {item.publisher}</Typography>
                              <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>שנה עברית: {item.hebrewPublicationYear}</Typography>
                              <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>שפה: {item.language}</Typography>
                              <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>הערה: {item.note}</Typography>
                              <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>רמה: {item.itemLevel}</Typography>
                              <Typography variant="body1" style={{ marginRight: "10px" }} dir='rtl'>חומר נלווה: {item.accompanyingMaterial}</Typography>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}

                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>
      {editedItem && <ItemEdit mediaItem={editedItem} onClose={handleClose} />}
      {itemStore.add && <ItemAdd />}
    </>
  );
});

export default ItemList;

