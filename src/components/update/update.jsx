import React, { useState } from 'react';
import mediaStore from '../../store/mediaStore';
import Success from '../message/success';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl, Typography, useMediaQuery, useTheme } from '@mui/material';

const UpdateDialog = ({ mediaItem, onClose }) => {
  const [formData, setFormData] = useState({
    title: mediaItem.title,
    description: mediaItem.description,
    tag: mediaItem.tag,
    shelf: mediaItem.shelf || '',
    file: mediaItem.file || ''
  });

  const theme = useTheme();//רספונסיבי
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));//רספונסיבי

  const availableTags = ['Tag1', 'Tag2'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleUpdate = () =>{
    mediaStore.updateMedia();
    
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await mediaStore.updateMedia(mediaItem.id, formData);
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
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
          <FormControl fullWidth margin="dense">
            <InputLabel id="tag-label">תגית</InputLabel>
            <Select
              labelId="תגית"
              name="tag"
              value={availableTags.includes(formData.tag) ? formData.tag : ''}
              onChange={handleChange}
              required
            >
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>{tag}</MenuItem>
              ))}
            </Select>
            {!formData.tag && (
              <Typography color="error">זהו שדה חובה</Typography>
            )}
          </FormControl>
          {mediaItem.type === 'book' && (
            <TextField
              margin="dense"
              label="מדף"
              type="text"
              fullWidth
              name="shelf"
              value={formData.shelf}
              onChange={handleChange}
              required
            />
          )}
          {mediaItem.type === 'file' && (
            <TextField
              margin="dense"
              // label="קובץ"
              type="file"
              fullWidth
              name="file"
              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            ביטול
          </Button>
          <Button type="submit" color="primary" onClick={handleUpdate}>
            שמירה
          </Button>
          {mediaStore.isUpdate && <Success/>}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateDialog;
