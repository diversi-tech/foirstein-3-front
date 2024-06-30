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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ItemEdit from './item-edit';
import tagStore from '../../store/tag-store';
// import { ItemAdd } from 'react-router-dom';
import ItemAdd from './item-add';

const ItemList = observer(() => {
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editedItem, setEditedItem] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDelete = (item) => {
        setDeleteItem(item);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteItem) {
            await itemStore.deleteMedia(deleteItem.id);
            setDeleteOpen(false);
        }
    };

    const handleClickAdd = () => {
        console.log("beforeClick", itemStore.add);
        // itemStore.setAdd(true); // Use the setAdd action instead of modifying add directly
        itemStore.add = true;
        console.log("afterClick", itemStore.add);

    }



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
            <div style={{ width: "100%", height: "25%", marginTop: "0%" }}>
                <h2 style={{ textAlign: "center" }}>רשימת קבצים</h2>
                <TableContainer component={Paper} style={{ marginTop: "0%", direction: 'rtl', width: "100vw" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2em', padding: '12px' }}>כותרת</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2em', padding: '12px' }}>תיאור</TableCell>
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
                                    <TableCell align="center">{item.shelf}</TableCell>
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
                                        <Stack direction="row" spacing={1} style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
                                            {tagStore.tagList.map((tag) => (
                                                <Chip key={tag.id} label={tag.name} color="primary" variant="outlined" />
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
                >
                    <DialogTitle>אישור מחיקה</DialogTitle>
                    <DialogContent>
                        <p>האם אתה בטוח שברצונך למחוק את הפריט הזה?</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            ביטול
                        </Button>
                        <Button onClick={confirmDelete} color="secondary">
                            מחיקה
                        </Button>
                    </DialogActions>
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