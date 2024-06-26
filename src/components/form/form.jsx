import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import {
    Button,
    Radio,
    FormControlLabel,
    RadioGroup,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
    Alert,
    Select,
    MenuItem,
    InputLabel,
    Typography,
    FormControl,
    Grid
} from '@mui/material';
import mediaStore from '../../store/mediaStore'; // Import the merged store
import MediaTable from './mediaTable';

const Form = observer(() => {
    const [formData, setFormData] = useState({
        open: false,
        title: '',
        description: '',
        tag: '',
        shelf: '',
        file: null,
        isHandleUpload: false,
        selectedValue: ''
    });
    const [isUpload, setIsUpload] = useState(false)

    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'mp4'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const handleClose = () => {
        setFormData((prevData) => ({
            ...prevData,
            open: false
        }));
    };

    // const handleUpload = () => {
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         isHandleUpload: true
    //     }));
    //     // Perform upload action here
    // };

    const handleRadioChange = (event) => {
        const value = event.target.value;
        setFormData((prevData) => ({
            ...prevData,
            selectedValue: value,
            open: true,
            shelf: value === 'book' ? '' : prevData.shelf // Reset shelf value if switching to file upload
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            file: file
        }));
    };

    const fileExtension = formData.file ? formData.file.name.split('.').pop().toLowerCase() : '';

    const handleSubmit = async (event) => {

        event.preventDefault();
        const { selectedValue, file, ...dataToSend } = formData;
        const formDataToSend = selectedValue === 'book' ? { ...dataToSend } : { ...dataToSend, file };

        if (selectedValue === 'book') {
            delete formDataToSend.file;
        } else {
            delete formDataToSend.shelf;
        }

        try {
            if (selectedValue === 'book') {
                //await mediaStore.uploadMedia('book', formDataToSend);
                console.log("add book");
            } else {
                // await mediaStore.uploadMedia('file', formDataToSend);
                console.log("add file");
            }
            setFormData({
                open: true,
                title: '',
                description: '',
                tag: '',
                shelf: '',
                file: null,
                isHandleUpload: true,
                selectedValue: ''
            });
        } catch (error) {
            console.error('Failed to upload media:', error);
            // Handle error state or alert the user
        }
        setIsUpload(true)
    };

    return (
        <>
            <MediaTable></MediaTable>
            <div className='divForm'>
                <React.Fragment>
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

                    {formData.open && (
                        <div>
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
                                                error={!formData.title}
                                                helperText={!formData.title && 'זהו שדה חובה'}
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
                                                error={!formData.description}
                                                helperText={!formData.description && 'זהו שדה חובה'}
                                            />
                                            {formData.description && formData.description.length < 5 && (
                                                <Typography color="error">התיאור חייב להכיל לפחות 5 תווים</Typography>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="tag-label">תגית</InputLabel>
                                            <Select
                                                labelId="tag-label"
                                                id="demo-simple-select"
                                                value={formData.tag}
                                                label="תגית"
                                                name="tag"
                                                onChange={handleChange}
                                                error={!formData.tag}
                                                displayEmpty
                                            >
                                                <MenuItem value=""><em>אחר</em></MenuItem>
                                                <MenuItem value="Tag1">תגית1</MenuItem>
                                                <MenuItem value="Tag2">תגית2</MenuItem>
                                            </Select>
                                            {!formData.tag && (
                                                <Typography color="error">זהו שדה חובה</Typography>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    {formData.selectedValue === 'book' && (
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="shelfId"
                                                    label="מדף"
                                                    variant="outlined"
                                                    name="shelf"
                                                    value={formData.shelf}
                                                    onChange={handleChange}
                                                    error={!formData.shelf}
                                                    helperText={!formData.shelf && 'זהו שדה חובה'}
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
                                                    onChange={handleFileChange}
                                                    error={!formData.file}
                                                    helperText={!formData.file && 'זהו שדה חובה'}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                                {formData.file && !allowedExtensions.includes(fileExtension) && (
                                                    <Typography color="error">סוג קובץ לא נתמך. אנא בחר/י PDF, JPG, JPEG, PNG, ZIP, או MP4 file.</Typography>
                                                )}
                                                {formData.file && formData.file.size > maxSize && (
                                                    <Typography color="error">הקובץ גדול מדי. אנא בחר/י קובץ קטן יותר מ-5 מגה-בייט.</Typography>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    )}
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button type="submit" onClick={handleSubmit}>העלאה</Button>
                                <Button onClick={handleClose}>ביטול</Button>
                            </DialogActions>

                            {isUpload && mediaStore.isError && (
                                <Alert severity="error">.אירעה שגיאה בהעלאת המדיה. אנא נסה שוב</Alert>
                            )}
                            {isUpload && !mediaStore.isError && (
                                <Alert severity="success">המדיה הועלה בהצלחה!</Alert>
                            )}
                        </div>
                    )}
                </React.Fragment>
            </div>
        </>
    );
});

export default Form;
