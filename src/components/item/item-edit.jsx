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


import { useEffect, useState } from 'react';
import itemStore from '../../store/item-store';
import tagStore from '../../store/tag-store';
import Success from '../message/success';
import Failure from '../message/failure';
import { TextField, Button,
  Dialog, DialogActions, DialogContent,
  DialogTitle, Select, MenuItem, InputLabel, FormControl, Typography, useMediaQuery, useTheme, OutlinedInput, Box, Chip
} from '@mui/material';

export default function ItemEdit ({ mediaItem, onClose }) {
  const [formData, setFormData] = useState({
    id: mediaItem.id,
    title: mediaItem.title,
    description: mediaItem.description, 
    category: mediaItem.category,
    author: mediaItem.author,
    isApproved: mediaItem.isApproved,
    tag: Array.isArray(mediaItem.tag) ? mediaItem.tag : [],
    filePath: mediaItem.filePath || '',
    file: mediaItem.file || ''
  });
  console.log("id:  ",mediaItem.id);  

  const [send, setSend] = useState(false);
  useEffect(() =>{
    checkLink();
  })



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
    formDataToSend.append('category', formData.category);
    formDataToSend.append('author', formData.author);
    formDataToSend.append('isApproved', formData.isApproved);
    formDataToSend.append('tags', JSON.stringify(formData.tag));
    formDataToSend.append('filePath', formData.filePath);
    if (formData.file) {
      formDataToSend.append('file', formData.file);
    }
    console.log("id: ", itemStore.mediaList.id);
    try {
      const response = await itemStore.updateMedia(formData.id, formDataToSend);
      console.log("Server Response:", response);
      console.log("id- ", formData.id);
      // בדיקת תגובה לפני גישה למאפיינים שלה
      if (response && response.ok) {
        console.log("sendToServerEditChanges");
        onClose();
      } else {
        console.error('Error updating media:', response ? response.statusText : 'No response from server');
      }
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };
  
  const [link, setLink] = useState(false);
  // const checkLink = () => {
  //   if (itemStore.filePath.include('http') || itemStore.filePath.include('.')) {
  //     setLink(true);
  //   } 
  //   else {
  //     setLink(false);
  //   }
  // };  

  // הבדיקה לא עובדת לי נכון
  const checkLink = () => {
    const filePath = formData.filePath;
    // console.log("beforeLink: ", link);
    // return filePath.includes('http');
    setLink(filePath.includes('http') || filePath.includes('.'));
    // console.log("afterLink:",link);
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
            // onBlur={checkLink}
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
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {/* צריך לשלוח לשרת מספר תג ולא שם */}
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
          {/* בדיקה אם הוא לינק או לא */}
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
          {/* {formData.filePath && formData.filePath.length < 2 && (
            <Typography color="error">הקטגוריה חייבת להכיל לפחות 2 תווים</Typography>
          )} */}
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
          <Button type="submit" color="primary" onClick={()=>{setSend(true)}}>
            שמירה
          </Button>
          {/*לטפל בזה אח"כ*/}
          {send &&(itemStore.isUpdate ? <Success /> : <Failure/>)}
        </DialogActions>
      </form>
    </Dialog>
  );
}


