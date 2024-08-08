import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import itemStore from "../../store/item-store";
import tagStore from "../../store/tag-store";
import ItemEdit from "./item-edit";
import ItemAdd from "./item-add";
import { observer } from "mobx-react-lite";
import CategoryIcon from "@mui/icons-material/Category";
import ItemSearch from "./item-search";
import { getRoleFromToken } from "../decipheringToken";
import {
  IconButton,
  Tooltip,
  useTheme,
  Paper,
  Box,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tabs,
  Tab,
  Checkbox,
  Stack,
  Pagination,
  PaginationItem,
  Chip,
  TableRow,
  TableCell,
  Collapse,
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
  Modal,
  Divider,
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
import IconSelectTags from "./SelectTags";
import CancelIcon from "@mui/icons-material/Cancel";
import { TypeEnum } from "../Enums";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import { LevelEnum } from "../Enums";
export const localeText = {
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
  const rowsPerPage = 10;
  const [openRows, setOpenRows] = useState({});
  const [tagsList, setTagsList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [moreDetails, setMoreDetails] = useState(null);
  const [detail, setDetail] = useState("");

  const MoreDetailsModal = ({ open, handleClose, item }) => {
    return (
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 4,
            textAlign: "right",
            bgcolor: "#f9f9f9", // צבע רקע בהיר ונעים
            borderRadius: 3,
            boxShadow: 24,
            width: 400,
            margin: "auto",
            mt: "15%", // ממוקם נמוך יותר בעמוד
            border: "2px solid #0D1E46", // קו גבול מסביב לקופסה
            position: "relative",
          }}
        >
          <div>
            <Typography
              variant="h6"
              component="h2"
              textAlign={"center"}
              dir="rtl"
              color="#0D1E46"
              sx={{ mb: 2 }}
            >
              פרטי הפריט
            </Typography>{" "}
            <Divider sx={{ my: 2 }} />
            {item.numberOfDaysOfQuestion && (
              <Typography>
                <strong> מספר ימי השאלה: </strong>
                {item.numberOfDaysOfQuestion}
              </Typography>
            )}
            {item.edition && (
              <Typography>
                <strong>מהדורה: </strong>
                {item.edition}
              </Typography>
            )}
            {item.series && (
              <Typography>
                <strong>סידרה: </strong>
                {item.series}
              </Typography>
            )}
            {item.numOfSeries && (
              <Typography>
                <strong>מספר בסידרה: </strong>
                {item.numOfSeries}
              </Typography>
            )}
            {item.hebrewPublicationYear && (
              <Typography>
                <strong>שנה עברית: </strong>
                {item.hebrewPublicationYear}
              </Typography>
            )}
            {item.language && (
              <Typography>
                <strong>שפה: </strong>
                {item.language}
              </Typography>
            )}
            {item.note && (
              <Typography>
                {item.note}
                <strong>:הערה </strong>
              </Typography>
            )}
            {item.itemLevel && (
             <Typography
             variant="body1"
             style={{ marginRight: "10px" }}
             dir="rtl"
           >
             <strong> רמה: </strong>{nameLevle(item.itemLevel)}
           </Typography>
            )}
            {item.accompanyingMaterial && (
              <Typography>
                <strong>חומר נלווה: </strong>
                {item.accompanyingMaterial}
              </Typography>
            )}
            {item.series && (
              <Typography>
                <strong>סדרה: </strong>
                {item.series}
              </Typography>
            )}
          </div>
          <Button onClick={handleClose} sx={{ mt: 2 }} fullWidth>
            סגור
          </Button>
        </Box>
      </Modal>
    );
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([itemStore.fetchMedia(), tagStore.fetchTag()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    // handlePremmision();

    fetchData();
  }, [itemStore, tagStore]); // Dependencies: triggers fetchData when itemStore or tagStore changes

  // Update tagsList when tagStore.tagList changes
  useEffect(() => {
    setTagsList(tagStore.getTagsList); // Make sure this returns an array of objects
  }, [tagStore.tagList]);

  // Update filteredItems when itemStore.mediaList or filterType changes
  useEffect(() => {
    // const combinedItems = [...itemStore.mediaList, ...itemStore.mediaList2]; // שילוב שני המערכים
    setFilteredItems(filterItems(itemStore.mediaList));
    setPage(1);
    // console.log("items:" + JSON.stringify(itemStore.mediaList));
  }, [itemStore.mediaList, filterType]);

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
              itemStore.mediaList.find((item) => item.id === itemId);
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
      icon: "question",
      showDenyButton: true,
      denyButtonText: `ביטול`,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "כן, מחק",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await itemStore.deleteTag(item.id, tag.id);
        const updatedItem = {
          ...item,
          tags: item.tags.filter((t) => t !== tag.id),
        };
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
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleClickAdd = () => {
    itemStore.add = true;
  };

  const handlePermission = (item) => {
    const permission = getRoleFromToken();
    if (permission != null) {
      if (permission === "Book" && item.itemType !== TypeEnum.BOOK)
        return false;
      if (permission === "File" && item.itemType !== TypeEnum.FILE)
        return false;
      if (
        permission === "PhysicalItem" &&
        item.itemType !== TypeEnum.PHYSICALITEM
      )
        return false;
    }
    return true;
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
    // const filtered2 = itemStore.mediaList2.filter((item) =>
    //   item.title.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    // setFilteredItems(filterItems(filtered) && filterItems(filtered2));
    setFilteredItems(filterItems(filtered));
  };

  const getHeaderName = (typeTab) => {
    if (typeTab === "book") {
      return "מדף ";
    } else if (typeTab === "object") {
      return "כמות";
    } else if (typeTab === "file") {
      return "קובץ";
    } else if (typeTab === "all") {
      return "מדף/קובץ/כמות";
    }
  };

  const nameLevle = (level) => {
    if (level === 2) return "גבוהה";
    if (level === 1) return "נמוכה";
    if (level === 3) return "כיתה";
    if (level === 0) return "גיל הרך";
  };

  const [typeTab, setTypeTab] = useState("all");
  const filterItems = (items) => {
    if (!items) {
      return [];
    }
    if (filterType === "all") {
      setTypeTab("all");
      return items;
    }
    if (filterType === "book") {
      setTypeTab("book");
      return items.filter((item) => item.itemType === TypeEnum.BOOK);
    }
    if (filterType === "object") {
      setTypeTab("object");
      return items.filter((item) => item.itemType === TypeEnum.PHYSICALITEM);
    }
    setTypeTab("file");
    return items.filter((item) => item.itemType === TypeEnum.FILE);
  };

  const totalItems = filteredItems ? filteredItems.length : 0;

  const handleAddTagsToItems = async (tags) => {
    let successfulAdds = [];
    let failedAdds = [];
    const promises = tags.flatMap((tagId) =>
      selectedItems.map(async (itemId) => {
        const item = filteredItems.find((item) => item.id === itemId);
        const tag = tagsList.find((tag) => tag.id === tagId);
        // console.log("item: " + JSON.stringify(item))
        // console.log("tag: " + JSON.stringify(tag))
        try {
          await itemStore.addItemTag(itemId, tagId);
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
      const successMessages = successfulAdds
        .map(
          ({ item, tag }) =>
            `<p>התג "${tag.name}" נוסף לפריט "${item.title}" בהצלחה</p>`
        )
        .join("");
      const errorMessages = failedAdds
        .map(
          ({ item, tag }) =>
            `<p>הוספת התג "${tag.name}" לפריט "${item.title}" נכשלה</p>`
        )
        .join("");
      const finalMessage = `${successMessages}${
        successMessages && errorMessages ? "<br><br>" : ""
      }${errorMessages}`;
      Swal.fire({
        title: "תוצאות ההוספות",
        html: finalMessage || "לא היו שינויים.",
        icon: successfulAdds.length > 0 ? "success" : "error",
        showConfirmButton: true,
      });
      setSelectedItems([]);
    } catch (error) {
      // console.log("fail in handleAddTagsToItems: " + error);
    }
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
            selectedItems &&
            itemStore.mediaList &&
            // selectedItems && itemStore.mediaList2 &&
            selectedItems.length > 0 &&
            selectedItems.length < itemStore.mediaList.length
            // selectedItems.length < itemStore.mediaList2.length
          }
          checked={
            selectedItems &&
            itemStore.mediaList &&
            // selectedItems && itemStore.mediaList2 &&
            selectedItems.length === itemStore.mediaList.length
            // selectedItems.length === itemStore.mediaList2.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              // setSelectedItems(itemStore.mediaList ? itemStore.mediaList.map((item) => item.id) : []&&itemStore.mediaList2 ? itemStore.mediaList2.map((item) => item.id) : [])
              setSelectedItems(
                itemStore.mediaList
                  ? itemStore.mediaList.map((item) => item.id)
                  : []
              );
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
        //  if(params.row.author){
        const item = params.row;
        return (
          <div>
            <Tooltip title="לפרטים נוספים" arrow>
              <IconButton onClick={() => setMoreDetails(params.row)}>
                <KeyboardArrowDownIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
    // },
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
      },
    },
    {
      field: "userId", headerName: "שם המעלה", flex: 1, align: "right",
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
          {console.log("params.row.userId", params.row)}
          
          {params.row.userId ? `${params.row.fname} ${params.row.sname}` : ''}
          {/* {console.log("params.row.userID", params.row.userID)} */}
        </div>
      ),
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
          {!params.row.author ? "--" : params.row.author}
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
          {(params.row.filePath && params.row.filePath.includes("https")) ||
          !params.row.author
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
          {params.row.isApproved && params.row.author
            ? "מאושר"
            : "ממתין לאישור"}
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
          return params.row.amount !== undefined
            ? params.row.amount
            : params.row.filePath;
        }
        return null; // מחזיר null אם params או params.row אינם מוגדרים
      },
      renderCell: (params) => {
        // ודא ש-params ו-params.row מוגדרים
        // if (params && params.row) {
        //   const value = params.row.amount !== undefined ? params.row.amount : params.row.filePath;
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
            {params.row.amount ? (
              params.row.amount
            ) : params.row.filePath && params.row.filePath.includes("https") ? (
              <a
                href={params.row.filePath}
                target="_blank"
                rel="noopener noreferrer"
              >
                {params.row.filePath}
              </a>
            ) : (
              params.row.filePath
            )}
          </div>
        );
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
        const [anchorEl, setAnchorEl] = useState(null);
        const item = params.row;
        const hasTags = item.tags.length > 0;

        const handleMenuClose = () => {
          setAnchorEl(null);
        };
        return (
          <Stack
            direction="column"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: hasTags === false ? "flex-start" : "flex-end",
              height: "100%",
            }}
          >
            {hasTags && (
              <>
                <Button
                  aria-controls="tag-menu"
                  aria-haspopup="true"
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                  }}
                  style={{
                    width: "100px",
                    backgroundColor: "#b0b0b0",
                    color: "#0D1E46",
                  }}
                >
                  {"כל התגיות"}
                </Button>
                <Menu
                  id="tag-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  {/* {console.log("item.tags", item.tags)}
                  {console.log("tagStore.getTagsList", tagStore.getTagsList)} */}

                  {item.tags.map((tagId) => {
                    const tag = tagStore.getTagsList.find(
                      (tag) => tag.id === tagId
                    );
                    //console.log("tegg", tag)
                    if (tag) {
                      return (
                        <Typography
                          key={tag.id}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px",
                          }}
                        >
                          <Chip
                            label={tag.name}
                            style={{
                              color: "#0D1E46",
                              width: "145px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "0 8px",
                              textAlign: "center",
                            }}
                            variant="outlined"
                            onDelete={() => handleDeleteTag(item, tag)}
                            deleteIcon={
                              <IconButton
                                aria-label="delete"
                                style={{
                                  padding: "2px",
                                  "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                                  },
                                }}
                              >
                                <CancelIcon style={{ marginRight: "7px" }} />
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
            {!hasTags && <h5>{"לא מוגדרות תגיות"}</h5>}
          </Stack>
        );
      },
    },
    {
      field: "recommended",
      headerName: "",
      flex: 1,
      align: "right",

      renderCell: (params) => (
        <div
          style={{
            textAlign: "center",
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <Tooltip title={params.row.recommended ? "מומלץ" : ""}>
            <Box>
              {params.row.recommended ? (
                <StarIcon style={{ color: "yellow" }} />
              ) : (
                <StarBorderIcon />
              )}
            </Box>
          </Tooltip>
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
      renderCell: (params) => {
        const isPermitted = handlePermission(params.row);
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "left",
              gap: "8px",
            }}
          >
            <Tooltip title="ערוך">
              <span>
                <IconButton
                  color="#0D1E46"
                  onClick={() => handleClickEdit(params.row)}
                  style={{ color: "#0D1E46" }}
                  disabled={!isPermitted}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="מחק">
              <span>
                <IconButton
                  onClick={() => handleDelete(params.row)}
                  style={{ color: "#0D1E46" }}
                  disabled={!isPermitted}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      align: "right",
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "flex-end", // הזזת הכפתורים ימינה
            alignItems: "center",
            spacing: 2, // הוספת רווחים בין רכיבי ה-Grid
          }}
        >
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              justifyContent: "flex-end",
              spacing: 4,
            }}
          >
            <Button
              style={{
                backgroundColor: "#0D1E46",
                color: "#FFD700",
                padding: "4px 8px",
                minWidth: "40px",
                minHeight: "40px",
                borderRadius: "5px",
                "&:hover": {
                  backgroundColor: "#0D1E46",
                  color: "#FFD700",
                },
                marginRight: "10px",
              }}
              onClick={
                selectedItems.length > 0
                  ? handleDeleteSelectedItems
                  : handleClickAdd
              }
            >
              {selectedItems.length > 0 ? (
                <Tooltip title="למחיקת פריטים מרובים">
                  <DeleteIcon style={{ fontSize: "25px" }} />
                </Tooltip>
              ) : (
                <Tooltip title="להוספת פריט חדש" arrow>
                  <AddIcon style={{ fontSize: "25px" }} />
                </Tooltip>
              )}
            </Button>
          </Grid>
          {selectedItems.length > 0 && (
            <Grid
              item
              xs={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <IconSelectTags
                handleAddItemTag={handleAddTagsToItems}
                style={{ fontSize: "20px" }}
              />
            </Grid>
          )}
        </Grid>
      ),
    },
  ].filter((column) => {
    if (typeTab === "file" && column.field === "publishingYear") return false;
    if ( typeTab === "object" &&
      (column.field === "publishingYear" ||
        column.field === "author" ||
        column.field === "status")
    )
      return false;
    return true;
  });

  const paginatedItems = filteredItems
    ? filteredItems.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : [];

  return (
    <>
      <div className="itemListDiv" dir="rtl">
        <h2 align="center">רשימת קבצים</h2>
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
        {isLoading ? (

          <Box display="flex" justifyContent='center' alignItems="center" height="400px">
            <CircularProgress />
          </Box>
        ) : (
          <>
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

              {moreDetails && (
                <MoreDetailsModal
                  open={Boolean(moreDetails)}
                  handleClose={() => setMoreDetails(null)}
                  item={moreDetails}
                />
              )}
            </Box>
          </>
        )}
      </div>
      {editedItem && <ItemEdit mediaItem={editedItem} onClose={handleClose} />}
      {itemStore.add && <ItemAdd />}
    </>
  );
});
export default DataTable;
