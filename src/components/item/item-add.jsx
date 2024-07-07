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
    Checkbox,
    ListItemText
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

    const [isApproved, setIsApproved] = useState();
    const [isHandleUpload, setIsHndleUpload] = useState(false);
    const [selectedValue, setSelectedValue] = useState('')
    useState
    const [formData, setFormData] = useState({
        // id: '',
        title: '',
        description: '',
        category: '',
        author: '',
        // isApproved: '',
        tag: [],
        filePath: null,
        // file: null,
        // isHandleUpload: false,
        // selectedValue: '',
        // open: false
    });
    const [isUpload, setIsUpload] = useState(false);

    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'mp4', 'docx', 'mp3'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const handleClose = () => {
        setOpen(false);
        itemStore.add = false;
        setFormData({
            // id: '',
            title: '',
            description: '',
            category: '',
            author: '',
            // isApproved: '',
            tag: [],
            filePath: null,
            file: null,
            // isHandleUpload: false,
            // selectedValue: '',
        });
        setIsHndleUpload(false);
        setSelectedValue('');
        setIsApproved('')
    };

    const handleRadioChange = (event) => {
        setOpenF(true);
        const value = event.target.value;
        setFormData((prevData) => ({
            ...prevData,

            filePath: value === 'book' ? '' : prevData.filePath, // Reset filePath value if switching to file upload
        }));
        setSelectedValue(value)
    };


    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0],
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };



    const handleTagChange = (event) => {
        const { value } = event.target;
        setFormData((prevData) => {
            const newTags = typeof value === 'string' ? value.split(',') : value;
            return {
                ...prevData, tag: newTags.map(tagName => {
                    const tag = tagStore.tagList.find(t => t.name === tagName);
                    return tag ? tag.id : tagName;
                })
            };
        });
    };


    const fileExtension = formData.filePath ? formData.filePath.name.split('.').pop().toLowerCase() : '';


    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = { ...formData };

        const formDataToSend = new FormData();
        for (const key in dataToSend) {
            if (key === 'tag') {
                const tagIds = dataToSend[key].map(tagName => {
                    const tag = tagStore.tagList.find(t => t.name === tagName);
                    return tag ? tag.id : tagName;
                });
                tagIds.forEach(tagId => formDataToSend.append('tags[]', tagId)); // השתמש בשם המפתח 'tags[]' כדי לציין מערך
            } else {
                formDataToSend.append(key, dataToSend[key]);
            }
        }

        try {
            await itemStore.uploadMedia(formDataToSend);
            setFormData({
                title: '',
                description: '',
                category: '',
                author: '',
                tag: [],
                filePath: null,
            });
            setIsHndleUpload(true);
            setSelectedValue('');
            setIsUpload(true);
            handleClose();
        } catch (error) {
            console.error('Failed to upload media:', error);
        }
    };





    return (
        <>
            <Dialog open={open} onClose={handleClose} style={{ direction: "rtl" }}>
                <DialogTitle>{selectedValue === 'book' ? 'העלאת ספר' : 'העלאת קובץ דיגיטלי'}</DialogTitle>
                <FormControl>
                    <RadioGroup
                        aria-label="upload-type"
                        name="upload-type"
                        value={selectedValue}
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
                                    />
                                    {formData.description && formData.description.length < 5 && (
                                        <Typography color="error">התיאור חייב להכיל לפחות 5 תווים</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="categoryId"
                                        label="קטגוריה"
                                        variant="outlined"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
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
                                        id="authorId"
                                        label="מחבר"
                                        variant="outlined"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        required
                                    />
                                    {formData.author && formData.author.length < 5 && (
                                        <Typography color="error">המחבר חייב להכיל לפחות 5 תווים</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="tag-label">תגית</InputLabel>
                                    <Select
                                        labelId="tag-label"
                                        id="tag-select"
                                        multiple
                                        value={formData.tag}
                                        onChange={handleTagChange}
                                        input={<OutlinedInput id="select-multiple-chip" label="תגית" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const tag = tagStore.tagList.find(tag => tag.id === value);
                                                    return <Chip key={value} label={tag ? tag.name : value} />;
                                                })}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {tagStore.tagList.map((tag) => (
                                            <MenuItem key={tag.id} value={tag.id}>
                                                <Checkbox checked={formData.tag.indexOf(tag.id) > -1} />
                                                <ListItemText primary={tag.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>


                            </Grid>
                            {selectedValue === 'book' && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="filePathId"
                                            label="מיקום"
                                            variant="outlined"
                                            name="filePath"
                                            value={formData.filePath}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormControl>
                                </Grid>
                            )}
                            {selectedValue === 'file' && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="fileId"
                                            type="file"
                                            label="מיקום"
                                            name="filePath"
                                            onChange={handleChange}
                                            required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        {formData.filePath && !allowedExtensions.includes(fileExtension) && (
                                            <Typography color="error">סוג קובץ לא נתמך. אנא בחר/י PDF, JPG, JPEG, PNG, docx, ZIP, mp3, או MP4 file.</Typography>
                                        )}
                                        {/* {formData.filePath && formData.file.size > maxSize && (
                                        <Typography color="error">הקובץ גדול מדי. אנא בחר/י קובץ קטן יותר מ-5 מגה-בייט.</Typography>
                                    )} */}
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
