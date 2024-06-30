import React, { useState } from "react";
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
const rows = [
  {
    Id: 1,
    ItemId: 1,
    UserId: 2,
    RequestDate: "2023-01-01",
    ApprovalDate: "2023-01-02",
  },
  {
    Id: 2,
    ItemId: 2,
    UserId: 2,
    RequestDate: "2023-02-01",
    ApprovalDate: "2023-02-02",
  },
  {
    Id: 3,
    ItemId: 3,
    UserId: 3,
    RequestDate: "2023-03-01",
    ApprovalDate: "2023-03-02",
  },
];

const StyledTableCell = styled(TableCell)(() => ({
  textAlign: "center", // Center align content in the table cell
}));

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
            <AlertDialog option="אישור" />
            <AlertDialog option="דחיה" />
          </Box>
        </StyledTableCell>
        <StyledTableCell align="right">{row.RequestDate}</StyledTableCell>
        <StyledTableCell align="right">{row.ApprovalDate}</StyledTableCell>
        <StyledTableCell align="right">{row.UserId}</StyledTableCell>
        <StyledTableCell align="right">{row.ItemId}</StyledTableCell>
        <StyledTableCell align="right">{row.Id}</StyledTableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <DetailRequest request={row} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    Id: PropTypes.number.isRequired,
    ItemId: PropTypes.number.isRequired,
    UserId: PropTypes.number.isRequired,
    RequestDate: PropTypes.string.isRequired,
    ApprovalDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default function StudentRequest() {
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
              <StyledTableCell align="center">מספר משתמש</StyledTableCell>
              <StyledTableCell align="center">מספר פריט</StyledTableCell>
              <StyledTableCell align="center">מספר בקשה</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.Id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function AlertDialog({ option }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            האם אתה רוצה לבצע {option}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ביטול</Button>
          <Button onClick={handleClose} autoFocus>
            אישור
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

AlertDialog.propTypes = {
  option: PropTypes.string.isRequired,
};
