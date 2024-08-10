import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import addNewRequestStore from "../../store/AddNewRequest-store";
// import tagStore from "../../store/tag-store";
// import ItemEdit from "../item/item-edit";
// import ItemAdd from "../item/item-add";
import { observer } from "mobx-react-lite";
// import ItemSearch from "../item/item-search";
import {
  IconButton, Tooltip, useTheme, Paper, Box, useMediaQuery, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Tabs, Tab, Checkbox, Stack, Pagination, PaginationItem,
  Chip, TableRow, TableCell, Collapse, Typography, Menu, MenuItem
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
import ItemAdd from "../item/item-add";
import ItemEdit from "../item/item-edit";

// import IconSelectTags from './SelectTags'
import CancelIcon from '@mui/icons-material/Cancel';

const AddNewRequest = observer(() => {
  
  const [openRows, setOpenRows] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const [editedItem, setEditedItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const totalItems = filteredItems ? filteredItems.length : 0;
  const [role, setRole] = useState(null);
  
  // useEffect(() => {
  //   const fetchRole = async () => {
  //     const userRole = await getRoleFromToken();
  //     setRole(userRole);
  //     console.log('User Role1111111111111111111111111111111111111111111111111111111111:', userRole);
  //   };
  //   fetchRole();
  // }, [])

  useEffect(() => {
    setFilteredItems(filterItems(addNewRequestStore.mediaList));
    setPage(1);
    console.log("items:" + JSON.stringify(addNewRequestStore.mediaList));
  }, [addNewRequestStore.mediaList]);

  const handleClickEdit = (item) => {
    setEditedItem(item);
    setEditOpen(true);
  };
  const handleClose = () => {
    // setSendItem(false);
    // setSendTag(false);
    // setDeleteOpen(false);
     setDeleteItem(null);
    // setDeleteTag(null);
    // setEditOpen(false);
    setEditedItem(null);
    // setDeleteTagOpen(false);
    // setAddTagOpen(false);
  };
  // const handleClickAdd = () => {
  //   addNewRequestStore.add = true;
  // };

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
          // if (item.author == null) {
            await addNewRequestStore.deleteObject(item.id);
          
          // else {
          //   await addNewRequestStore.deleteMedia(item.id);
          // }
          Swal.fire({
            title: "נמחק בהצלחה",
            text: "הפריט נמחק בהצלחה",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          // עדכן את רשימת הפריטים אחרי מחיקה
          addNewRequestStore.fetchMedia();
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
              const item = addNewRequestStore.mediaList.find(item => item.id === itemId);
              // if (item.author == null) {
                await addNewRequestStore.deleteObject(itemId);
              // } else {
              //   await addNewRequestStore.deleteMedia(itemId);
              // }
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
          addNewRequestStore.fetchMedia();
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
  const handleExpandClick = (itemId) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [itemId]: !prevOpenRows[itemId],
    }));
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
  const paginatedItems = filteredItems ? filteredItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  ) : [];
  const [typeTab, setTypeTab] = useState('all');
  
  const handleChangePage = (event, value) => {
    setPage(value);
  };
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
      return items.filter((item) => !item.filePath.includes("https"));
    }

    if (filterType === 'object') {
      setTypeTab('object');
      console.log('object');
      return items.filter((item) => item.author == null);
    }

    console.log("file");
    setTypeTab('file');
    const y1 = items.filter((item) => item.filePath.includes("https"));
    console.log(y1);
    return items.filter((item) => item.filePath.includes("https"));
  };


