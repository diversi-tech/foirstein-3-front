import * as React from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2'
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Link from '@mui/material/Link';
import VerifiedIcon from '@mui/icons-material/Verified';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import itemStore from '../../store/item-store';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import './PendingItems.css';
import ItemEdit from '../item/item-edit';
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
// function createData(itemId, title, author, category, createdAt, description, fileP, publishingYear) {
//   return {
//     itemId,
//     title,
//     author,
//     category,
//     createdAt: createdAt.replace(/T/g, ' '),
//     moreDetails: [
//       {
//         desc: description,
//         filePath: fileP,
//         link: title,
//         publishingYear: publishingYear,
//         isFile: fileP ? fileP.includes('http') : false,
//       },
//     ],
//   };
// }
function createData(item) {
  const moreDetails = [
      {
          desc: item.description,
          itemLevel: item.itemLevel,
          filePath: item.filePath,
          link: item.title,
          publishingYear: item.publishingYear,
          isFile: item.filePath ? item.filePath.includes('http') : false,
      },
  ];
  

  if (item.itemType === 1) {
      moreDetails[0].numberOfDaysOfQuestion = item.numberOfDaysOfQuestion;
      moreDetails[0].note = item.note;
      moreDetails[0].amount = item.amount;
      moreDetails[0].edition = item.edition;
      moreDetails[0].series = item.series;
      moreDetails[0].available = item.available;
      moreDetails[0].numOfSeries = item.numOfSeries;
      moreDetails[0].language = item.language;
      moreDetails[0].accompanyingMaterial = item.accompanyingMaterial;
      moreDetails[0].hebrewPublicationYear = item.hebrewPublicationYear;
  }
  else if (item.itemType === 0) {
    moreDetails[0].note = item.note;
  }
  else if (item.itemType === 2) {
    moreDetails[0].numberOfDaysOfQuestion = item.numberOfDaysOfQuestion;
    moreDetails[0].note = item.note;
  }
  return {
      itemId: item.id,
      title: item.title,
      author: item.author,
      category: item.category,
      itemType: item.itemType,
      createdAt: item.createdAt.replace(/T/g, ' '),
      moreDetails: moreDetails,
  };
}


