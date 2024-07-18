import { useEffect, useState } from 'react';
import itemStore from '../../store/item-store';
import tagStore from '../../store/tag-store';
import Swal from 'sweetalert2'
import {
  TextField, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Select, MenuItem, InputLabel, FormControl, Typography, useMediaQuery, useTheme, OutlinedInput, Box, Chip, Checkbox, ListItemText, IconButton
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
    publishingYear: mediaItem.publishingYear,
    isApproved: mediaItem.isApproved,
    tags: initialTagIds,
    filePath: mediaItem.filePath || '',
  });

  const [send, setSend] = useState(false);
  const [link, setLink] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [isFormValid, setIsFormValid] = useState(true);
  const [openI, setOpenI] = useState(true);
  const [res, setRes] = useState(false);

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
    const formDataToSend = new FormData();
    formDataToSend.append('id', formData.id);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('author', formData.author);
    formDataToSend.append('publishingYear', formData.publishingYear);
    formDataToSend.append('isApproved', formData.isApproved);
    formData.tags.forEach(tagId => formDataToSend.append('tags[]', tagId));
    if (formData.file) {
      formDataToSend.append('filePath', formData.file); // Append the file directly as IFormFile
    } else {
      formDataToSend.append('filePath', formData.filePath); // Use existing filePath
    } 
    onClose();
    Swal.fire({
      title: "?האם ברצונך לעדכן את הנתונים",
      showDenyButton: true,
      confirmButtonText: "אישור",
      denyButtonText: `ביטול`
    }).then(async(result) => {
      if (result.isConfirmed) {
        if (link) {
        await itemStore.updateMediaFile(formData.id, formDataToSend);
           Swal.fire({
            icon: "success",
            title: "השינויים נשמרו בהצלחה",
            showConfirmButton: false,
            timer: 1500
          });
      }
       else {
         await itemStore.updateMediaBook(formData.id, formDataToSend);
          Swal.fire({
            icon: "success",
            title: "השינויים נשמרו בהצלחה",
            showConfirmButton: false,
            timer: 1500
          });
      }    
      }
       else if (result.isDenied) {
        Swal.fire({
          icon: "info",
          title: "לא נשמרו שינויים",
          showConfirmButton: false,
          timer: 1500
        });
      }
      else
      Swal.fire({
        icon: "error",
        title: "אופס... תקלה בעת שמירת השינויים",
        showConfirmButton: false,
        timer: 1500
      });
    });
  };  

  const checkLink = () => {
    const filePath = formData.filePath;
    setLink(filePath.includes('https') || /\.(pdf|jpg|jpeg|png|zip|mp3|mp4|docx)$/.test(filePath));
  };
    
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
           {formData.description === formData.title  &&(
            <Typography color="error">שם וכותרת לא יוכלים להיות זהים</Typography>
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
          {!formData.filePath.includes('https') &&
           <TextField
           margin="dense"
           label="שנת הוצאה"
           type="text"
           fullWidth
           name="publishingYear"
           value={formData.publishingYear || ""}
           onChange={handleChange}
           inputProps={{ minLength:4, maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
           required
           />
          }
        {formData.publishingYear && formData.publishingYear.length === 4 && parseInt(formData.publishingYear) > new Date().getFullYear() && (
          <Typography color="error">יש להכניס שנת הוצאה תקינה </Typography>
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
          <Button type="submit" style={{ color: '#468585' }} >
            שמירה
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}