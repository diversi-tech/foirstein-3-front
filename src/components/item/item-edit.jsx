import { useEffect, useState } from 'react';
import itemStore from '../../store/item-store';
import tagStore from '../../store/tag-store';
import Success from '../message/success';
import Failure from '../message/failure';
import {
  TextField, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Select, MenuItem, InputLabel, FormControl, Typography, useMediaQuery, useTheme, OutlinedInput, Box, Chip, Checkbox, ListItemText
} from '@mui/material';

export default function ItemEdit({ mediaItem, onClose }) {
  const tagMap = tagStore.tagList.reduce((map, tag) => {
    map[tag.id] = tag.name; // Changed to map tag id to tag name
    return map;
  }, {});

  const initialTagNames = Array.isArray(mediaItem.tags)
    ? mediaItem.tags.map((tagId) => tagMap[tagId])
    : [];

  const [id, setId] = useState(mediaItem.id);
  const [isApproved, setIsApproved] = useState(mediaItem.isApproved)
  const [formData, setFormData] = useState({
    title: mediaItem.title,
    description: mediaItem.description,
    category: mediaItem.category,
    author: mediaItem.author,
    tag: initialTagNames, // Initialize with tag names instead of tag ids
    filePath: mediaItem.filePath || '',
  });

  const [send, setSend] = useState(false);
  const [link, setLink] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  const [isFormValid, setIsFormValid] = useState(true);

  // useEffect(() => {
  //   checkLink();

  //   const isValid =
  //     formData.title.length >= 2 &&
  //     formData.description.length >= 5 &&
  //     formData.category.length >= 5 &&
  //     formData.author.length >= 5 &&
  //     formData.tag.length > 0;

  //   setIsFormValid(isValid);
  // }, [formData.filePath]);

  useEffect(() => {
    checkLink();

    const isValid =
      formData.title.length >= 2 &&
      formData.description.length >= 5 &&
      formData.category.length >= 2 &&
      formData.author.length >= 2 &&
      formData.tag.length > 0 &&
      (link || formData.filePath);

    setIsFormValid(isValid);
  }, [formData.title, formData.description, formData.category, formData.author, formData.tag, formData.filePath, link]);

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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category' || name === 'author') {
      const lettersRegex = /^[א-תA-Za-z\s]*$/;
      if (!lettersRegex.test(value)) {
        return; // If the value doesn't match, do nothing
      }
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleChangeChip = (event) => {
    const { target: { value } } = event;

    // const updatedTagIds = typeof value === 'string' ? value.split(',').map(tagName => tagMap[tagName]) : value;
    setFormData((prevData) => ({
      ...prevData,
      tag: value, // Store tag names directly
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      filePath: file ? URL.createObjectURL(file) : prevData.filePath,
      file: file || prevData.file
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('author', formData.author);
    formDataToSend.append('tags', formData.tag.join(',')); // Send tag names
    formDataToSend.append('filePath', formData.filePath);

    try {
      const response = await itemStore.updateMedia(formData.id, formDataToSend);
      if (response && response.ok) {
        setUpdateSuccess(true);
        onClose();
      } else {
        setUpdateSuccess(false);
        console.error('Error updating media:', response ? response.statusText : 'No response from server');
      }
    } catch (error) {
      setUpdateSuccess(false);

    // formDataToSend.append('isApproved', formData.isApproved);
    // // formDataToSend.append('tags', Array(formData.tag));
    // formDataToSend.append('tags', formData.tag.join(',')); // Send tag names
    // formDataToSend.append('filePath', formData.filePath);

    // // if (formData.file) {
    // //   formDataToSend.append('file', formData.file);
    // // }

    // try {
    //   let response;
    //   if (link) {
    //     response = await itemStore.updateMediaFile(formData.id, formDataToSend);
    //   } else {
    //     response = await itemStore.updateMediaBook(formData.id, formDataToSend);
    //   }

    //   if (response && response.ok) {
    //     onClose();
    //   } else {
    //     console.error('Error updating media:', response ? response.statusText : 'No response from server');
    //   }
    // } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  const checkLink = () => {
    const filePath = formData.filePath;
    if (typeof filePath === 'string' && filePath.includes('https')) {
      setLink(true);
    } else {
      setLink(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      style={{ direction: "rtl" }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>עריכת פרטים</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="כותרת"
            type="text"
            fullWidth
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          {formData.title && formData.title.length < 2 && (
            <Typography color="error">הכותרת חייבת להכיל לפחות 2 תווים</Typography>
          )}
          <TextField
            margin="dense"
            label="תיאור"
            type="text"
            fullWidth
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          {formData.description && formData.description.length < 5 && (
            <Typography color="error">התיאור חייב להכיל לפחות 5 תווים</Typography>
          )}
          <TextField
            margin="dense"
            label="קטגוריה"
            type="text"
            fullWidth
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          {formData.category && formData.category.length < 2 && (
            <Typography color="error">הקטגוריה חייבת להכיל לפחות 2 תווים</Typography>
          )}
          <TextField
            margin="dense"
            label="מחבר"
            type="text"
            fullWidth
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
          {formData.author && formData.author.length < 2 && (
            <Typography color="error">המחבר חייב להכיל לפחות 2 תווים</Typography>
          )}
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
                  {selected.map((tagName) => (
                    <Chip key={tagName} label={tagName} style={{ color: 'dark' }} variant='outlined' />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {tagStore.tagList.map((tag) => (
                <MenuItem key={tag.id} value={tag.name}>
                  <Checkbox checked={formData.tag.indexOf(tag.name) > -1} />
                  <ListItemText primary={tag.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="מיקום"
            type="text"
            fullWidth
            name="filePath"
            value={formData.filePath}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="filePath"
            onChange={handleFileChange}
            style={{ marginTop: '1rem' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} style={{ color: '#468585' }}>
            ביטול
          </Button>
          <Button type="submit" style={{ color: '#468585' }} onClick={() => { setSend(true) }} disabled={!isFormValid}>
            שמירה
          </Button>
          {send && (updateSuccess === true ? <Success /> : updateSuccess === false ? <Failure /> : null)}
        </DialogActions>
      </form>
    </Dialog>
  );
}