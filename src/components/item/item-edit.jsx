import { useEffect, useState } from "react";
import itemStore from "../../store/item-store";
import tagStore from "../../store/tag-store";
import Swal from "sweetalert2";
import { LevelEnum } from "../Enums";
import { TypeEnum } from "../Enums";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
// import StarBorderIcon from '@mui/icons-material/StarBorder';
// import StarIcon from '@mui/icons-material/Star';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  useMediaQuery,
  useTheme,
  OutlinedInput,
  Box,
  Chip,
  Checkbox,
  ListItemText,
  IconButton,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import addNewRequestStore from "../../store/AddNewRequest-store";

export default function ItemEdit({ numOfDay, mediaItem, onClose }) {
  const tagMap = tagStore.tagList.reduce((map, tag) => {
    map[tag.id] = tag.name;
    return map;
  }, {});

  const initialTagIds = Array.isArray(mediaItem.tags)
    ? mediaItem.tags.map((tagId) => tagId)
    : [];
// const isApprovedNumOfDay = true;
  const [formData, setFormData] = useState({
    id: mediaItem.id,
    title: mediaItem.title,
    description: mediaItem.description,
    category: mediaItem.category,
    amount: mediaItem.amount,
    author: mediaItem.author,
    publishingYear: mediaItem.publishingYear,
    isApproved: mediaItem.isApproved,
    tags: initialTagIds,
    filePath: mediaItem.filePath || "",
    recommended: mediaItem.recommended,
    itemType: mediaItem.itemType,
    // amount: mediaItem.amount,
    numberOfDaysOfQuestion: mediaItem.numberOfDaysOfQuestion,
    edition: mediaItem.edition,
    // available: mediaItem.available,
    series: mediaItem.series,
    numOfSeries: mediaItem.numOfSeries,
    language: mediaItem.language,
    note: mediaItem.note,
    accompanyingMaterial: mediaItem.accompanyingMaterial,
    itemLevel: mediaItem.itemLevel,
    hebrewPublicationYear: mediaItem.hebrewPublicationYear,
  });

  const [send, setSend] = useState(false);
  const [link, setLink] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [isFormValid, setIsFormValid] = useState(true);
  const [openI, setOpenI] = useState(true);
  const [res, setRes] = useState(false);
  const [availability, setAvailability] = useState(formData.available);
  const [selectedValue, setSelectedValue] = useState("");

  // const handleChangeAvailable = (event) => {
  //   setAvailability(event.target.value);
  // };

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
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category" || name === "author") {
      const lettersRegex = /^[א-תA-Za-z\s]*$/;
      if (!lettersRegex.test(value)) {
        return; // If the value doesn't match, do nothing
      }
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleChangeChip = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prevData) => ({
      ...prevData,
      tags: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      filePath: file ? file.name : prevData.filePath,
      file: file || null,
    }));
  };
  const [selectedLevel, setSelectedLevel] = useState(formData.itemLevel);
  // const [addTagOpen, SetAddTagOpen] = useState(false);

  const handleChangeSelect = (event) => {
    setSelectedLevel(event.target.value);
    const {
      target: { value },
    } = event;
    if (value === "גיל הרך") {
      setFormData((prevData) => ({
        ...prevData,
        itemLevel: 0,
      }));
    }
    if (value === "נמוכה") {
      setFormData((prevData) => ({
        ...prevData,
        itemLevel: 1,
      }));
    }
    if (value === "גבוהה") {
      setFormData((prevData) => ({
        ...prevData,
        itemLevel: 2,
      }));
    }
    if (value === "כיתה") {
      setFormData((prevData) => ({
        ...prevData,
        itemLevel: 3,
      }));
    }
  };
  // const getRecommendationText = () => {
  //  if (formData.amount){return 'האם החפץ מומלץ';}
  //  else if(new URL(formData.filePath)){return 'האם הקובץ מומלץ';}
  //  else if(formData.edition){return 'האם הספר מומלץ';}
  // }

  const LevelEnumMapping = {
    [LevelEnum.PRESCHOOL]: "גיל הרך",
    [LevelEnum.LOW]: "נמוכה",
    [LevelEnum.HIGH]: "גבוהה",
    [LevelEnum.CLASS]: "כיתה",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("id", formData.id);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    // (numOfDay === false)?
    formDataToSend.append('numberOfDaysOfQuestion', formData.numberOfDaysOfQuestion)
    // :formDataToSend.append('numberOfDaysOfQuestion', -1)
    formDataToSend.append("itemType", formData.itemType);
    (!formData.recommended) ?
      formDataToSend.append("recommended", false) :
      formDataToSend.append("recommended", formData.recommended)

    formDataToSend.append("itemLevel", formData.itemLevel);
    formDataToSend.append("note", formData.note);
    formData.tags.forEach((tagId) => formDataToSend.append("tags[]", tagId));

    if (!formData.author)
      formDataToSend.append("amount", formData.amount);
    if (formData.author) {
      formDataToSend.append("author", formData.author);
      formDataToSend.append("edition", formData.edition);
      formDataToSend.append("series", formData.series);
     
   
      formDataToSend.append("numOfSeries", formData.numOfSeries);
      formDataToSend.append("language", formData.language);
      formDataToSend.append(
        "accompanyingMaterial",
        formData.accompanyingMaterial
      );
      formDataToSend.append(
        "hebrewPublicationYear",
        formData.hebrewPublicationYear
      );
      formDataToSend.append("publishingYear", formData.publishingYear);
    if  (numOfDay=== true)
    {
      
      formDataToSend.append("isApproved", isApprovedNumOfDay)
      console.log("numOfDay1:",numOfDay,"isApproved:",formData.isApproved," mediaItem.isApproved:", isApprovedNumOfDay);
    }else{
      (!formData.isApproved) ?
        formDataToSend.append("isApproved", false) :
        formDataToSend.append("isApproved", formData.isApproved);}
      if (formData.file) {
        formDataToSend.append("filePath", formData.file); // Append the file directly as IFormFile
      } else {
        formDataToSend.append("filePath", formData.filePath); // Use existing filePath
      }
    } else {
      formDataToSend.append("author", null);
      formDataToSend.append("edition", null);
      formDataToSend.append("series", null);
      formDataToSend.append("numOfSeries", 0);
      formDataToSend.append("language", null);
      formDataToSend.append("note", null);
      formDataToSend.append("accompanyingMaterial", null);
      // formDataToSend.append('itemLevel', 0);
      formDataToSend.append("hebrewPublicationYear", null);
      formDataToSend.append("publishingYear", null);
      if  (numOfDay=== true)
      {
        formDataToSend.append("isApproved", isApprovedNumOfDay)
        console.log("numOfDay2:",numOfDay,"isApproved:",formData.isApproved," mediaItem.isApproved:", isApprovedNumOfDay);
      }else{
      formDataToSend.append("isApproved", null);}
      formData.tags.forEach((tagId) => formDataToSend.append("tags[]", tagId));
      if (formData.file) {
        formDataToSend.append("filePath", null); // Append the file directly as IFormFile
      } else {
        formDataToSend.append("filePath", null); // Use existing filePath
      }
    }
    onClose();
    Swal.fire({
      title: "?האם ברצונך לעדכן את הנתונים",
      showDenyButton: true,
      confirmButtonText: "אישור",
      denyButtonText: `ביטול`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (link) {
            await itemStore.updateMediaFile(formData.id, formDataToSend);
          }
          else if (!formData.author ) {
            if (numOfDay === true){ 
              await itemStore.uploadMediaObject(formDataToSend)
              await addNewRequestStore.deleteObject(formData.id) 
            }
               else{ await itemStore.updateMediaObject(formData.id, formDataToSend)
              }
              
                   
          }
          else {
            if (numOfDay === true){

            await itemStore.uploadMediaBook(formDataToSend)
           await addNewRequestStore.deleteObject(formData.id) 
            }else{
            await itemStore.updateMediaBook(formData.id, formDataToSend);}
          }
          Swal.fire({
            icon: "success",
            title: "השינויים נשמרו בהצלחה",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "שגיאה",
            text: "העדכון נכשל, נסה שוב מאוחר יותר",
            showConfirmButton: true,
          });
          console.error("Error updating item:", error); // הודעת שגיאה בקונסול
        }
      } else if (result.isDenied) {
        Swal.fire({
          icon: "info",
          title: "לא נשמרו שינויים",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const getRecommendationText = (value) => {
    switch (value) {
      case "book":
        return "האם הספר מומלץ?";
      case "file":
        return "האם הקובץ מומלץ?";
      case "object":
        return "האם המוצר מומלץ?";
      default:
        return "האם פריט זה מומלץ?";
    }
  };

  const getTypeText = (value) => {
    if (value === 0) return "קובץ דיגיטלי";
    if (value === 1) return "ספר";
    if (value === 2) return "חפץ";
    // return TypeEnum[value];
  };

  const handleRecommendationToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      recommended: !prevData.recommended,
      userID: prevData.userID + 1,
    }));
  };

  const checkLink = () => {
    const filePath = formData.filePath;
    setLink(
      filePath.includes("https") ||
      /\.(pdf|jpg|jpeg|png|zip|mp3|mp4|docx)$/.test(filePath)
    );
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
            inputProps={{ minLength: 2, maxLength: 17 }}
            required
          />
          {formData.title && formData.title.length < 2 && (
            <Typography color="error">
              הכותרת חייבת להכיל לפחות 2 תווים
            </Typography>
          )}

          <TextField
            margin="dense"
            label="תיאור"
            type="text"
            fullWidth
            name="description"
            value={formData.description}
            onChange={handleChange}
            inputProps={{ minLength: 3, maxLength: 35 }}
            required
          />
          {formData.description && formData.description.length < 3 && (
            <Typography color="error">
              התיאור חייב להכיל לפחות 3 תווים
            </Typography>
          )}
          {formData.description === formData.title && (
            <Typography color="error">
              שם וכותרת לא יוכלים להיות זהים
            </Typography>
          )}
          <TextField
            margin="dense"
            label="קטגוריה"
            type="text"
            fullWidth
            name="category"
            value={formData.category}
            onChange={handleChange}
            inputProps={{ minLength: 2, maxLength: 17 }}
            required
          />
          {formData.category && formData.category.length < 2 && (
            <Typography color="error">
              הקטגוריה חייבת להכיל לפחות 2 תווים
            </Typography>
          )}
          {formData.author && (
            <TextField
              margin="dense"
              label="מחבר"
              type="text"
              fullWidth
              name="author"
              value={formData.author}
              onChange={handleChange}
              inputProps={{ minLength: 2, maxLength: 17 }}
              required
            />
          )}
          {formData.author && formData.author.length < 2 && (
            <Typography color="error">
              המחבר חייב להכיל לפחות 2 תווים
            </Typography>
          )}
          {!formData.filePath.includes("https") &&
            formData.author &&
            // formData.publishingYear !== 0 &&
            // formData.publishingYear && (
            <TextField
              margin="dense"
              label="שנת הוצאה לועזית"
              type="number"
              fullWidth
              name="publishingYear"
              value={formData.publishingYear !== 0 ? formData.publishingYear : ""}
              onChange={handleChange}
              inputProps={{
                minLength: 4,
                maxLength: 4,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
          }

          {formData.publishingYear &&
            formData.publishingYear.length === 4 &&
            !isNaN(parseInt(formData.publishingYear)) &&
            parseInt(formData.publishingYear) > new Date().getFullYear() && (
              <Typography color="error">יש להכניס שנת הוצאה תקינה </Typography>
            )}
          {!formData.filePath.includes("https") && formData.author && (
            <TextField
              margin="dense"
              label="שנה הוצאה עברית"
              type="text"
              fullWidth
              name="hebrewPublicationYear"
              value={formData.hebrewPublicationYear}
              onChange={handleChange}
              inputProps={{ minLength: 4, maxLength: 4 }}
              required
            />
          )}
          {formData.hebrewPublicationYear &&
            formData.hebrewPublicationYear.length < 1 && (
              <Typography color="error">
                שנת הוצאה חייב להכיל 4 תווים{" "}
              </Typography>
            )}
          <FormControl fullWidth>
            <InputLabel id="demo-multiple-chip-label">תגית</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              name="tag"
              multiple
              value={formData.tags}
              onChange={handleChangeChip}
              input={<OutlinedInput id="select-multiple-chip" label="תגית" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((tagId) => (
                    <Chip
                      key={tagId}
                      label={tagMap[tagId]}
                      style={{ color: "dark" }}
                      variant="outlined"
                    />
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
          {!formData.author && (
            <TextField
              margin="dense"
              label="כמות"
              type="text"
              fullWidth
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              inputProps={{ minLength: 1, maxLength: 6 }}
            // disabled={link}
            />
          )}
          {formData.author && (
            <TextField
              margin="dense"
              label="מיקום"
              type="text"
              fullWidth
              name="filePath"
              value={formData.filePath != 0 ? formData.filePath : ""}
              onChange={handleChange}
              inputProps={{ minLength: 1, maxLength: 17 }}
              disabled={link}
            />
          )}
          {link && (
            <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
              <input
                accept="*"
                id="upload-file"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor="upload-file">
                <IconButton color="primary" component="span">
                  <CloudUploadIcon />
                </IconButton>
              </label>
              <Typography variant="body2" style={{ marginLeft: "8px" }}>
                {formData.filePath}
              </Typography>
            </Box>
          )}
          {formData.author && (
            <TextField
              margin="dense"
              label="מהדורה"
              type="text"
              fullWidth
              name="edition"
              value={formData.edition}
              onChange={handleChange}
              inputProps={{ minLength: 3, maxLength: 15 }}
              required
            />
          )}
          {formData.edition && formData.edition.length < 1 && (
            <Typography color="error">
              המהדורה חייבת להכיל לפחות תו אחד
            </Typography>
          )}
          {formData.author && (
            <TextField
              margin="dense"
              label="סידרה"
              type="text"
              fullWidth
              name="series"
              value={formData.series}
              onChange={handleChange}
              inputProps={{ minLength: 1, maxLength: 15 }}
              // inputProps={{ minLength:1,  inputMode: 'numeric', pattern: '[0-9]*'}}
              required
            />
          )}
          {formData.series && formData.series.length < 1 && (
            <Typography color="error">
              סידרה חייבת להכיל לפחות 3 תווים
            </Typography>
          )}
          {formData.author && (
            <TextField
              margin="dense"
              label="מספר בסידרה"
              type="number"
              fullWidth
              name="numOfSeries"
              value={formData.numOfSeries}
              onChange={handleChange}
              inputProps={{
                minLength: 1,
                maxLength: 4,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              required
            />
          )}
          {formData.numOfSeries && formData.numOfSeries.length < 1 && (
            <Typography color="error">
              מספר בסידרה חייבת להכיל לפחות מספר אחד
            </Typography>
          )}
          {formData.author && (
            <TextField
              margin="dense"
              label="שפה"
              type="text"
              fullWidth
              name="language"
              value={formData.language}
              onChange={handleChange}
              inputProps={{ minLength: 3, maxLength: 10 }}
              required
            />
          )}
          {formData.language && formData.language.length < 3 && (
            <Typography color="error">
              שפה חייבת להכיל לפחות 3 תווים{" "}
            </Typography>
          )}
          {formData.author && (
            <TextField
              margin="dense"
              label="חומר נלווה"
              type="text"
              fullWidth
              name="accompanyingMaterial"
              value={formData.accompanyingMaterial}
              onChange={handleChange}
              inputProps={{ minLength: 3, maxLength: 25 }}
              required
            />
          )}
          {formData.accompanyingMaterial &&
            formData.accompanyingMaterial.length < 3 && (
              <Typography color="error">
                חומר נלווה חייב להכיל לפחות 3 תווים{" "}
              </Typography>
            )}

          <FormControl fullWidth margin="dense">
            <InputLabel id="level-select-label">רמה</InputLabel>
            <Select
              labelId="level-select-label"
              id="level-select"
              name="itemLevel"
              value={selectedLevel}
              onChange={handleChangeSelect}
              input={<OutlinedInput label="רמה" />}
            >
              {Object.keys(LevelEnum).map((key) => (
                <MenuItem key={LevelEnum[key]} value={LevelEnum[key]}>
                  {LevelEnumMapping[LevelEnum[key]]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!formData.filePath.includes('https') &&
            <TextField
              margin="dense"
              label="מספר ימי השאלה"
              type="number"
              fullWidth
              name="numberOfDaysOfQuestion"
              value={formData.numberOfDaysOfQuestion}
              onChange={handleChange}
              inputProps={{
                minLength: 1,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              required
            />
          }
          {formData.numberOfDaysOfQuestion &&
            formData.numberOfDaysOfQuestion.length < 1 && (
              <Typography color="error">
                מספר ימי השאלה חייב להכיל לפחות מספר אחד{" "}
              </Typography>
            )}
          {/* {formData.author&&
          <FormControl fullWidth margin="dense">
           <InputLabel id="availability-label">זמינות</InputLabel>
          <Select
            margin="dense"
        labelId="availability-label"
        id="availability-select"
        value={availability}
        label="זמינות"
        onChange={handleChangeAvailable}
      >
        <MenuItem value="available">זמין</MenuItem>
        <MenuItem value="notAvailable">לא זמין</MenuItem>
      </Select>
      </FormControl>} */}

          <TextField
            margin="dense"
            label="הערות"
            type="text"
            fullWidth
            name="note"
            value={formData.note}
            onChange={handleChange}
            inputProps={{ minLength: 2, maxLength: 35 }}
            required
          />
          {formData.note && formData.note.length < 3 && (
            <Typography color="error">
              הערות חייבת להכיל לפחות 3 תווים{" "}
            </Typography>
          )}

          <Box display="flex" alignItems="center" mt={2}>
            <Typography>סוג פריט:</Typography>
            <Typography ml={1} variant="body2" color="textSecondary">
              {getTypeText(formData.itemType)}
            </Typography>
          </Box>
          <Typography variant="body1">
            {getRecommendationText(selectedValue)}
          </Typography>
          <IconButton onClick={handleRecommendationToggle}>
            {formData.recommended ? (
              <StarIcon style={{ color: "yellow" }} />
            ) : (
              <StarBorderIcon />
            )}
          </IconButton>
        </DialogContent>
        <DialogActions
          style={{
            position: "sticky",
            bottom: 0,
            background: "#fff",
            zIndex: 1,
          }}
        >
          <Button onClick={onClose} style={{ color: "#468585" }}>
            ביטול
          </Button>
          <Button type="submit" style={{ color: "#468585" }}>
            שמירה
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
