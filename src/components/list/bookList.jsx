
// import { observer } from "mobx-react-lite";
// import bookStore from "../../store/bookStore";
// import Update from '../update/update';
// import { useState } from "react";
// import { Table, TableBody, TableCell, Paper, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import mediaStore from "../../store/mediaStore";
// import mainStore from "../../store/mainStore";
// import { useTheme } from '@mui/material/styles';

// const BookList = observer(() => {
//   const [open, setOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);

//   // שימוש ב-useTheme וב-useMediaQuery כדי לבדוק אם המסך קטן
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   const handleClickOpen = (item) => {
//     setItemToDelete(item);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setItemToDelete(null);
//   };

//   const handleConfirmDelete = () => {
//     if (itemToDelete) {
//       if (itemToDelete.type === 'book') {
//         bookStore.deleteBookFromServer(itemToDelete.title);
//       } else if (itemToDelete.type === 'media') {
//         mediaStore.deleteMediaFromServer(itemToDelete.title);
//       }
//     }
//     handleClose();
//   };

//   const handleEditBook = () => {
//     <Update></Update>
//   };

//   return (
//     <div style={{ padding: isSmallScreen ? '8px' : '16px' }}>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: isSmallScreen ? 300 : 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
              // <TableCell align="right">כותרת</TableCell>
              // <TableCell align="right">תיאור</TableCell>
              // <TableCell align="right">תגית</TableCell>
              // <TableCell align="right">מדף/קובץ</TableCell>
              // <TableCell align="right">פעולה</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {bookStore.isClick && bookStore.tempBookList.map((book) => (
//               <TableRow key={book.id}>
//                 <TableCell component="th" scope="row">{book.id}</TableCell>
//                 <TableCell align="right">{book.title}</TableCell>
//                 <TableCell align="right">{book.description}</TableCell>
//                 <TableCell align="right">{book.tag}</TableCell>
//                 <TableCell align="right">{book.shelf}</TableCell>
//                 <TableCell align="right">
//                   <Button onClick={() => handleClickOpen({ ...book, type: 'book' })}>
//                     <DeleteIcon />
//                   </Button>
//                   <Button onClick={handleEditBook}>
//                     <EditIcon />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//             {mediaStore.isClick && mediaStore.tempMediaList.map((media) => (
//               <TableRow key={media.id}>
//                 <TableCell component="th" scope="row">{media.id}</TableCell>
//                 <TableCell align="right">{media.title}</TableCell>
//                 <TableCell align="right">{media.description}</TableCell>
//                 <TableCell align="right">{media.tag}</TableCell>
//                 <TableCell align="right">{media.file}</TableCell>
//                 <TableCell align="right">
//                   <Button onClick={() => handleClickOpen({ ...media, type: 'media' })}>
//                     <DeleteIcon />
//                   </Button>
//                   <Button onClick={handleEditBook}>
//                     <EditIcon />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//***********************************************************************************************************
//         <DialogTitle id="alert-dialog-title">{"אישור מחיקה"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             האם אתה בטוח שברצונך למחוק את הפריט הזה?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             ביטול
//           </Button>
//           <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//             מחיקה
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// });

// export default BookList;



import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const BookList = observer(() => {
  const [open, setOpen] = useState(false);
  const [ setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null); // הוספת מצב עריכה

  // פתיחת חלון העריכה
  const handleClickEdit = (item) => {
    setEditedItem(item); // הגדרת הפריט שמעריך
    setIsEditing(true); // שינוי למצב עריכה
    setOpen(true); // פתיחת חלון
  };

  // סגירת חלון העריכה
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false); // שינוי למצב עריכה
    setEditedItem(null); // איפוס פריט שמעריך
  };

  // שמירת העריכה
  const handleSaveEdit = () => {
    // פעולת שמירת העריכה כאן
    handleClose(); // סגירת חלון העריכה לאחר שמירה
  };

  // טבלת ספרים
  return (
    <div style={{direction: "rtl"}}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>כותרת</TableCell>
              <TableCell>תיאור</TableCell>
              <TableCell>תגית</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* רשות ספר */}
            <TableRow>
              <TableCell>שם ספר</TableCell>
              <TableCell>תיאור הספר</TableCell>
              <TableCell>קטגוריה</TableCell>
              <TableCell>
                <Button onClick={() => handleClickEdit({ id: 1, type: 'book' })}>
                  <EditIcon />
                </Button>
              </TableCell>
            </TableRow>
            {/* רשות קובץ */}
            <TableRow>
              <TableCell>שם קובץ</TableCell>
              <TableCell>תיאור הקובץ</TableCell>
              <TableCell>קטגוריה</TableCell>
              <TableCell>
                <Button onClick={() => handleClickEdit({ id: 2, type: 'file' })}>
                  <EditIcon />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* דיאלוג לעריכה */}
      <Dialog open={open} onClose={handleClose} style={{direction: "rtl"}}>
        <DialogTitle>עריכה</DialogTitle>
        <DialogContent>
          <DialogContentText>
            עריכת {editedItem && editedItem.type === 'book' ? 'ספר' : 'קובץ'}
          </DialogContentText>
          <TextField
            label="שם"
            value={editedItem ? editedItem.name : ''}
            fullWidth
            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
          />
          <TextField
            label="תיאור"
            value={editedItem ? editedItem.description : ''}
            fullWidth
            onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
          />
          <TextField
            label="קטגוריה"
            value={editedItem ? editedItem.category : ''}
            fullWidth
            onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ביטול</Button>
          <Button onClick={handleSaveEdit}>שמור</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default BookList;