function Row(props) {
  const { row, onEdit } = props;
  const [open, setOpen] = React.useState(false);

  const handleEditClick = () => {
    const { itemId, title, author, category, createdAt, moreDetails } = row;

    const editData = {
      id:itemId,
      title,
      description: moreDetails[0].desc,
      category,
      author,
      createdAt,
      filePath: moreDetails[0].filePath,
      publishingYear: moreDetails[0].publishingYear,
    };
    onEdit(editData);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className="table-cell" align="right">{row.title}</TableCell>
        <TableCell className="table-cell" align="right">{row.author}</TableCell>
        <TableCell className="table-cell" align="right">{row.category}</TableCell>
        <TableCell className="table-cell" align="right">{row.createdAt}</TableCell>
        <TableCell className="table-cell" align="right">
          <IconButton onClick={handleEditClick}><EditIcon /></IconButton>
        </TableCell>
        <IconButton className="icon-button" aria-label="Verified" variant="contained" color="primary" onClick={() => approval(row.itemId)}>
          <VerifiedIcon />
        </IconButton>
        <IconButton className="icon-button" aria-label="DisabledByDefaultRounded" variant="contained" color="secondary" onClick={() => deny(row.itemId)}>
          <DisabledByDefaultRoundedIcon />
        </IconButton>
      </TableRow>
      <TableRow dir='rtl'>
        <TableCell dir='rtl' style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse dir='rtl' in={open} timeout="auto" unmountOnExit>
            {row.moreDetails.map((moreDetail) => (
              <div dir='rtl' key={moreDetail.id} style={{ paddingRight: "11%" }}>
                <Box display="flex" dir='rtl'>
                  <Typography variant="subtitle1" dir='rtl'><b>תאור: </b></Typography>
                  <Typography dir='rtl' variant="subtitle1" style={{ marginRight: "10px" }}>
                    {moreDetail.desc}
                  </Typography>
                </Box>
                <Box display="flex" dir='rtl'>
                  <Typography variant="subtitle1" dir='rtl'><b>שנת הוצאה: </b></Typography>
                  <Typography dir='rtl' variant="subtitle1" style={{ marginRight: "10px" }}>
                    {moreDetail.publishingYear}
                  </Typography>
                </Box>
                {moreDetail.isFile ? (
                  <Box display="flex" dir='rtl'>
                    <Typography variant="subtitle1" dir='rtl'><b>קובץ: </b></Typography>
                    <Typography variant="subtitle1" style={{ marginRight: "10px" }} dir='rtl'>
                      <Link href={moreDetail.filePath} underline="hover" target="_blank" rel="noopener noreferrer">
                        {moreDetail.link}
                      </Link>
                    </Typography>
                  </Box>
                ) : (
                  <Box display="flex" dir='rtl'>
                    <Typography variant="subtitle1" dir='rtl'><b>מספר מדף: </b></Typography>
                    <Typography variant="subtitle1" style={{ marginRight: "10px" }} dir='rtl'>
                      {moreDetail.filePath}
                    </Typography>
                  </Box>
                )}
                 {row.itemType === 1 && (
                  <>
                    <Box display="flex" dir='rtl'>
                      <Typography variant="subtitle1" dir='rtl'><b>חומר נלווה: </b></Typography>
                      <Typography dir='rtl' variant="subtitle1" style={{ marginRight: "10px" }}>
                        {moreDetail.accompanyingMaterial}
                      </Typography>
                    </Box>
                    <Box display="flex" dir='rtl'>
                      <Typography variant="subtitle1" dir='rtl'><b>שנת הוצאה עברית: </b></Typography>
                      <Typography dir='rtl' variant="subtitle1" style={{ marginRight: "10px" }}>
                        {moreDetail.hebrewPublicationYear}
                      </Typography>
                    </Box>
                  </>
                )}
                {row.itemType === 0 && (
                  <Box display="flex" dir='rtl'>
                    <Typography variant="subtitle1" dir='rtl'><b>הערה: </b></Typography>
                    <Typography dir='rtl' variant="subtitle1" style={{ marginRight: "10px" }}>
                      {moreDetail.note}
                    </Typography>
                  </Box>
                )}
                {row.itemType === 2 && (
                  <>
                    <Box display="flex" dir='rtl'>
                      <Typography variant="subtitle1" dir='rtl'><b>מספר ימים לשאלה: </b></Typography>
                      <Typography dir='rtl' variant="subtitle1" style={{ marginRight: "10px" }}>
                        {moreDetail.numberOfDaysOfQuestion}
                      </Typography>
                    </Box>
                    <Box display="flex" dir='rtl'>
                      <Typography variant="subtitle1" dir='rtl'><b>הערה: </b></Typography>
                      <Typography dir='rtl' variant="subtitle1" style={{ marginRight: "10px" }}>
                        {moreDetail.note}
                      </Typography>
                    </Box>
                  </>
                )}
              </div>
            ))}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    moreDetails: PropTypes.arrayOf(
      PropTypes.shape({
        desc: PropTypes.string.isRequired,
        filePath: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
async function approval(itemId) {
  Swal.fire({
    title: "?האם לאשר את הפריט",
    text: "פריט מאושר ייכנס למאגר",
    showDenyButton: true,
    //showCancelButton: true,
    confirmButtonText: "לאשר",
    denyButtonText: `ביטול`
  }).then(async (result) => {
    if (result.isConfirmed) {
      await itemStore.approvalItem(itemId);
      if (itemStore.isApprov)
      {
        await itemStore.fetchPendingItems();
        Swal.fire({
          icon: "success",
          title: "הפריט אושר",
          showConfirmButton: false,
          timer: 1500
        });
      }
        

      else
        Swal.fire({
          icon: "error",
          title: "אופס... תקלה בעת שמירת הנתונים",
          showConfirmButton: false,
          timer: 1500
        });
    }
    else if (result.isDenied) {
      Swal.fire({
        icon: "info",
        title: "לא נשמרו שינויים",
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
}
async function deny(itemId) {
  Swal.fire({
    title: "?האם לא לאשר את הפריט",
    text: "פריט לא מאושר יימחק מהמאגר",
    showDenyButton: true,
    //showCancelButton: true,
    confirmButtonText: "דחיית פריט",
    denyButtonText: `ביטול`
  }).then(async (result) => {
    if (result.isConfirmed) {
      await itemStore.deniedItem(itemId);
      if (itemStore.isDeind)
      {
        await itemStore.fetchPendingItems();
        Swal.fire({
          icon: "success",
          title: "הפריט נמחק",
          showConfirmButton: false,
          timer: 1500
        }
      );
    }
      else
        Swal.fire({
          icon: "error",
          title: "אופס... תקלה בעת שמירת הנתונים",
          showConfirmButton: false,
          timer: 1500
        });
    }
    else if (result.isDenied) {
      Swal.fire({
        icon: "info",
        title: "לא נשמרו שינויים",
        showConfirmButton: false,
        timer: 1500
      });
    }
  });}
export const PendingItems = observer(() => {
  const [editedItem, setEditedItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // const rows = toJS(itemStore.getPendingList).map((i) => createData(i.id, i.title, i.author, i.category, i.createdAt, i.description, i.filePath, i.publishingYear,i.numberOfDaysOfQuestion,i.itemType,i.itemLevel,i.note));
  const rows = toJS(itemStore.getPendingList).map((item) => createData(item));

  const handleClickEdit = (item) => {
    setEditedItem(item);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditedItem(null);
    setEditOpen(false);
  };

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Paper elevation={3} sx={{ width: '90%', maxWidth: 1200 }}>
          <Box padding={2} textAlign="center">
            <Typography variant="h4" component="h1"><b>פריטים ממתינים לאישור</b></Typography>
          </Box>
          <TableContainer component={Paper} dir="rtl">
            <Table aria-label="collapsible table">
              <TableHead className="table-head-cell">
                <TableRow className="table-head-cell">
                  <TableCell className="table-head-cell" />
                  <TableCell className="table-head-cell" style={{ color: 'white' }} align="right">כותרת</TableCell>
                  <TableCell className="table-head-cell" style={{ color: 'white' }} align="right">מחבר</TableCell>
                  <TableCell className="table-head-cell" style={{ color: 'white' }} align="right">קטגוריה</TableCell>
                  <TableCell className="table-head-cell" style={{ color: 'white' }} align="right">תאריך יצירה</TableCell>
                  <TableCell className="table-head-cell" style={{ color: 'white' }} align="right"></TableCell>
                  <TableCell className="table-head-cell" style={{ color: 'white' }} align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <Row key={row.title} row={row} onEdit={handleClickEdit} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="h6">אין פריטים ממתינים</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      {editedItem && <ItemEdit mediaItem={editedItem} onClose={handleClose} />}
    </>
  );
});

export default PendingItems;
