
import * as React from 'react';
import { observer } from "mobx-react-lite";
import { useState } from 'react';
import { Button, TextField, DialogActions, DialogContent, DialogTitle, Alert, Select, MenuItem, InputLabel, Typography, FormControl } from '@mui/material';
import bookStore from '../store/bookStore';
import mediaStore from '../store/mediaStore';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

const Form = observer(() => {
    const [selectedValue, setSelectedValue] = useState('book');
    const [open, setOpen] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');
    const [shelf, setShelf] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    // Validate file type and size (example: max 5MB)
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'mp4', 'zip'];
    const fileExtension = file ? file.name.split('.').pop().toLowerCase() : '';
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validate = () => {
        if (bookStore.isClick) {
            if (!description || !title || !tag || !shelf) {
                setError('Please fill in all required fields.');
                return false;
            } else if (typeof description !== 'string' || typeof title !== 'string' || typeof shelf !== 'string') {
                setError('Inputs must be a string.');
                return false;
            }
        } else {
            if (file) {
                if (!allowedExtensions.includes(fileExtension)) {
                    setError('Invalid file type. Please upload a PDF, JPG, JPEG, PNG, or MP4 file.');
                    return false;
                }

                if (file.size > maxSize) {
                    setError('File is too large. Please upload a file smaller than 5MB.');
                    return false;
                }
            }
        }

        if (title.length < 2) {
            setError('Title must be at least 2 characters long');
            return false;
        }

        if (description.length < 5) {
            setError('Description must be at least 5 characters long');
            return false;
        }

        setError('');
        return true;
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpload = (event) => {
        event.preventDefault();
        if (validate()) {
            console.log('Form submitted successfully with:', { title, description, tag, shelf });
            handleClose();
        }
    };

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
        setShelf('');
    };

    return (
        <>
            <React.Fragment>
                <DialogTitle>Upload Book</DialogTitle>
                
                {/* select type to Upload */}
                <FormControl>
                  <RadioGroup
                    aria-label="upload-type"
                    name="upload-type"
                    value={selectedValue}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel value="book" control={<Radio />} label="book" />
                    <FormControlLabel value="file" control={<Radio />} label="digital file" />
                  </RadioGroup>
                </FormControl>

                <DialogContent>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Typography gutterBottom>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="titleId"
                                label="Title"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                error={!title}
                                helperText={!title ? 'Title is required' : ''}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="descId"
                                label="Description"
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                error={!description}
                                helperText={!description ? 'Description is required' : ''}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="tag-label">Tag</InputLabel>
                            <Select
                                labelId="tag-label"
                                id="demo-simple-select"
                                value={tag}
                                label="Tag"
                                onChange={(e) => setTag(e.target.value)}
                                error={!tag}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="Tag1">Tag1</MenuItem>
                                <MenuItem value="Tag2">Tag2</MenuItem>
                            </Select>
                            {!tag && <Typography color="error">Tag is required</Typography>}
                        </FormControl>
                        {selectedValue === 'book' && bookStore.isClick && (
                            <FormControl fullWidth margin="normal">
                            <TextField
                                id="shelfId"
                                label="Shelf"
                                type='text'
                                variant="outlined"
                                value={shelf}
                                onChange={(e) => setShelf(e.target.value)}
                                error={!shelf}
                                helperText={!shelf ? 'Shelf is required' : ''}
                            />
                        </FormControl>
                        )}
                        {selectedValue === 'file' && mediaStore.isClick && (
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="fileId"
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    accept=".pdf, .jpg, .jpeg, .png, .mp4"
                                />
                                {file && !allowedExtensions.includes(fileExtension) && (
                                    <Typography color="error">Invalid file type. Please upload a PDF, JPG, JPEG, PNG, or MP4 file.</Typography>
                                )}
                                {file && file.size > maxSize && (
                                    <Typography color="error">File is too large. Please upload a file smaller than 5MB.</Typography>
                                )}
                            </FormControl>
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={handleUpload}>Upload</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </React.Fragment>
        </>
    );
});

export default Form;

