import React, { useEffect, useState } from 'react';
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
    map[tag.id] = tag.name;
    return map;
  }, {});

  const initialTagIds = Array.isArray(mediaItem.tags)
    ? mediaItem.tags.map((tagId) => tagId)
    : [];

  const [formData, setFormData] = useState({
    id: mediaItem.id,
    title: mediaItem.title,
    description: mediaItem.description,
    category: mediaItem.category,
    author: mediaItem.author,
    year: mediaItem.year,
    isApproved: mediaItem.isApproved,
    tags: initialTagIds,
    filePath: mediaItem.filePath || '',
  });

  const [send, setSend] = useState(false);
  const [link, setLink] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [openI, setOpenI] = useState(true);

  useEffect(() => {
    checkLink();
    itemStore.fetchMedia();
  }, [formData.filePath]);

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
        return;
      }
    }
    if (name === 'year') {
      const currentYear = new Date().getFullYear();
      const numbersRegex = /^\d{0,4}$/;
      if (!numbersRegex.test(value) || (value.length === 4 && parseInt(value) > currentYear)) {
        return;
      }
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleChangeChip = (event) => {
    const { target: { value } } = event;
    setFormData((prevData) => ({
      ...prevData,
      tags: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      filePath: file ? file.name : prevData.filePath,
      file: file || null
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentYear = new Date().getFullYear();
    if (formData.year.length !== 4 || parseInt(formData.year) > currentYear) {
      console.error('Invalid year');
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append('id', formData.id);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('author', formData.author);
    formDataToSend.append('year', formData.year);
    formDataToSend.append('isApproved', formData.isApproved);
    formData.tags.forEach(tagId => formDataToSend.append('tags[]', tagId));
    if (formData.file) {
      formDataToSend.append('filePath', formData.file);
    } else {
      formDataToSend.append('filePath', null); // שליחת NULL כאשר הקובץ לא עודכן
    }
    try {
      if (link) {
        await itemStore.updateMediaFile(formData.id, formDataToSend);
      } else {
        await itemStore.updateMediaBook(formData.id, formDataToSend);
      }
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };  

  const checkLink = () =>{
    const filePath = formData.filePath;
    console.log(filePath);
    setLink(filePath.includes('https')|| filePath.includes('pdf')|| filePath.includes('jpg')|| filePath.includes('jpeg')|| filePath.includes('png')|| filePath.includes('zip')|| filePath.includes('mp3')|| filePath.includes('mp4')|| filePath.includes('docx'));
  }

  return (
    <Dialog
      open={openI}
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
          <TextField
            margin="dense"
            label="שנת הוצאה"
            type="text"
            fullWidth
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            />
          {formData.year && formData.year.length === 4 && parseInt(formData.year) > new Date().getFullYear() && (
            <Typography color="error">יש להכניס שנת הוצאה תקינה</Typography>
          )}
          <FormControl fullWidth>
            <InputLabel id="demo-multiple-chip-label">תגית</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              name='tag'
              multiple
              value={formData.tags}
              onChange={handleChangeChip}
              input={<OutlinedInput id="select-multiple-chip" label="תגית" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((tagId) => (
                    <Chip key={tagId} label={tagMap[tagId]} style={{ color: 'dark' }} variant='outlined' />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
              >
              {tagStore.tagList.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  <Checkbox checked={formData.tags.indexOf(tag.id) > -1} />
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
            style={{ marginRight: '1rem' }}
            disabled={link}
          />
          {link && (
            <input
              type="file"
              name="filePath"
              onChange={handleFileChange}
              style={{ marginTop: '1rem' }}
            />
          )} 
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} style={{ color: '#468585' }}>
            ביטול
          </Button>
          <Button type="submit" style={{ color: '#468585' }} onClick={() => {setSend(true)}} disabled={!isFormValid}>
            שמירה
          </Button>
          {send && (itemStore.isUpdate ? <Success /> : <Failure />)}
        </DialogActions>
      </form>
    </Dialog>
  );
}
