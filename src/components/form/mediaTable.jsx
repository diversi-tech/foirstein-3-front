import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import mediaStore from '../../store/mediaStore';
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
    Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateDialog from '../update/update';

const MediaTable = observer(() => {
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editedItem, setEditedItem] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    const theme = useTheme();//רספונסיבי
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));//רספונסיבי

    const handleDelete = (item) => {
        setDeleteItem(item);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteItem) {
            await mediaStore.deleteMedia(deleteItem.id);
            setDeleteOpen(false);
        }
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">כותרת</TableCell>
                            <TableCell align="center">תיאור</TableCell>
                            <TableCell align="center">תגית</TableCell>
                            <TableCell align="center">מדף/קובץ</TableCell>
                            <TableCell align="center">פעולה</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mediaStore.mediaList.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell align="center">{item.title}</TableCell>
                                <TableCell align="center">{item.description}</TableCell>
                                <TableCell align="center">{item.tag}</TableCell>
                                <TableCell align="center">{item.shelf}</TableCell>
                                <TableCell>
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
                <Dialog
                    open={editOpen}
                    onClose={handleClose}
                    fullScreen={fullScreen}
                >
                    <DialogTitle>עריכת מדיה</DialogTitle>
                    <DialogContent>
                        <UpdateDialog mediaItem={editedItem} onClose={handleClose} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            ביטול
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
});

export default MediaTable;
