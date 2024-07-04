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
//הטבלה שולחת כל פעם לקומפוננטה של השורה-כל שורה זה בעצם בקשה
function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

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
        <StyledTableCell align="right">{row.userId}</StyledTableCell>
        <StyledTableCell align="right">{row.itemId}</StyledTableCell>
        <StyledTableCell align="right">{row.requestId}</StyledTableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <DetailRequest userId={row.userId} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    requestId: PropTypes.number.isRequired,
    itemId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    requestDate: PropTypes.string.isRequired,
    approvalDate: PropTypes.string.isRequired,
  }).isRequired,
};
//פונקציה שמחלצת מהפרוקסי
function extractRawData(proxyObject) {
  if (proxyObject != undefined && proxyObject.data != null) {
    console.log("Extracting data from proxy object:", proxyObject.data);
    return proxyObject.data;
  } else {
    console.log("Returning original object as it's not a proxy:", proxyObject);
    return proxyObject;
  }
}
//פונקציה שמחזירה תאריך ושעה בצורה מסודרת
function formatDate(dateString) {
  const dateParts = dateString.split("T")[0].split("-");
  const day = dateParts[2];
  const month = dateParts[1];
  const year = dateParts[0];
  return `${day}/${month}/${year}`;
}
//קומפוננטה שמציגה בטבלה את רשימת בקשות התלמידה
const StudentRequest = observer(() => {
  const baseUrl = "https://localhost:7297/api/";
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(baseUrl + `BorrowRequest`);
        let data = await res.json();
        const rows = extractRawData(data);
        console.log(rows, "useefect");
        console.log("data:", data, "Rows:", rows);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchRequest();
  }, []);
  const rows = requestStore.getRequest;
  return (
    <Box margin="10vh">
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
              <Row key={row.requestId} row={row} />
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
    if (option == "אישור") {
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
  requestId: PropTypes.string.isRequired,
};
