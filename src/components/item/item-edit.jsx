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

    // id: mediaItem.id,
    title: mediaItem.title,
    description: mediaItem.description,
    category: mediaItem.category,
    author: mediaItem.author,
    // isApproved: mediaItem.isApproved,
    tag: initialTagNames, // Initialize with tag names instead of tag ids
    filePath: mediaItem.filePath || '',
    // file: mediaItem.file || ''
  });

  const [send, setSend] = useState(false);
  const [link, setLink] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  useEffect(() => {
    checkLink();
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));   
  };

  const handleChangeChip = (event) => {
    const { target: { value } } = event;
    setFormData((prevData) => ({
      ...prevData,
      tag: value, // Store tag names directly
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    // formDataToSend.append('id', formData.id);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('author', formData.author);
    // formDataToSend.append('isApproved', formData.isApproved);
    formDataToSend.append('tags', formData.tag.join(',')); // Send tag names
    formDataToSend.append('filePath', formData.filePath);
    // if (formData.file) {
    //   formDataToSend.append('file', formData.file);
    // }
    console.log("Submitting form data:", formDataToSend);
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
                    <Chip key={tagName} label={tagName} />
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
          {!link && (
            <TextField
              margin="dense"
              label="מדף"
              type="text"
              fullWidth
              name="filePath"
              value={formData.filePath}
              onChange={handleChange}
              required
            />
          )}
          {link && (
            <TextField
              margin="dense"
              type="file"
              fullWidth
              name="filePath"
              onChange={(e) => setFormData({ ...formData, filePath: e.target.files[0] })}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            ביטול
          </Button>
          <Button type="submit" color="primary" onClick={() => { setSend(true) }} >
            שמירה
          </Button>
          {send && (updateSuccess === true ? <Success /> : updateSuccess === false ? <Failure /> : null)}
        </DialogActions>
      </form>
    </Dialog>
  );
}
