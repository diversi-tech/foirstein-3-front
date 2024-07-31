import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import itemStore from "../../store/item-store";
import tagStore from "../../store/tag-store";
import ItemEdit from "./item-edit";
import ItemAdd from "./item-add";
import { observer } from "mobx-react-lite";
import CategoryIcon from '@mui/icons-material/Category';
import ItemSearch from "./item-search";
import {
  IconButton, Tooltip, useTheme, Paper, Box, useMediaQuery, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Tabs, Tab, Checkbox, Stack, Pagination, PaginationItem,
  Chip, TableRow, TableCell, Collapse, Typography, Menu, MenuItem, CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import { CacheProvider } from "@emotion/react";
import Swal from "sweetalert2";
import { cacheRtl } from "../tag/fields_rtl";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import IconSelectTags from './SelectTags'
import CancelIcon from '@mui/icons-material/Cancel';

const DataTable = observer(() => {
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
  const [filterType, setFilterType] = useState("all");
  const [isSorted, setIsSorted] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const [openRows, setOpenRows] = useState({});
  const [tagsList, setTagsList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   itemStore.fetchMedia();
  //   tagStore.fetchTag();
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await itemStore.fetchMedia();
  //       await tagStore.fetchTag();
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   setTagsList(tagStore.getTagsList); // Make sure this returns an array of objects
  // }, [tagStore.tagList]);

  // useEffect(() => {
  //   setFilteredItems(filterItems(itemStore.mediaList));
  //   setPage(1);
  //   console.log("items:" + JSON.stringify(itemStore.mediaList));
  // }, [itemStore.mediaList, filterType]);

  // Fetch data and handle loading state
  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true); // Show loading spinner
      try {
        await Promise.all([itemStore.fetchMedia(), tagStore.fetchTag()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [itemStore, tagStore]); // Dependencies: triggers fetchData when itemStore or tagStore changes

  // Update tagsList when tagStore.tagList changes
  useEffect(() => {
    setTagsList(tagStore.getTagsList); // Make sure this returns an array of objects
  }, [tagStore.tagList]);

  // Update filteredItems when itemStore.mediaList or filterType changes
  useEffect(() => {
    const combinedItems = [...itemStore.mediaList, ...itemStore.mediaList2]; // שילוב שני המערכים
    setFilteredItems(filterItems(combinedItems));
    setPage(1);
    console.log("items:" + JSON.stringify(itemStore.mediaList));
}, [itemStore.mediaList,itemStore.mediaList2, filterType]);



  const handleChangePage = (event, value) => {
    setPage(value);
  };

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
      confirmButtonText: "כן, מחק",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {          
            await itemStore.deleteMedia(item.id);         
          Swal.fire({
            title: "נמחק בהצלחה",
            text: "הפריט נמחק בהצלחה",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          // עדכן את רשימת הפריטים אחרי מחיקה
          itemStore.fetchMedia();
        } catch (error) {
          Swal.fire({
            title: "שגיאה",
            text: "התרחשה שגיאה בעת מחיקת הפריט",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
          console.error("Error deleting item:", error);
        }
      } else if (result.isDenied) {
        Swal.fire({
          title: "בוטל",
          text: "הפריט לא נמחק",
          icon: "info",
          showConfirmButton: false,
          timer: 1500,
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
      confirmButtonText: "כן, מחק",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedItems.map(async (itemId) => {
              itemStore.mediaList.find(item => item.id === itemId);
              await itemStore.deleteMedia(itemId);
            })
          );
          Swal.fire({
            title: "נמחק בהצלחה",
            text: "הפריטים נמחקו בהצלחה",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          setSelectedItems([]);
          itemStore.fetchMedia();
        } catch (error) {
          Swal.fire({
            title: "שגיאה",
            text: "התרחשה שגיאה בעת מחיקת הפריטים",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
          console.error("Error deleting selected items:", error);
        }
      } else if (result.isDenied) {
        Swal.fire({
          title: "בוטל",
          text: "הפריטים לא נמחקו",
          icon: "info",
          showConfirmButton: false,
          timer: 1500,
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
      confirmButtonText: "כן, מחק",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await itemStore.deleteTag(item.id, tag.id);
        const updatedItem = { ...item, tags: item.tags.filter(t => t !== tag.id) };
        itemStore.updateItem(updatedItem);
        setDeleteTagOpen(false);
        Swal.fire({
          title: "נמחק בהצלחה",
          text: "התג נמחק בהצלחה",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: "בוטל",
          text: "התג לא נמחק",
          icon: "info",
          showConfirmButton: false,
          timer: 1500,
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
      [itemId]: !prevOpenRows[itemId],
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
    // setAddTagOpen(false);
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
    const filtered2 = itemStore.mediaList2.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filterItems(filtered) && filterItems(filtered2));
    // setFilteredItems(filterItems(filtered));
  };

  const getHeaderName = (typeTab) => {
    if (typeTab === 'book') {
      return "מדף ";
    } else if (typeTab === 'object') {
      return "כמות";
    } else if (typeTab === 'file') {
      return "קובץ";
    }
    else if (typeTab === 'all') {
      return "מדף/קובץ/כמות";
    }
  };

  const [typeTab, setTypeTab] = useState('all');
  const filterItems = (items) => {
    if (!items) {
      return [];
    }
    if (filterType === "all") {
      setTypeTab('all');
      console.log(items);
      return items;
    }
    if (filterType === "book") {
      setTypeTab('book');
      console.log("book");
      return items.filter((item) =>item.filePath && !item.filePath.includes("https"));
    }
    if (filterType === 'object') {
      setTypeTab('object');
      console.log('object');
      return items.filter((item) => item.amount);
    }
    console.log("file");
    setTypeTab('file');
    const y1 = items.filter((item) =>item.filePath&& item.filePath.includes("https"));
    console.log(y1);
    return items.filter((item) =>item.filePath&& item.filePath.includes("https"));
  };

  const totalItems = filteredItems ? filteredItems.length : 0;

  const handleAddTagsToItems = async (tags) => {
    let successfulAdds = [];
    let failedAdds = [];
    debugger
    const promises = tags.flatMap((tagId) =>
      selectedItems.map(async (itemId) => {
        const item = filteredItems.find(item => item.id === itemId);
        const tag = tagsList.find(tag => tag.id === tagId);
        console.log("item: " + JSON.stringify(item))
        console.log("tag: " + JSON.stringify(tag))
        try {
          debugger
          await itemStore.addItemTag(itemId, tagId);
          debugger
          if (itemStore.isAddItemTag) {
            successfulAdds.push({ item, tag });
          } else {
            failedAdds.push({ item, tag });
          }
        } catch (error) {
          failedAdds.push({ item, tag });
        }
      })
    );

    try {
      await Promise.all(promises);
      const successMessages = successfulAdds.map(({ item, tag }) =>
        `<p>התג "${tag.name}" נוסף לפריט "${item.title}" בהצלחה</p>`
      ).join('');

      const errorMessages = failedAdds.map(({ item, tag }) =>
        `<p>הוספת התג "${tag.name}" לפריט "${item.title}" נכשלה</p>`
      ).join('');

      const finalMessage = `${successMessages}${successMessages && errorMessages ? '<br><br>' : ''}${errorMessages}`;

      Swal.fire({
        title: "תוצאות ההוספות",
        html: finalMessage || "לא היו שינויים.",
        icon: successfulAdds.length > 0 ? "success" : "error",
        showConfirmButton: true
      });

      setSelectedItems([]);
    } catch (error) {
      console.log("fail in handleAddTagsToItems: " + error);
    }
  };
  const localeText = {
    // תרגום של אפשרויות המיון והפילטור לעברית
    columnMenuSortAsc: "מיון לפי סדר עולה",
    columnMenuSortDesc: "מיון לפי סדר יורד",
    columnMenuFilter: "סינון",
    columnMenuHideColumn: "הסתר עמודה",
    columnMenuUnsort: "בטל מיון",
    noRowsLabel: "אין פריטים להצגה",
    columnMenuManageColumns: "ניהול עמודות",
    filterPanelAddFilter: "הוסף מסנן",
    filterPanelDeleteIconLabel: "מחק",
    filterPanelLinkOperator: "אופרטור לוגי",
    filterPanelOperators: "אופרטור",
    filterPanelOperatorAnd: "וגם",
    filterPanelOperatorOr: "או",
    filterPanelColumns: "עמודות",
    filterPanelInputLabel: "ערך",
    filterPanelInputPlaceholder: "סנן ערך",
    filterOperatorContains: "מכיל",
    filterOperatorEquals: "שווה",
    filterOperatorStartsWith: "מתחיל ב",
    filterOperatorEndsWith: "מסתיים ב",
    filterOperatorIs: "הוא",
    filterOperatorNot: "אינו",
    filterOperatorAfter: "אחרי",
    filterOperatorOnOrAfter: "ב או אחרי",
    filterOperatorBefore: "לפני",
    filterOperatorOnOrBefore: "ב או לפני",
    filterOperatorIsEmpty: "ריק",
    filterOperatorIsNotEmpty: "אינו ריק",
    filterOperatorIsAnyOf: "הוא אחד מ",
  };
  const columns = [
    {
      field: "checkbox",
      headerName: "",
      flex: 0.5,
      align: "right",
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Checkbox
          indeterminate={
            selectedItems && itemStore.mediaList &&
            selectedItems && itemStore.mediaList2 &&            
            selectedItems.length > 0 &&
            selectedItems.length < itemStore.mediaList.length&&
            selectedItems.length < itemStore.mediaList2.length
          }
          checked={
            selectedItems && itemStore.mediaList &&
            selectedItems && itemStore.mediaList2 &&
            selectedItems.length === itemStore.mediaList.length &&
            selectedItems.length === itemStore.mediaList2.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems(itemStore.mediaList ? itemStore.mediaList.map((item) => item.id) : []&&itemStore.mediaList2 ? itemStore.mediaList2.map((item) => item.id) : [])
              // setSelectedItems(itemStore.mediaList ? itemStore.mediaList.map((item) => item.id) : [])
            } else {
              setSelectedItems([]);
            }
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          color="primary"
          checked={selectedItems.includes(params.id)}
          onChange={() => handleSelectItem(params.row)}
        />
      ),
    },
    {
      field: "expand",
      headerName: "",
      flex: 0.5,
      align: "right",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
         if(params.row.author){
          const item = params.row;
        return (

          <div>
            <Tooltip title={openRows[item.id] ? "סגור" : "פתח"}>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => handleExpandClick(item.id)}
              >
                {openRows[item.id] ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </Tooltip>
          </div>
        );}
      },
    },
    {
      field: "icon",
      headerName: "",
      flex: 0.5,
      align: "right",
      disableColumnMenu: true,
      sortable: false,
      // renderCell: (params) =>
        renderCell: (params) => {
          // תנאי לבדיקה אם author קיים
          if (!params.row.author) {
            return <CategoryIcon />;
          }
          // תנאי משולש לבדיקה אם filePath קיים ואינו כולל "https"
          return params.row.filePath && !params.row.filePath.includes("https") ? (
            <MenuBookRoundedIcon sx={{ color: "#0D1E46" }} />
          ) : (
            <TextSnippetRoundedIcon sx={{ color: "#0D1E46" }} />
          );
        }
    },
    { field: "title", headerName: "כותרת", flex: 1, align: "right" },
    { field: "description", headerName: "תיאור", flex: 1, align: "right" },
    { field: "category", headerName: "קטגוריה", flex: 1, align: "right" },
    // { field: "recomended", headerName: "ממולץ", flex: 1, align: "right" },
    // { field: "userId", headerName: "משתמש", flex: 1, align: "right" },
    // { field: "author", headerName: "מחבר", flex: 1, align: "right" },
    {
      field: "author",
      headerName: "מחבר ",
      flex: 1,
      align: "right",
      renderCell: (params) => (
        <div
          style={{
            textAlign: "right",
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {!params.row.author ?  "--":
          params.row.author}
        </div>
      ),
    },
    {
      field: "publishingYear",
      headerName: "שנת הוצאה",
      flex: 1,
      align: "right",
      renderCell: (params) => (
        <div
          style={{
            textAlign: "right",
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.row.filePath && params.row.filePath.includes("https") || !params.row.author
            ? "--"
            : params.row.publishingYear}
        </div>
      ),
    },

    {
      field: "status",
      headerName: "סטטוס",
      flex: 1,
      align: "right",
      sortable: false,
      renderCell: (params) => (
        <div
          style={{
            textAlign: "right",
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: params.row.isApproved ? "#2C6B2F" : "#E57373",
          }}
        >
          {(params.row.isApproved&&params.row.author) ? "מאושר" : "ממתין לאישור"}
        </div>
      ),
    },
      {
        field: "displayField",
        headerName: getHeaderName(typeTab),
        flex: 1,
        align: "right",
        valueGetter: (params) => {
          // ודא ש-params ו-params.row מוגדרים
          if (params && params.row) {
            return params.row.amount !== undefined ? params.row.amount : params.row.filePath;
          }
          return null; // מחזיר null אם params או params.row אינם מוגדרים
        },
        renderCell: (params) => {
          // ודא ש-params ו-params.row מוגדרים
          if (params && params.row) {
            const value = params.row.amount !== undefined ? params.row.amount : params.row.filePath;
            return (
              <div
                style={{
                  textAlign: "right",
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {params.row.amount !== undefined ? (
                  params.row.amount
                ) : (
                  params.row.filePath && params.row.filePath.includes("https") ? (
                    <a href={params.row.filePath} target="_blank" rel="noopener noreferrer">
                      {params.row.filePath}
                    </a>
                  ) : (
                    params.row.filePath
                  )
                )}
              </div>
            );
          }
          return null; // מחזיר null אם params או params.row אינם מוגדרים
        },
      },
    {
      field: "tags",
      headerName: "תגיות",
      flex: 1,
      align: "right",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        const item = params.row;
        const hasTags = item.tags.length > 0;
        return (
          <Stack
            direction="column"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: hasTags === false ? 'flex-start' : 'flex-end',
              height: '100%'
            }}
          >
            {hasTags && (
              <>
                <Button
                  aria-controls="tag-menu"
                  aria-haspopup="true"
                  onClick={(event) => { setAnchorEl(event.currentTarget); }}
                  style={{
                    width: '100px',
                    backgroundColor: '#b0b0b0',
                    color: '#0D1E46',
                    // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.0)', // הוספת צל
                    // marginRight: 0
                  }} // שינוי רוחב הכפתור
                >
                  {"כל התגיות"}
                </Button>
                <Menu
                  id="tag-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={() => { setAnchorEl(null) }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {console.log("item.tags", item.tags)} ;
                  {console.log("tagStore.getTagsList", tagStore.getTagsList)}

                  {item.tags.map((tagId) => {
                    const tag = tagStore.getTagsList.find((tag) => tag.id === tagId);
                    console.log("tegg", tag);
                    if (tag) {
                      return (
                        <Typography key={tag.id}
                          style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
                          <Chip
                            label={tag.name}
                            style={{
                              color: "#0D1E46",
                              width: '145px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0 8px',
                              textAlign: 'center'
                            }}
                            variant="outlined"
                            onDelete={() => handleDeleteTag(item, tag)}
                            deleteIcon={
                              <IconButton aria-label="delete" style={{
                                padding: '2px',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                }
                              }}>
                                <CancelIcon style={{ marginRight: '7px' }} />
                              </IconButton>
                            }
                          />
                        </Typography>
                      );
                    }
                    return null;
                  })}
                </Menu>
              </>
            )}
            {!hasTags && (
              <h5>{"לא מוגדרות תגיות"}</h5>
            )}
          </Stack>
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      align: "left",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "left",
            gap: "8px",
          }}
        >
          <Tooltip title="ערוך">
            <IconButton
              color="#0D1E46"
              onClick={() => handleClickEdit(params.row)}
              style={{ color: "#0D1E46" }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="מחק">
            <IconButton
              onClick={() => handleDelete(params.row)}
              style={{ color: "#0D1E46" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
    {
      align: "right",
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              style={{
                backgroundColor: "#0D1E46",
                color: "#FFD700",
                padding: '4px 8px',
                minWidth: '40px',
                minHeight: '40px',
                borderRadius: '5px',
                "&:hover": {
                  backgroundColor: "#0D1E46",
                  color: "#FFD700",
                },
              }}
              onClick={
                selectedItems.length > 0
                  ? handleDeleteSelectedItems
                  : handleClickAdd
              }
            >
              {selectedItems.length > 0 ? (
                <Tooltip title="למחיקת פריטים מרובים">
                  <DeleteIcon style={{ fontSize: '25px' }} />
                </Tooltip>
              ) : (
                <Tooltip title="להוספת פריט חדש" arrow>
                  <AddIcon style={{ fontSize: '25px' }} />
                </Tooltip>
              )}
            </Button>
          </Grid>
          {selectedItems.length > 0 && (
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconSelectTags handleAddItemTag={handleAddTagsToItems} style={{ fontSize: '20px' }} />
            </Grid>
          )}
        </Grid>
      ),
    },
  ].filter(column => {
    if (typeTab === "file" && column.field === "publishingYear") return false;
    if (typeTab === "object" && (column.field === "publishingYear" || column.field === "author")) return false;
    return true; })

  const paginatedItems = filteredItems ? filteredItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  ) : [];

  return (
    <>
      <div className="itemListDiv" dir="rtl">
        <h2 align="center">תרשימת קבצים</h2>
        <Grid
          container
          spacing={2}
          sx={{ backgroundColor: "#0D1E46", padding: 2 }}
        >
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 600,
                "& .MuiTabs-indicator": {
                  backgroundColor: "#FFD700",
                },
                "& .MuiTab-root": {
                  color: "#dcdcdc",
                  "&.Mui-selected": {
                    color: "#FFD700",
                  },
                },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
                <Tab label="חפצים" value="object" />
              </Tabs>
            </Box>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CacheProvider value={cacheRtl}>
              <ItemSearch onSearch={handleSearch} />
            </CacheProvider>
          </Grid>
        </Grid>
        <DataGrid
          rows={paginatedItems}
          columns={columns}
          pageSize={rowsPerPage}
          disableSelectionOnClick
          localeText={localeText}
          autoHeight
          style={{ overflow: "hidden" }}
          pagination={false} // Disable DataGrid pagination
          hideFooterPagination
          position="sticky"
          hideFooter
        />
        <Box textAlign="center" marginTop={2}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <Pagination
              dir="ltr"
              count={Math.ceil(totalItems / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              variant="outlined"
              color="primary"
              shape="rounded"
              renderItem={(item) => <PaginationItem {...item} />}
            />
          </Stack>
        </Box>
        {paginatedItems.map((item) => (
        // {!typeTab === "object" &&

          <Collapse in={openRows[item.id]} timeout="auto" unmountOnExit>
            <Box display="flex" dir="rtl" margin={1}>
              {item.filePath && !item.filePath.includes("https")&&  (

                <Typography
                  variant="body1"
                  style={{ marginRight: "10px" }}
                  dir="rtl"
                >
                  <strong>הערה:</strong>  {item.note}
                </Typography>
              )}
             
              <Typography
                variant="body1"
                style={{ marginRight: "10px" }}
                dir="rtl"
              >
                מהדורה: {item.edition}
              </Typography>
              <Typography
                variant="body1"
                style={{ marginRight: "10px" }}
                dir="rtl"
              >
                סידרה: {item.series}
              </Typography>
              <Typography
                variant="body1"
                style={{ marginRight: "10px" }}
                dir="rtl"
              >
                מספר בסידרה: {item.numOfSeries}
              </Typography>
              <Typography
                variant="body1"
                style={{ marginRight: "10px" }}
                dir="rtl"
              >
                {/* מוציא לאור: {item.publisher}
              </Typography>
              <Typography
                variant="body1"
                style={{ marginRight: "10px" }}
                dir="rtl"
              > */}
                שנה עברית: {item.hebrewPublicationYear}
              </Typography>
              <Typography
                variant="body1"
                style={{ marginRight: "10px" }}
                dir="rtl"
              >
                שפה: {item.language}
              </Typography>
              <Typography
                variant="body1"
                style={{ marginRight: "10px" }}
                dir="rtl"
              >
                הערה: {item.note}
              </Typography>
              <Typography
                variant="body1"
                style={{ marginRight: "10px" }}
                dir="rtl"
              >
                רמה: {item.itemLevel}
              </Typography>
              <Typography
                variant="body1"
                style={{ marginRight: "10px" }}
                dir="rtl"
              >
                חומר נלווה: {item.accompanyingMaterial}
              </Typography>
            </Box>
          </Collapse>
        ))}

      </div>
      {editedItem && <ItemEdit mediaItem={editedItem} onClose={handleClose} />}
      {itemStore.add && <ItemAdd />}
    </>
  );
});

export default DataTable;
