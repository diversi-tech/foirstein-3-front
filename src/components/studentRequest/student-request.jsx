import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DialogContentText from "@mui/material/DialogContentText";
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
import "./student-request.css"; // Import the CSS file

const baseUrl = "https://localhost:7297/api/";

const rowsPerPageOptions = [5, 10, 25];

function Request(props) {
  const {  request } = props;
  const [detailRequest, setDetailRequest] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(
          `${baseUrl}BorrowApprovalRequest/details/${request.requestId}`
        );
        let data = await res.json();
        const _detailRequest = extractRawData(data);
        setDetailRequest(_detailRequest);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert('אירעה שגיאה בעת טעינת הנתונים');
      }
    };
    fetchRequest();
  }, [request.requestId]);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className="styled-table-cell">
          <Box className="center-content">
            <AlertDialog option="דחיה" requestId={request.requestId} />
            <AlertDialog option="אישור" requestId={request.requestId} />
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
function extractRawData(proxyObject) {
  if (proxyObject && proxyObject.data) {
    console.log("Extracting data from proxy object:", proxyObject.data);
    return proxyObject.data;
  } else {
    console.log("Returning original object as it's not a proxy:", proxyObject);
    return proxyObject;
  }
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

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(baseUrl + `BorrowRequest`);
        let data = await res.json();
        const rows = extractRawData(data);
        console.log(rows, "useEffect");
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchRequest();
  }, []);

  const rows = requestStore.getRequest;

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
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow className="table-header">
              <TableCell />
              <TableCell className="styled-table-cell" align="center"></TableCell>
              <TableCell className="styled-table-cell" align="center">תאריך בקשה</TableCell>
              <TableCell className="styled-table-cell" align="center">תאריך אישור</TableCell>
              <TableCell className="styled-table-cell" align="center">שם משתמש</TableCell>
              <TableCell className="styled-table-cell" align="center">שם פריט</TableCell>
              <TableCell className="styled-table-cell" align="center">מספר בקשה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(
                  currentPage * rowsPerPage,
                  currentPage * rowsPerPage + rowsPerPage
                )
              : rows
            ).map((row) => (
              <Request key={row.requestId} request={row} requestId={row.requestId} />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
});
export default StudentRequest;
function AlertDialog({ option, requestId }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSumbit = () => {
    handleClickOpen();
    if (option === "אישור") {
      requestStore.updateApproveRequest(requestId);
    } else {
      requestStore.updateDenyRequest(requestId);
    }
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        {option}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ fontWeight: "bold" }}>
            ? האם אתה רוצה לבצע {option}
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
  option: PropTypes.string.isRequired,
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
