// import React, { useState, useEffect } from 'react';
// import itemStore from '../../store/itemStore';
// import Success from '../message/success';
// import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl, Typography, useMediaQuery, useTheme, OutlinedInput, Box, Chip } from '@mui/material';
// import tagStore from '../../store/tagStore';

// const UpdateDialog = ({ mediaItem, onClose }) => {
//   const [formData, setFormData] = useState({
//     id : mediaItem.id,
//     title: mediaItem.title,
//     description: mediaItem.description,
//     tag: Array.isArray(mediaItem.tag) ? mediaItem.tag : [],
//     shelf: mediaItem.shelf || '',
//     file: mediaItem.file || ''
//   });

//   const ITEM_HEIGHT = 48;
//   const ITEM_PADDING_TOP = 8;
//   const MenuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//         width: 250,
//       },
//     },
//   };

//   const theme = useTheme(); // רספונסיבי
//   const fullScreen = useMediaQuery(theme.breakpoints.down('sm')); // רספונסיבי

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     await itemStore.updateMedia(mediaItem.id, formData);
//     onClose();
//   };

//   const handleChangeChip = (event) => {
//     const {
//       target: { value },
//     } = event;

//     let updatedTags = value;

//     if (typeof value === 'string') {
//       // Split the string into an array using commas as delimiters
//       updatedTags = value.split(',');
//     }

//     setFormData((prevData) => ({
//       ...prevData,
//       tag: updatedTags,
//     }));
//   };



//   return (
//     <Dialog
//       open={true}
//       onClose={onClose}
//       fullScreen={fullScreen}
//       maxWidth="sm"
//       fullWidth
//     >
//       <form onSubmit={handleSubmit}>
//         <DialogTitle>עריכת פרטים</DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             label="כותרת"
//             type="text"
//             fullWidth
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//           {formData.title && formData.title.length < 2 && (
//             <Typography color="error">הכותרת חייבת להכיל לפחות 2 תווים</Typography>
//           )}
//           <TextField
//             margin="dense"
//             label="תיאור"
//             type="text"
//             fullWidth
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//           />
//           {formData.description && formData.description.length < 5 && (
//             <Typography color="error">התיאור חייב להכיל לפחות 5 תווים</Typography>
//           )}

//           <FormControl fullWidth>
//             <InputLabel id="demo-multiple-chip-label">תגית</InputLabel>
//             <Select
//               labelId="demo-multiple-chip-label"
//               id="demo-multiple-chip"
//               name='tag'
//               multiple
//               value={formData.tag}
//               onChange={handleChangeChip}
//               input={<OutlinedInput id="select-multiple-chip" label="תגית" />}
//               renderValue={(selected) => (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                   {selected.map((value) => (
//                     <Chip key={value} label={value} />
//                   ))}
//                 </Box>
//               )}
//               MenuProps={MenuProps}
//             >
//               {tagStore.tagList.map((name) => (
//                 <MenuItem
//                   key={name.id}
//                   value={name.name}
//                 >
//                   {name.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {mediaItem.type === 'book' && (
//             <TextField
//               margin="dense"
//               label="מדף"
//               type="text"
//               fullWidth
//               name="shelf"
//               value={formData.shelf}
//               onChange={handleChange}
//               required
//             />
//           )}
//           {mediaItem.type === 'file' && (
//             <TextField
//               margin="dense"
//               type="file"
//               fullWidth
//               name="file"
//               onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
//             />
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose} color="primary">
//             ביטול
//           </Button>
//           <Button type="submit" color="primary">
//             שמירה
//           </Button>
//           {itemStore.isUpdate && <Success />}
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// };

// export default UpdateDialog;





import React, { useState } from 'react';
import itemStore from '../../store/item-store';
import Success from '../message/success';
import {
  TextField, Button,
  Dialog, DialogActions, DialogContent,
  DialogTitle, Select, MenuItem, InputLabel,
  FormControl, Typography, useMediaQuery, useTheme,
  OutlinedInput, Box, Chip
} from '@mui/material';
import tagStore from '../../store/tag-store';
import Failure from '../message/failure';

export default function ItemEdit ({ mediaItem, onClose }) {
  const [formData, setFormData] = useState({
    id: mediaItem.id,
    title: mediaItem.title,
    description: mediaItem.description,
    tag: Array.isArray(mediaItem.tag) ? mediaItem.tag : [],
    shelf: mediaItem.shelf || '',
    file: mediaItem.file || ''
  });

  const [send, setSend] = useState(false)

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

  const theme = useTheme(); // רספונסיבי
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm')); // רספונסיבי

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleChangeChip = (event) => {
    const {
      target: { value },
    } = event;

    let updatedTags = value;

    if (typeof value === 'string') {
      updatedTags = value.split(',');
    }

    setFormData((prevData) => ({
      ...prevData,
      tag: updatedTags,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('id', formData.id);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('tag', formData.tag.id);
    formDataToSend.append('shelf', formData.shelf);
    if (formData.file) {
      formDataToSend.append('file', formData.file);
    }

    try {
     // await itemStore.updateMedia(mediaItem.id, formDataToSend);
     console.log("sendToServerEditChanges");
      onClose();
    } catch (error) {
      console.error('Error updating media:', error);
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
          <Button type="submit" color="primary" onClick={()=>{setSend(true)}}>
            שמירה
          </Button>
          {/*לטפל בזה אח"כ*/}
          {send &&(itemStore.isUpdate ? <Success /> : <Failure/>)}
        </DialogActions>
      </form>
    </Dialog>
  );
};