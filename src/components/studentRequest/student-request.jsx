import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {  useState } from 'react';
import { observer } from "mobx-react-lite";
import Pagination from "@mui/material/Pagination";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import "./student-request.css";
import requestStore from "../../store/studentsRequest-store";
import { getUserIdFromTokenid } from "../decipheringToken";
import Swal from "sweetalert2";
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import {
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CheckBox } from "@mui/icons-material";
import { Box } from "@mui/system";
import { TypeEnum } from "../Enums";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SecurityIcon from '@mui/icons-material/Security';
import CategoryIcon from '@mui/icons-material/Category';
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
const StudentDetailsModal = ({ open, handleClose, student }) => (
  <Modal open={open} onClose={handleClose}>
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, width: 300, margin: 'auto', mt: 5 }}>
      <div dir="rtl">
        <Typography variant="h6" component="h2" textAlign={'center'}>
        פרטי התלמידה
        </Typography> 
         <Typography>
         <PersonIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
           {`שם :${student.studentFname} ${student.studentSname}`}
       </Typography>
        <Typography>תעודת זהות: {student.studentTZ}</Typography>
        <Typography>
          <PhoneIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
        {`טלפון :${student.studentPhoneNumber}`}
        </Typography>
        <Typography>
           <EmailIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
          {`מייל :${student.studentEmail}`}
        </Typography>
        <Typography>מספר הבקשות: {student.studentRequestCount}</Typography>
        <Typography>מחיר: {student.totalPrice}</Typography>
        <Typography>תאריך הבקשה: {formatDate(student.fromDate)}</Typography>
        <Typography>תאריך החזרה: {formatDate(student.untilDate)}</Typography>
      </div>
      <Button onClick={handleClose} sx={{ mt: 2 }}>סגור</Button>
    </Box>
  </Modal>
  // <Typography>
  //         <PersonIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
  //         {`שם :${librarian.librarianFname} ${librarian.librarianSname}`}
  //       </Typography>
  //       <Typography>
  //         <EmailIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
  //         {`מייל :${librarian.librarianEmail}`}
  //       </Typography>
  //       <Typography>
  //         <PhoneIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
  //         {`טלפון :${librarian.librarianPhoneNumber}`}
  //       </Typography>
  //       <Typography>
  //         <SecurityIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
  //         {`הרשאה :${librarian.librarianRole}`}
  //       </Typography>
);
function formatDate(dateString) {
  const dateObj = new Date(dateString);
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
const StudentRequest = observer(() => {
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(true);
  const [selectedRequest, setSelectedRequest] =useState([]);
  const [rows, setRows] = React.useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [filterType, setFilterType] = React.useState("all");
  const [typeTab, setTypeTab] = React.useState('all');
  const [filteredRequest, setFilteredRequest] = React.useState([]);
  const rowsPerPage = 9;

  const handleSelectItem = (request) => {
    setSelectedRequest((prevSelectedItems) => {
      console.log("!!!!!!!", request);

      if (prevSelectedItems.includes(request.requestId)) {
        return prevSelectedItems.filter((id) => id !== request.requestId);
      } else {
        return [...prevSelectedItems, request.requestId];
      }
    });
  };

  React.useEffect(() => {
    setFilteredRequest(filterRequest(requestStore.requestList));
    setPage(1);
  }, [requestStore.requestList, filterType]);
  const columns = [
    {
      field: "checkbox",
      headerName: "",
      flex: 0.35,
      align: "right",
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Checkbox
          indeterminate={
            selectedRequest &&
            requestStore.getRequest &&
            selectedRequest.length > 0 &&
            selectedRequest.length < requestStore.getRequest.length
          }
          checked={
            selectedRequest &&
            requestStore.getRequest &&
            selectedRequest.length === requestStore.getRequest.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRequest(
                requestStore.getRequest
                  ? requestStore.getRequest.map((item) => item.requestId)
                  : []
              );
            } else {
              setSelectedRequest([]);
            }
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          color="primary"
          checked={selectedRequest.includes(params.row.requestId)}
          onChange={() => handleSelectItem(params.row)}
        />
      ),
    },
    {
      field: "icon",
      headerName: "",
      flex: 0.35,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      // renderCell: (params) =>
      //   !params.row.itemType ? (
      //     <MenuBookRoundedIcon sx={{ color: "#0D1E46" }} />
      //   ) : (
      //     <TextSnippetRoundedIcon sx={{ color: "#0D1E46" }} />
      //   ),
        renderCell: (params) => {
          switch (params.row.itemType) {
            case 'book': return <MenuBookRoundedIcon sx={{ color: "#0D1E46" }}/>
            case 'file': return <TextSnippetRoundedIcon sx={{ color: "#0D1E46" }}/>
            case 'physical': <CategoryIcon sx={{ color: "#0D1E46" }}/>
          }
        },
    },
    {
      field: "requestId",
      headerName: "מספר בקשה",
      flex: 0.75,
      headerAlign: "center",
      align: "center",
    },
    
    {
      field: "studentFname",
      headerName: "שם משתמש ",
      flex: 1.25,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const firstName = params.row.studentFname || '';
        const lastName = params.row.studentSname || '';
        return (
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <span style={{ marginRight: 40 }}>{`${firstName}   ${lastName}`.trim()}</span>
          <Tooltip title="לפרטים נוספים" arrow>
            <IconButton
              onClick={() => setStudentDetails(params.row)} 
              style={{ position: 'absolute', left: 0 }}
            >
              <CallMissedOutgoingIcon />
            </IconButton>
          </Tooltip>  
        </div>
        );
      },
    },
    {
      field: "itemTitle",
      headerName: "שם פריט",
      flex: 0.75,
      headerAlign: "center",
      align: "center",
    },
    
    {
      field: "fromDate",
      headerName: "תאריך בקשה",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const formattedDate = formatDate(params.value); // Replace `formatDate` with your actual formatting function
            return formattedDate;
          },
    },
    {
      field: "untilDate",
      headerName: "תאריך החזרה",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cc",
      headerName: "",
      flex: 2,
      align: "center",
      sortable: false,
      renderCell: (params) => <AlertDialog requestId={params.row.requestId} />,
    },
  ];
  React.useEffect(() => {
    const getRequests = async () => {
      const fetchedRows = await requestStore.fetchRequest();
      setRows(fetchedRows);
      setLoading(false);
      if (fetchedRows == "null") {
        Swal.fire({
          icon: "errror",
          title: "אין נתונים",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };
    getRequests();
  }, requestStore.getRequest);


  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const filterRequest = (request) => {
    if (!request) {
      return [];
    }
    if (filterType === "all") {
      setTypeTab('all');
      console.log("all",filterType);
      return request;
    }
    if (filterType === "book") {
      setTypeTab('book');
      return request.filter((r) => {
        r.itemType ==='book'
        console.log("book",filterType);});

    }
    if (filterType === 'object') {
      setTypeTab('object');
      console.log("object",filterType);
    return request.filter((r) =>r.itemType === 'object');

    }
    setTypeTab('file');
      return request.filter((r) => r.itemType ==='file');
  };
  const paginatedRequest = filteredRequest.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
     <div className="tab" dir="rtl">
     <h2 align="center">רשימת בקשות השאלה  </h2>
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
                <Tab label="כל הבקשות" value="all" />
                <Tab label="בקשות ספרים" value="book" />
                <Tab label="בקשות קבצים" value="file" />
                <Tab label="בקשות חפצים" value="object" />
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
      
       </Grid>
        </Grid> 
      <div style={{ height: 400, width: "100%", direction: "rtl" }}>
        <DataGrid
          rows={paginatedRequest}
          columns={columns}
          pageSize={pageSize}
          disableSelectionOnClick
          localeText={localeText}
          autoHeight
          style={{ overflow: "hidden" }}
          pagination={false} 
          hideFooterPagination
          position="sticky"
          hideFooter
          getRowId={(row) => row.requestId}
        />
      </div>
      <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination
          page={page}
          onChange={handlePageChange}
          dir="ltr"
          shape="rounded"
          count={Math.ceil(paginatedRequest.length / rowsPerPage)}
          sx={{
            "& .MuiPaginationItem-root": {
              border: "1px solid #ccc", // מסגרת עבור מספרי העמודים
              borderRadius: "4px",
            },
          }}
        />
      </Stack>
       {studentDetails && (
        <StudentDetailsModal
          open={Boolean(studentDetails)}
          handleClose={() => setStudentDetails(null)}
          student={studentDetails}
        />
      )}
      </div>
    </>
  );
});

