import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import DialogContentText from "@mui/material/DialogContentText";
import BeenhereOutlinedIcon from "@mui/icons-material/BeenhereOutlined";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CircularProgress from "@mui/material/CircularProgress";
// import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ButtonGroup from '@mui/material/ButtonGroup';
import {
  Paper,
  TableRow,
  Table,
  TableBody,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  TablePagination,
  TableHead,
  Box,
  Collapse,
  IconButton,
  TableCell,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DetailRequest from "./detail-request";
import requestStore from "../../store/studentsRequest-store";
import { observer } from "mobx-react-lite";
import "./student-request.css";
import Swal from "sweetalert2";

function Request(props) {
  const { request } = props;
  const [detailRequest, setDetailRequest] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const getRequestDetails = async () => {
      try {
        const _detailRequest = await requestStore.getById(request.requestId);
        setDetailRequest(_detailRequest);
        if (!_detailRequest) {
          Swal.fire({
            icon: "Error",
            title: "אין נתונים",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.error("Failed to fetch request details:", error); // לוג שגיאות
      }
    };
    getRequestDetails();
  }, [request.requestId]);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <Tooltip title="פרטים נוספים" arrow>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell className="styled-table-cell">
          <Box className="center-content" justifyContent="space-around">
            <AlertDialog
              requestId={request.requestId}
            />
            {/* <AlertDialog
              option="אישור"
              requestId={request.requestId}
              color="error"
            /> */}
          </Box>
        </TableCell>
        <TableCell className="styled-table-cell" align="right">
          {formatDate(request.approvalDate)}
        </TableCell>
        <TableCell className="styled-table-cell" align="right">
          {formatDate(request.requestDate)}
        </TableCell>
        <TableCell className="styled-table-cell" align="right">
          {detailRequest && detailRequest.userName
            ? detailRequest.userName
            : "טוען..."}
        </TableCell>
        <TableCell className="styled-table-cell" align="right">
          {detailRequest && detailRequest.itemName
            ? detailRequest.itemName
            : "טוען..."}
        </TableCell>
        <TableCell className="styled-table-cell" align="right">
          {request.requestId}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <DetailRequest detailRequest={detailRequest} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
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
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const getRequests = async () => {
      const fetchedRows = await requestStore.fetchRequest();
      setRows(fetchedRows);
      setLoading(false);
      if (!fetchedRows) {
        Swal.fire({
          icon: "Errror",
          title: "אין נתונים",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };
    getRequests();
  }, []);

  const rowsToDisplay = rows.length > 0 ? rows : [];

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  return (
    <Box sx={{ margin: "0 auto", width: "95%", maxWidth: "1200px" }}>
      <TableContainer component={Paper} className="styled-table-container">
        <Box padding={2} textAlign="center">
          <Typography variant="h4" component="h1">
            <b>בקשות התלמידות</b>
          </Typography>
        </Box>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow className="table-header">
                  <TableCell />
                  <TableCell
                    className="styled-table-cell"
                    align="center"
                  ></TableCell>
                  <TableCell className="styled-table-cell" align="center">
                    תאריך בקשה
                  </TableCell>
                  <TableCell className="styled-table-cell" align="center">
                    תאריך אישור
                  </TableCell>
                  <TableCell className="styled-table-cell" align="center">
                    שם משתמש
                  </TableCell>
                  <TableCell className="styled-table-cell" align="center">
                    שם פריט
                  </TableCell>
                  <TableCell className="styled-table-cell" align="center">
                    מספר בקשה
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsToDisplay.length > 0 &&
                  (rowsPerPage > 0
                    ? rowsToDisplay.slice(
                      currentPage * rowsPerPage,
                      currentPage * rowsPerPage + rowsPerPage
                    )
                    : rowsToDisplay
                  ).map((row) => (
                    <Request
                      key={row.requestId}
                      request={row}
                      requestId={row.requestId}
                    />
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TableContainer>
    </Box>
  );
});
export default StudentRequest;
function AlertDialog({ requestId }) {
  const [open, setOpen] = useState(false);
  const [option, setOption] = useState('');
  const handleClickOpen = (buttonType) => {
    setOpen(true);
    setOption(buttonType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSumbit = () => {
    handleClickOpen();
    if (option === "אישור") {
      const res = requestStore.updateApproveRequest(requestId);
      if (res.status === 200) {
        Swal.fire({
          title: "! הבקשה עודכנה בהצלחה ",
          icon: "success",
        });
      } else {
        Swal.fire({
          icon: "Error",
          title: "אופס..שגיאה.. ",
          text: res.error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      const r = requestStore.updateDenyRequest(requestId);
      if (r.status === 200) {
        Swal.fire({
          icon: "success",
          title: "הבקשה עודכנה הצלחה..! ",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "Error",
          title: "אופס..שגיאה.. ",
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
        <Button onClick={() => { handleClickOpen("אישור") }}
          style={{
            backgroundColor: 'transparent',
            color: '#2C6B2F',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100px',
            height: '40px',
            margin: '0', // להסיר מרווח בין הכפתורים
            borderRight: '1px solid gray',
            border: 'none'
          }}
        >
          <CheckCircleIcon style={{
            marginBottom: '0',
            fontSize: '20px',
            alignSelf: 'center',
            marginTop: '4px'
          }} />
          <span style={{
            marginTop: '2px',
            fontSize: '14px',
            lineHeight: '16px'
          }}>אישור</span>
        </Button>
        <Button onClick={() => { handleClickOpen("דחיה") }}
          style={{
            backgroundColor: 'transparent',
            color: '#E57373',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100px',
            height: '40px',
            margin: '0', // להסיר מרווח בין הכפתורים
            borderLeft: '1px solid gray',
            border: 'none'
          }}
        >
          <CancelIcon style={{
            marginBottom: '0',
            fontSize: '20px',
            alignSelf: 'center',
            marginTop: '4px'
          }} />
          <span style={{
            marginTop: '2px',
            fontSize: '14px',
            lineHeight: '16px'
          }}>דחיה</span>
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
            {option === 'אישור' ? 'האם אתה רוצה לבצע אישור?' : 'האם אתה רוצה לבצע דחיה?'}
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
DetailRequest.propTypes = {
  detailRequest: PropTypes.shape({
    tz: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    requestDate: PropTypes.string.isRequired,
    numUserRequests: PropTypes.number.isRequired,
  }).isRequired,
};
Request.propTypes = {
  request: PropTypes.shape({
    requestId: PropTypes.number.isRequired,
    itemId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    requestDate: PropTypes.string.isRequired,
    approvalDate: PropTypes.string.isRequired,
  }).isRequired,
};
