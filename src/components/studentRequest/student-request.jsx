import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DialogContentText from "@mui/material/DialogContentText";
import {
  Paper,
  TableRow,
  TableCell,
  Table,
  TableBody,
  styled,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  TableHead,
} from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DetailRequest from "./detail-request";
import requestStore from "../../store/studentsRequest-store";
import { observer } from "mobx-react-lite";

const StyledTableCell = styled(TableCell)(() => ({
  textAlign: "center", // Center align content in the table cell
}));

const baseUrl = "https://localhost:7297/api/";

function Row(props) {
  const { row } = props;
  const [detailRequest, setDetailRequest] = useState(null); // Initiate with null
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(
          `${baseUrl}BorrowApprovalRequest/details/${row.requestId}`
        );
        let data = await res.json();
        console.log("Data fetched from server:", data); // Log the fetched data
        const _detailRequest = extractRawData(data);
        setDetailRequest(_detailRequest);
        console.log("Extracted data:", _detailRequest); // Log the extracted data
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchRequest();
  }, [row.requestId]); // Dependency array should include row.requestId

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
            <StyledTableCell>
              <Box display="flex" justifyContent="center">
                <AlertDialog option="דחיה" requestId={row.requestId} />
                <AlertDialog option="אישור" requestId={row.requestId} />
              </Box>
            </StyledTableCell>
            <StyledTableCell align="right">
              {formatDate(row.approvalDate)}
            </StyledTableCell>
            <StyledTableCell align="right">
              {formatDate(row.requestDate)}
            </StyledTableCell>
            <StyledTableCell align="right">
              {detailRequest && detailRequest.userName
                ? detailRequest.userName
                : "טוען..."}
            </StyledTableCell>
            <StyledTableCell align="right">
              {detailRequest && detailRequest.itemName
                ? detailRequest.itemName
                : "טוען..."}
            </StyledTableCell>
            <StyledTableCell align="right">{row.requestId}</StyledTableCell>
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

Row.propTypes = {
  row: PropTypes.shape({
    requestId: PropTypes.number.isRequired,
    itemId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    requestDate: PropTypes.string.isRequired,
    approvalDate: PropTypes.string.isRequired,
  }).isRequired,
};

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
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
              <TableCell />
              <StyledTableCell align="center"></StyledTableCell>
              <StyledTableCell align="center">תאריך בקשה</StyledTableCell>
              <StyledTableCell align="center">תאריך אישור</StyledTableCell>
              <StyledTableCell align="center">שם משתמש</StyledTableCell>
              <StyledTableCell align="center">שם פריט</StyledTableCell>
              <StyledTableCell align="center">מספר בקשה</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.requestId} row={row} requestId={row.requestId} />
            ))}
          </TableBody>
        </Table>
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
          <DialogContentText
            id="alert-dialog-description"
            style={{ fontWeight: "bold" }}
          >
            ? האם אתה רוצה לבצע {option}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ביטול</Button>
          <Button onClick={handleSumbit} autoFocus>
            אישור
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

AlertDialog.propTypes = {
  option: PropTypes.string.isRequired,
  requestId: PropTypes.number.isRequired, // should be number instead of string
};