export default StudentRequest;
function AlertDialog({ requestId }) {
  const [open, setOpen] = React.useState(false);
  const [option, setOption] = React.useState("");
  const handleClickOpen = (buttonType) => {
    setOpen(true);
    setOption(buttonType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSumbit = () => {
    handleClickOpen();
  const librarianId= getUserIdFromTokenid();
    if (option === "אישור") {
      const res = requestStore.updateApproveRequest(requestId,librarianId);
      console.log("res", res);
      console.log("requestid", requestId);
      if (res != "null") {
        handleClose();
        Swal.fire({
          icon: "success",
          title: "! הבקשה עודכנה בהצלחה ",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.log(res);
        handleClose();
        Swal.fire({
          icon: "error",
          title: "! אופס..שגיאה  ",
          text: res.error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      const r = requestStore.updateDenyRequest(requestId,librarianId);
      if (r != "null") {
        handleClose();
        Swal.fire({
          icon: "success",
          title: "... הבקשה עודכנה הצלחה  ",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        handleClose();
        Swal.fire({
          icon: "error",
          title: "! אופס..שגיאה  ",
          text: r.error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  return (
    <React.Fragment>
      <ButtonGroup
        disableElevation
        variant="contained"
        aria-label="Disabled button group"
      >
        <Button
          onClick={() => {
            handleClickOpen("אישור");
          }}
          style={{
            backgroundColor: "transparent",
            color: "#2C6B2F",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100px",
            height: "40px",
            margin: "0", // להסיר מרווח בין הכפתורים
            borderRight: "1px solid gray",
            border: "none",
          }}
        >
          <span
            style={{
              marginTop: "2px",
              fontSize: "14px",
              lineHeight: "16px",
            }}
          >
            אישור
          </span>
        </Button>
        <Button
          onClick={() => {
            handleClickOpen("דחיה");
          }}
          style={{
            backgroundColor: "transparent",
            color: "#E57373",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100px",
            height: "40px",
            margin: "0", // להסיר מרווח בין הכפתורים
            borderLeft: "1px solid gray",
            border: "none",
          }}
        >
          <span
            style={{
              marginTop: "2px",
              fontSize: "14px",
              lineHeight: "16px",
            }}
          >
            דחיה
          </span>
        </Button>
      </ButtonGroup>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ fontWeight: "bold" }}
          >
            {option === "אישור"
              ? "? האם אתה רוצה לבצע אישור "
              : "? האם אתה רוצה לבצע דחיה "}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleClose}>ביטול</Button>
          <Button onClick={handleSumbit} autoFocus variant="contained">
            אישור
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
AlertDialog.propTypes = {
  requestId: PropTypes.number.isRequired,
};
StudentDetailsModal.propTypes = {
  student: PropTypes.object.isRequired,
  handleClose: PropTypes.isRequired,
  open: PropTypes.isRequired,
};

