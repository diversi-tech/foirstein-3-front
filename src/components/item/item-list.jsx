import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import itemStore from '../../store/item-store';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    useMediaQuery,
    useTheme,
    Chip,
    Stack
} from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ItemEdit from './item-edit';
import tagStore from '../../store/tag-store';
// import { ItemAdd } from 'react-router-dom';
import ItemAdd from './item-add';
import Success from '../message/success';
import Failure from '../message/failure';

const ItemList = observer(() => {
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editedItem, setEditedItem] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [send, setSend] = useState(false);


    const handleDelete = (item) => {
        setDeleteItem(item);
        setDeleteOpen(true);
    };

    // const confirmDelete = async () => {
    //     if (deleteItem) {
    //         await itemStore.deleteMedia(deleteItem.id);
    //         setDeleteOpen(false);
    //     }
    // };

    const confirmDelete = async () => {
        // בדוק ש-deleteItem מוגדר ויש לו ID
        if (deleteItem && deleteItem.id) {
          try {
            await itemStore.deleteMedia(deleteItem.id);
            setDeleteOpen(false);
            console.log(`Item with ID ${deleteItem.id} deleted successfully.`);
            setSend(true);
          } catch (error) {
            console.error(`Error deleting item with ID ${deleteItem.id}:`, error);
          }
        } else {
          console.warn('No item selected or item ID is missing.');
        }
      };
    
    //   const handleDeleteTag = () => {
    //     // console.info('You clicked the delete icon.');
    //   };       

    const handleClickAdd = () => {
        console.log("beforeClick", itemStore.add);
        // itemStore.setAdd(true); // Use the setAdd action instead of modifying add directly
        itemStore.add = true;
        console.log("afterClick", itemStore.add);

    };

    const handleClickEdit = (item) => {
        setEditedItem(item);
        setEditOpen(true);
    };

    const handleClose = () => {
        setDeleteOpen(false);
        setDeleteItem(null);
        setEditOpen(false);
        setEditedItem(null);
    };

    return (
        <>
            <div style={{ width: "100%", height: "25%", marginTop: "15%" }}>
                <h2 style={{ textAlign: "center" }}>רשימת קבצים</h2>
                <TableContainer component={Paper} style={{ marginTop: "0%", direction: 'rtl', width: "100vw" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2em', padding: '12px' }}>כותרת</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2em', padding: '12px' }}>תיאור</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2em', padding: '12px' }}>קטגוריה</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2em', padding: '12px' }}>מחבר</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2em', padding: '12px' }}>סטטוס</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2em', padding: '12px' }}>מדף/קובץ</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2em', padding: '12px' }}>פעולה</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2em', padding: '12px' }}>תגית</TableCell>
                                <Button onClick={handleClickAdd}><AddIcon></AddIcon></Button>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemStore.mediaList.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell align="center">{item.title}</TableCell>
                                    <TableCell align="center">{item.description}</TableCell>
                                    <TableCell align="center">{item.category}</TableCell>
                                    <TableCell align="center">{item.author}</TableCell>
                                    {item.isApproved ? <TableCell align="center">מאושר</TableCell> : <TableCell align="center" >ממתין לאישור</TableCell> }
                                    <TableCell align="center">{item.filePath}</TableCell>
                                    <TableCell align='center'>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleClickEdit(item)}
                                            >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleDelete(item)}
                                            style={{ marginLeft: '10px' }}
                                            >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell style={{ minWidth: '200px', overflowX: 'auto' }}>
                                        <Stack direction="row" style={{ flexWrap: 'nowrap', overflowX: 'auto' , width:"200px"}}>
                                            {tagStore.tagList.map((tag) => (
                                                <Chip onDelete={handleDelete} key={tag.id} label={tag.name} color="primary" variant="outlined"/>
                                            ))}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog
                    open={deleteOpen}
                    onClose={handleClose}
                    fullScreen={fullScreen}
                    style={{ direction: "rtl" }}
                >
                    <DialogTitle>אישור מחיקה</DialogTitle>
                    <DialogContent>
                        <p>האם אתה בטוח שברצונך למחוק את הפריט הזה?</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            ביטול
                        </Button>
                        <Button onClick={confirmDelete} color="secondary" >
                            מחיקה
                        </Button>
                    </DialogActions>
                {send &&(itemStore.isDelete ? <Success /> : <Failure/>)}
                </Dialog>
                {editedItem && (
                    <ItemEdit mediaItem={editedItem} onClose={handleClose} />
                )}
                {itemStore.add && <ItemAdd />}
            </div>
        </>
    );
});

export default ItemList;