const columns = [
  {
    field: "checkbox",
    headerName: "",
    flex: 0.5,
    align: "right",
    disableColumnMenu: true,
    style:{overflow: "hidden" },
    sortable: false,
    renderHeader: () => (
      <Checkbox
        indeterminate={
          selectedItems && addNewRequestStore.mediaList &&
          selectedItems.length > 0 &&
          selectedItems.length < addNewRequestStore.mediaList.length
        }
        checked={
          selectedItems && addNewRequestStore.mediaList &&
          selectedItems.length === addNewRequestStore.mediaList.length
        }
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedItems(addNewRequestStore.mediaList ? addNewRequestStore.mediaList.map((item) => item.id) : []);
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
      );
    },
  },

  {
    field: "icon",
    headerName: "",
    flex: 0.5,
    align: "right",
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) =>
      !params.row.filePath.includes("https") ? (
        <MenuBookRoundedIcon sx={{ color: "#0D1E46" }} />
      ) : (
        <TextSnippetRoundedIcon sx={{ color: "#0D1E46" }} />
      ),
  },

  { field: "title", headerName: "כותרת", flex: 1, align: "right" },
  { field: "description", headerName: "תיאור", flex: 1, align: "right" },
  { field: "category", headerName: "קטגוריה", flex: 1, align: "right" },
  { field: "author", headerName: "מחבר", flex: 1, align: "right" },
  // {
  //   field: "publishingYear",
  //   headerName: "שנת הוצאה",
  //   flex: 1,
  //   align: "right",
  //   renderCell: (params) => (
  //     <div
  //       style={{
  //         textAlign: "right",
  //         width: "100%",
  //         whiteSpace: "nowrap",
  //         overflow: "hidden",
  //         textOverflow: "ellipsis",
  //       }}
  //     >
  //       {params.row.filePath.includes("https")
  //         ? "--"
  //         : params.row.publishingYear}
  //     </div>
  //   ),
  // },

    {
      field: "filePath",
      headerName: getHeaderName(typeTab),
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
          {params.value && typeof params.value === 'string' && params.value.includes("https") ? (
            <a href={params.filePath} target="_blank" rel="noopener noreferrer">
              {/* {params.value} */}
            </a>
          ) : (
            params.value
          )}
        </div>
      ),
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
          {/* <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}> */}
          {selectedItems.length > 0
                 && (  <Button
              style={{
                backgroundColor: "#0D1E46",
                color: "white",
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
             handleDeleteSelectedItems
                  // : handleClickAdd
              }
            >
              {selectedItems.length > 0 && (
                <Tooltip title="למחיקת פריטים מרובים">
                  <DeleteIcon style={{ fontSize: '25px' }} />
                </Tooltip>
              ) 
              // : (
                // <Tooltip title="להוספת פריט חדש" arrow>
                //   <AddIcon style={{ fontSize: '25px' }} />
                // </Tooltip>
              // )
            }
            </Button>)}
          {/* </Grid> */}
          {/* {selectedItems.length > 0 && (
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconSelectTags handleAddItemTag={handleAddTagsToItems} style={{ fontSize: '20px' }} />
            </Grid>
          )} */}
        </Grid>
      ),
    },
];


  return (
    <CacheProvider value={cacheRtl}>
       {/* <ThemeProvider theme={theme}> */}
    <div class Name="itemListDiv" dir="rtl">
      <DataGrid
        rows={paginatedItems}     
        columns={columns}
        disableSelectionOnClick
        autoHeight
        style={{ overflow: "hidden" }}
        pagination={false} // Disable DataGrid pagination
        hideFooterPagination
        // checkboxSelection
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
          <Collapse in={openRows[item.id]} timeout="auto" unmountOnExit>
            <Box display="flex" dir="rtl" margin={1}>
              {/* {!item.filePath.includes("https") && (
                <Typography
                  variant="body1"
                  style={{ marginRight: "10px" }}
                  dir="rtl"
                >
                  מספר ימי השאלה:{item.numberOfDaysOfQuestion}
                </Typography>
              )} */}
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

    {/* {addNewRequestStore.add && <ItemAdd />} */}
    {editedItem && <ItemEdit numOfDay={true} mediaItem={editedItem} onClose={handleClose} />}
    </CacheProvider>
  );


});
export default AddNewRequest;
