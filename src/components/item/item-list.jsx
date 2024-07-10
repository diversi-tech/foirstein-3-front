import { useState, useEffect } from 'react';
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
    Stack,
    Checkbox,
    Grid,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ItemEdit from './item-edit';
import tagStore from '../../store/tag-store';
import ItemAdd from './item-add';
import Success from '../message/success';
import Failure from '../message/failure';
import { styled } from '@mui/material/styles';
import './item.css';

const useStyles = styled((theme) => ({
    title: {
        backgroundColor: '#468585', // צבע רקע שחור לכותרת
        color: 'white', // צבע טקסט לכותרת
        padding: theme.spacing(2), // מרווחים בתוך הכותרת
        textAlign: 'center', // מרכז הטקסט בתוך הכותרת
    },
    addButton: {
        backgroundColor: 'black', // צבע רקע שחור לכפתור ההוספה
        color: 'white', // צבע טקסט לכפתור ההוספה
        '&:hover': {
            backgroundColor: 'darkgrey', // צבע רקע כאשר העכבר על הכפתור
        },
    },
    headerCell: {
        backgroundColor: 'black', // צבע רקע שחור לכותרת
        color: 'white', // צבע טקסט לכותרת
    }
}));

const ItemList = observer(() => {
    const classes = useStyles(); // השתמש בסגנונות של useStyles

    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteTag, setDeleteTag] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editedItem, setEditedItem] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [send, setSend] = useState(false);
    const [deleteTagOpen, setDeleteTagOpen] = useState(false);

    useEffect(()=>{
        itemStore.fetchMedia();
    },[]);

    const handleDelete = (item) => {
        setDeleteItem(item);
        setDeleteOpen(true);
    };

    const handleDeleteChip = (item, tag) => {
        setDeleteTag(tag);
        setDeleteItem(item);
        setDeleteTagOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteTag && deleteTag.id) {
            await itemStore.deleteTag(deleteItem.id, deleteTag.id);
            setSend(true);
        }
    };

    const deletee = async () => {
        try {
            await itemStore.deleteMedia(deleteItem.id);
            setDeleteOpen(false);
            setSend(true);
        } catch (error) {
            console.error(`Error deleting item with ID ${deleteItem.id}:`, error);
        }
    };

    const handleClickAdd = () => {
        itemStore.add = true;
    };

    const handleClickEdit = (item) => {
        setEditedItem(item);
        setEditOpen(true);
    };

    const handleClose = () => {
        setDeleteOpen(false);
        setDeleteItem(null);
        setDeleteTag(null);
        setEditOpen(false);
        setEditedItem(null);
        setDeleteTagOpen(false);
    };

    const handleSelectItem = (item) => {
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(item.id)) {
                return prevSelectedItems.filter((id) => id !== item.id);
            } else {
                return [...prevSelectedItems, item.id];
            }
        });
    };

    const handleDeleteSelectedItems = async () => {
        setDeleteOpen(true); // Open confirmation dialog for bulk delete
    };

    const handleConfirmBulkDelete = async () => {
        if (selectedItems.length > 1) {

            try {
                await Promise.all(selectedItems.map(async (itemId) => {
                    await itemStore.deleteMedia(itemId);
                }));
                setSend(true);
                setSelectedItems([]);
                setDeleteOpen(false);
            } catch (error) {
                console.error('Error deleting selected items:', error);
            }

        }
        else {
            deletee();
        }
    };

    return (
        <>
            <div className="itemListDiv">
                <h2 className={classes.title}>רשימת קבצים</h2>
                <Grid item xs={12} md={2} lg={2}>
                    <TableContainer component={Paper} className="tableContainer" style={{ maxHeight: 470, overflow: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" className={classes.headerCell}>
                                        <Checkbox
                                            indeterminate={selectedItems.length > 0 && selectedItems.length < itemStore.mediaList.length}
                                            checked={selectedItems.length === itemStore.mediaList.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedItems(itemStore.mediaList.map((item) => item.id));
                                                } else {
                                                    setSelectedItems([]);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center" className={classes.headerCell}>
                                        כותרת
                                    </TableCell>
                                    <TableCell align="center" className={classes.headerCell}>
                                        תיאור
                                    </TableCell>
                                    <TableCell align="center" className={classes.headerCell}>
                                        קטגוריה
                                    </TableCell>
                                    <TableCell align="center" className={classes.headerCell}>
                                        מחבר
                                    </TableCell>
                                    <TableCell align="center" className={classes.headerCell}>
                                        סטטוס
                                    </TableCell>
                                    <TableCell align="center" className={classes.headerCell}>
                                        מדף/קובץ
                                    </TableCell>
                                    <TableCell align="center" className={classes.headerCell}>
                                        פעולה
                                    </TableCell>
                                    <TableCell align="center" className={classes.headerCell}>
                                        תגית
                                    </TableCell>
                                    <TableCell className={classes.headerCell}>
                                        <Button onClick={selectedItems.length > 0 ? handleDeleteSelectedItems : handleClickAdd} className={classes.addButton}>
                                            {selectedItems.length > 0 ? (
                                                <DeleteIcon />
                                            ) : (
                                                <Tooltip title="להוספת פריט חדש" arrow>
                                                    <AddIcon />
                                                </Tooltip>
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {itemStore.mediaList.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell align="center">
                                            <Checkbox
                                                color="primary"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">{item.title}</TableCell>
                                        <TableCell align="center">{item.description}</TableCell>
                                        <TableCell align="center">{item.category}</TableCell>
                                        <TableCell align="center">{item.author}</TableCell>
                                        {item.isApproved ? (
                                            <TableCell align="center" style={{ color: 'green' }}>
                                                מאושר
                                            </TableCell>
                                        ) : (
                                            <TableCell align="center" style={{ color: 'red' }}>
                                                ממתין לאישור
                                            </TableCell>
                                        )}
                                        { item.filePath.includes('https') ?(
                                        <TableCell align="center">
                                            <a href={item.filePath} target="_blank" rel="noopener noreferrer">
                                                {item.filePath}
                                            </a>
                                        </TableCell>
                                        ):(
                                        <TableCell align="center">{item.filePath}</TableCell>
                                         )}
                                        
                                        
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleClickEdit(item)}>
                                                <EditIcon style={{ color: '#468585' }} />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(item)}>
                                                <DeleteIcon style={{ color: '#50B498' }} />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" style={{ flexWrap: 'nowrap', overflowX: 'auto', width: '200px', color: '#A80B8BD' }}>
                                                {item.tags.map((tagId) => {
                                                    const tag = tagStore.tagList.find((tag) => tag.id === tagId);
                                                    if (tag) {
                                                        return (
                                                            <Chip
                                                                key={tag.id}
                                                                label={tag.name}
                                                                style={{ color: '#9CDBA6' }}
                                                                variant="outlined"
                                                                onDelete={() => handleDeleteChip(item, tag)}
                                                            />
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </div>
            <Dialog open={deleteOpen} onClose={handleClose} fullScreen={fullScreen} style={{ direction: 'rtl' }}>
                <DialogTitle>אישור מחיקה</DialogTitle>
                <DialogContent>
                    <p>האם אתה בטוח שברצונך למחוק {selectedItems.length} פריטים?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} style={{ color: '#468585' }}>
                        ביטול
                    </Button>
                    <Button onClick={handleConfirmBulkDelete} style={{ color: '#468585' }}>
                        מחיקה
                    </Button>
                </DialogActions>
                {send && (itemStore.isDelete ? <Success /> : <Failure />)}
            </Dialog>
            {editedItem && <ItemEdit mediaItem={editedItem} onClose={handleClose} />}
            {itemStore.add && <ItemAdd />}
            <Dialog open={deleteTagOpen} onClose={handleClose} fullScreen={fullScreen} style={{ direction: 'rtl' }}>
                <DialogTitle>אישור מחיקה</DialogTitle>
                <DialogContent>
                    <p>האם אתה בטוח שברצונך למחוק את התג הזה?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} style={{ color: '#468585' }}>
                        ביטול
                    </Button>
                    <Button onClick={confirmDelete} style={{ color: '#468585' }}>
                        מחיקה
                    </Button>
                </DialogActions>
                {send && (itemStore.isDelete ? <Success /> : <Failure />)}
            </Dialog>
        </>
    );
});

export default ItemList;
