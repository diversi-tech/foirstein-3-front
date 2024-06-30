import { useState } from 'react';
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
    Chip,
    Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateDialog from '../update/update';
import tagStore from '../../store/tagStore';
// import { Form } from 'react-router-dom';
import Form from '../form/form';

const MediaTable = observer(() => {
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
            await mediaStore.deleteMedia(deleteItem.id);
            setDeleteOpen(false);
        }
    };

    const handleClickAdd = () =>{
        console.log("beforeClick", mediaStore.add);
        // mediaStore.setAdd(true); // Use the setAdd action instead of modifying add directly
mediaStore.add = true;
        console.log("afterClick", mediaStore.add);

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
            <div style={{width: "100%", height: "25%", marginTop: "0%"}}>
                <h2 style={{ textAlign: "center" }}>רשימת קבצים</h2>
                <TableContainer component={Paper} style={{ marginTop: "0%", direction: 'rtl' , width: "100vw"}}>
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
                            {mediaStore.mediaList.map((item) => (
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
                                    <TableCell  style={{ minWidth: '200px', overflowX: 'auto' }}>
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

                 {mediaStore.add && <Form />}
            </div>
        </>
    );
});

export default MediaTable;
