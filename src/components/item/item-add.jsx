import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import {
    Button,
    Radio,
    FormControlLabel,
    RadioGroup,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    FormControl,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    Chip,
    Box,
    OutlinedInput,
} from '@mui/material';
import itemStore from '../../store/item-store'; // Import the merged store
import Success from '../message/success';
import Failure from '../message/failure';
import tagStore from '../../store/tag-store';
import { useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ItemDdd = observer(() => {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [openF, setOpenF] = useState(false);
    const [error, setError] = useState(false);

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        category: '',
        author: '',
        isApproved: '',
        tag: [],
        filePath: null,
        file: null,
        isHandleUpload: false,
        selectedValue: '',
        open: false
    });
    const [isUpload, setIsUpload] = useState(false);

    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'mp4', 'docx', 'mp3'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const handleClose = () => {
        setOpen(false);
        itemStore.add = false;
        setFormData({
            id: '',
            title: '',
            description: '',
            category: '',
            author: '',
            isApproved: '',
            tag: [],
            filePath: null,
            file: null,
            isHandleUpload: false,
            selectedValue: '',
        });
    };

    const handleRadioChange = (event) => {
        setOpenF(true);
        const value = event.target.value;
        setFormData((prevData) => ({
            ...prevData,
            selectedValue: value,
            filePath: value === 'book' ? '' : prevData.filePath, // Reset filePath value if switching to file upload
        }));
    };

    const handleChange = (e) => {
        if (formData.selectedValue === 'book') {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            const file = e.target.files[0];
            setFormData((prevData) => ({
                ...prevData,
                file: file,
                filePath: file ? file.name : null,
            }));
        }
    };

    const handleChangeChip = (event) => {
        const {
            target: { value },
        } = event;
        setFormData((prevData) => ({
            ...prevData,
            tag:
                // On autofill we get a stringified value.
                typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const fileExtension = formData.file ? formData.file.name.split('.').pop().toLowerCase() : '';

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { selectedValue, file, ...dataToSend } = formData;
        const formDataToSend = selectedValue === 'book' ? { ...dataToSend } : { ...dataToSend, file };

        try {
            if (selectedValue === 'book') {
                // await itemStore.uploadMedia('book', formDataToSend);
                console.log("add book");
            } else {
                // await itemStore.uploadMedia('file', formDataToSend);
                console.log("add file");
            }
            setFormData({
                id: '',
                title: '',
                description: '',
                category: '',
                author: '',
                isApproved: '',
                tag: [],
                filePath: null,
                file: null,
                isHandleUpload: true,
                selectedValue: selectedValue,
            });
            setIsUpload(true);
            handleClose();
        } catch (error) {
            console.error('Failed to upload media:', error);
            // Handle error state or alert the user
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} style={{ direction: "rtl" }}>
                <DialogTitle>{formData.selectedValue === 'book' ? 'העלאת ספר' : 'העלאת קובץ דיגיטלי'}</DialogTitle>
                <FormControl>
                    <RadioGroup
                        aria-label="upload-type"
                        name="upload-type"
                        value={formData.selectedValue}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel value="book" control={<Radio />} label="ספר" />
                        <FormControlLabel value="file" control={<Radio />} label="קובץ דיגיטלי" />
                    </RadioGroup>
                </FormControl>

                {openF &&
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="titleId"
                                        label="כותרת"
                                        variant="outlined"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    // error={!formData.title}
                                    // helperText={!formData.title && 'זהו שדה חובה'}
                                    />
                                    {formData.title && formData.title.length < 2 && (
                                        <Typography color="error">הכותרת חייבת להכיל לפחות 2 תווים</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="descId"
                                        label="תיאור"
                                        variant="outlined"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    // error={!formData.description}
                                    // helperText={!formData.description && 'זהו שדה חובה'}
                                    />
                                    {formData.description && formData.description.length < 5 && (
                                        <Typography color="error">התיאור חייב להכיל לפחות 5 תווים</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="descId"
                                        label="קטגוריה"
                                        variant="outlined"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        // error={!formData.category}
                                        // helperText={!formData.category && 'זהו שדה חובה'}
                                        required
                                    />
                                    {formData.category && formData.category.length < 5 && (
                                        <Typography color="error">הקטגוריה חייבת להכיל לפחות 5 תווים</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="descId"
                                        label="מחבר"
                                        variant="outlined"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        // error={!formData.author}
                                        // helperText={!formData.author && 'זהו שדה חובה'}
                                        required
                                    />
                                    {formData.author && formData.author.length < 5 && (
                                        <Typography color="error">המחבר חייב להכיל לפחות 5 תווים</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-chip-label">תגית</InputLabel>
                                    <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        name='tag'
                                        multiple
                                        value={formData.tag}
                                        onChange={handleChangeChip}
                                        input={<OutlinedInput id="select-multiple-chip" label="תגית" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {tagStore.tagList.map((name) => (
                                            <MenuItem
                                                key={name.id}
                                                value={name.name}
                                            >
                                                {name.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {formData.selectedValue === 'book' && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="filePathId"
                                            label="מיקום"
                                            variant="outlined"
                                            name="filePath"
                                            value={formData.filePath}
                                            onChange={handleChange}
                                            // error={!formData.filePath}
                                            // helperText={!formData.filePath && 'זהו שדה חובה'}
                                            required
                                        />
                                    </FormControl>
                                </Grid>
                            )}
                            {formData.selectedValue === 'file' && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="fileId"
                                            type="file"
                                            label="מיקום"
                                            onChange={handleChange}
                                            // error={!formData.file}
                                            // helperText={!formData.file && 'זהו שדה חובה'}
                                            required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        {formData.file && !allowedExtensions.includes(fileExtension) && (
                                            <Typography color="error">סוג קובץ לא נתמך. אנא בחר/י PDF, JPG, JPEG, PNG,docx, ZIP, mp3, או MP4 file.</Typography>
                                        )}
                                        {formData.file && formData.file.size > maxSize && (
                                            <Typography color="error">הקובץ גדול מדי. אנא בחר/י קובץ קטן יותר מ-5 מגה-בייט.</Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>
                    </DialogContent>
                }
                <DialogActions>
                    <Button type="submit" onClick={handleSubmit}>העלאה</Button>
                    <Button onClick={handleClose}>ביטול</Button>
                </DialogActions>
                {isUpload && (
                    <>
                        {itemStore.isError ? <Failure /> : <Success />}
                    </>
                )}
            </Dialog>

        </>
    );
});
export default ItemDdd;