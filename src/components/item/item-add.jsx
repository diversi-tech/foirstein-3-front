import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import {
    Button,
    Radio,
    FormControlLabel,
    RadioGroup,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    FormControl,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    Chip,
    Box,
    OutlinedInput,
    Checkbox,
    ListItemText
} from '@mui/material';
import itemStore from '../../store/item-store';
import Swal from 'sweetalert2'
import { createTheme, useTheme } from '@mui/material/styles';
import tagStore from '../../store/tag-store';
// import { useTheme } from '@mui/material/styles';
import LevelEnum from '../LevelEum';

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

const ItemDdd = observer(() => {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [openF, setOpenF] = useState(false);
    const [error, setError] = useState(false);
    const [isApproved, setIsApproved] = useState();
    const [isHandleUpload, setIsHndleUpload] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [isUpload, setIsUpload] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [touchedFields, setTouchedFields] = useState({});
    // const [error, setTouchedFields] = useState({});


    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        author: '',
        publishingYear: '',
        tag: [],
        filePath: '',
    });

    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'mp4', 'docx', 'mp3'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const handleClose = () => {
        setOpen(false);
        itemStore.add = false;
        setFormData({
            title: '',
            description: '',
            category: '',
            author: '',
            publishingYear: '',
            tag: [],
            filePath: '',
        });
        setIsHndleUpload(false);
        setSelectedValue('');
        setIsApproved('');
        setTouchedFields({});
    };

    const handleRadioChange = (event) => {
        setOpenF(true);
        const value = event.target.value;
        setFormData((prevData) => ({
            ...prevData,
            filePath: value === 'book' ? '' : value === 'object' ? '' : null,
        }));
        setSelectedValue(value);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setTouchedFields((prev) => ({ ...prev, [name]: true }));
        if (type === 'file') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0],
            }));
        } else {
            if (name === 'category' || name === 'author') {
                const lettersRegex = /^[א-תA-Za-z\s]*$/;
                if (!lettersRegex.test(value)) {
                    return; // If the value doesn't match, do nothing
                }
            }

            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleTagChange = (event) => {
        const { value } = event.target;
        setTouchedFields((prev) => ({ ...prev, tag: true }));
        setFormData((prevData) => {
            const newTags = typeof value === 'string' ? value.split(',') : value;
            return {
                ...prevData, tag: newTags.map(tagName => {
                    const tag = tagStore.tagList.find(t => t.name === tagName);
                    return tag ? tag.id : tagName;
                })
            };
        });
    };

    const fileExtension = formData.filePath && typeof formData.filePath.name === 'string'
        ? formData.filePath.name.split('.').pop().toLowerCase()
        : '';

    useEffect(() => {
        const isValid =
            formData.title.length >= 2 &&
            formData.description.length >= 5 &&
            formData.category.length >= 3 &&
            formData.author.length >= 3 &&
            formData.publishingYear.length >= 4 &&
            formData.tag.length > 0 &&
            (selectedValue === 'book' ||
                (selectedValue === 'file' &&
                    formData.filePath &&
                    allowedExtensions.includes(fileExtension)
                    //formData.filePath.size <= maxSize
                )
            );
        setIsFormValid(isValid);
    }, [formData, selectedValue, fileExtension]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = { ...formData };
        const formDataToSend = new FormData();
        for (const key in dataToSend) {
            if (key === 'tag') {
                const tagIds = dataToSend[key].map(tagName => {
                    const tag = tagStore.tagList.find(t => t.name === tagName);
                    return tag ? tag.id : tagName;
                });
                tagIds.forEach(tagId => formDataToSend.append('tags[]', tagId));
            } else {
                formDataToSend.append(key, dataToSend[key]);
            }
        }
        handleClose();
        Swal.fire({
            title: "?האם ברצונך לשמור את הפריט",
            showDenyButton: true,
            confirmButtonText: "אישור",
            denyButtonText: `ביטול`
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (selectedValue === 'file') {
                    const fileToSend = new FormData();

                    for (const key in formData) {
                        if (key === 'tag') {
                            const tagIds = formData[key].map(tagName => {
                                const tag = tagStore.tagList.find(t => t.name === tagName);
                                return tag ? tag.id : tagName;
                            });
                            tagIds.forEach(tagId => fileToSend.append('tags[]', tagId));
                        } if (key === 'filePath' && formData[key] instanceof File) {
                            fileToSend.append(key, formData[key]);
                        }
                        if (key === 'title' || key === 'author' || key === 'description' || key === 'category' || key === 'note') {
                            fileToSend.append(key, formData[key]);
                        }
                    }

                    await itemStore.uploadMediaFile(fileToSend);
                    Swal.fire({
                        icon: "success",
                        title: "הפריט נשמר בהצלחה",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    await itemStore.uploadMediaBook(formDataToSend);
                    Swal.fire({
                        icon: "success",
                        title: "הפריט נשמר בהצלחה",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } else if (result.isDenied) {

                Swal.fire({
                    icon: "info",
                    title: "הפריט לא נשמר",
                    showConfirmButton: false,
                    timer: 1500
                });
            } if (itemStore.isError) {
                Swal.fire({
                    icon: "error",
                    title: "אופס... תקלה בעת שמירת הפריט",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
        setFormData({
            title: '',
            description: '',
            category: '',
            author: '',
            publishingYear: '',
            tag: [],
            filePath: '',
        });
        setIsHndleUpload(true);
        setSelectedValue('');
        setIsUpload(true);
        // handleClose();
    }


    return (
        <>
            <Dialog open={open} onClose={handleClose} style={{ direction: "rtl" }}>
                <DialogTitle>העלאת פריט</DialogTitle>
                <FormControl>
                    <RadioGroup
                        aria-label="upload-type"
                        name="upload-type"
                        value={selectedValue}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel value="book" control={<Radio style={{ color: '#0D1E46' }} />} label="ספר" />
                        <FormControlLabel value="file" control={<Radio style={{ color: '#0D1E46' }} />} label="קובץ דיגיטלי" />
                        <FormControlLabel value="object" control={<Radio style={{ color: '#0D1E46' }} />} label="חפץ" />
                    </RadioGroup>
                </FormControl>

                {openF &&
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
                                        required
                                        onBlur={() => setTouchedFields((prev) => ({ ...prev, title: true }))}
                                    />
                                    {touchedFields.title && !formData.title && (
                                        <Typography color="error">שדה חובה</Typography>
                                    )}
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
                                        required
                                        onBlur={() => setTouchedFields((prev) => ({ ...prev, description: true }))}
                                    />
                                    {touchedFields.description && !formData.description && (
                                        <Typography color="error">שדה חובה</Typography>
                                    )}
                                    {formData.description && formData.description.length < 3 && (
                                        <Typography color="error">התיאור חייב להכיל לפחות 3 תווים</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="categoryId"
                                        label="קטגוריה"
                                        variant="outlined"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        onBlur={() => setTouchedFields((prev) => ({ ...prev, category: true }))}
                                    />
                                    {touchedFields.category && !formData.category && (
                                        <Typography color="error">שדה חובה</Typography>
                                    )}
                                    {formData.category && formData.category.length < 3 && (
                                        <Typography color="error">הקטגוריה חייבת להכיל לפחות 3 תווים</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="authorId"
                                        label="מחבר"
                                        variant="outlined"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        required
                                        onBlur={() => setTouchedFields((prev) => ({ ...prev, author: true }))}
                                    />
                                    {touchedFields.author && !formData.author && (
                                        <Typography color="error">שדה חובה</Typography>
                                    )}
                                    {formData.author && formData.author.length < 2 && (
                                        <Typography color="error">המחבר חייב להכיל לפחות 2 תווים</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            {selectedValue === 'book' && (
                                <>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id="publishingYearId"
                                                label=" שנת הוצאה לועזית"
                                                variant="outlined"
                                                name="publishingYear"
                                                value={formData.publishingYear}
                                                onChange={handleChange}
                                                required
                                                onBlur={() => setTouchedFields((prev) => ({ ...prev, publishingYear: true }))}
                                            />
                                            {touchedFields.publishingYear && !formData.publishingYear && (
                                                <Typography color="error">שדה חובה</Typography>
                                            )}
                                            {formData.publishingYear && formData.publishingYear.length < 4 && (
                                                <Typography color="error">שנת הוצאה חייבת להכיל 4 תווים</Typography>
                                            )}
                                        </FormControl>
                                    </Grid>


                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id="hebrewPublishingYearId"
                                                label="שנת הוצאה עברית"
                                                variant="outlined"
                                                name="hebrewPublicationYear"
                                                value={formData.hebrewPublicationYear}
                                                // type='number'
                                                onChange={handleChange}
                                                required
                                                onBlur={() => setTouchedFields((prev) => ({ ...prev, hebrewPublicationYear: true }))}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                margin="dense"
                                                label="מהדורה"
                                                type="text"
                                                fullWidth
                                                name="edition"
                                                value={formData.edition}
                                                onChange={handleChange}
                                                required
                                                onBlur={() => setTouchedFields((prev) => ({ ...prev, edition: true }))}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id="series"
                                                label="סידרה"
                                                variant="outlined"
                                                name="series"
                                                value={formData.series}

                                                onChange={handleChange}
                                                required
                                                onBlur={() => setTouchedFields((prev) => ({ ...prev, series: true }))}
                                            />
                                            {/* {touchedFields.publishingYear && !formData.publishingYear && (
                                                <Typography color="error">שדה חובה</Typography>
                                            )}
                                            {formData.publishingYear && formData.publishingYear.length < 4 && (
                                                <Typography color="error">שנת הוצאה חייבת להכיל 4 תווים</Typography>
                                            )} */}


                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id="numOfSeriesId"
                                                label="מס בסידרה"
                                                variant="outlined"
                                                name="numOfSeries"
                                                value={formData.numOfSeries}
                                                type='number'
                                                onChange={handleChange}
                                                required
                                                onBlur={() => setTouchedFields((prev) => ({ ...prev, numOfSeries: true }))}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id="languageId"
                                                label="שפה"
                                                variant="outlined"
                                                name="language"
                                                value={formData.language}
                                                onChange={handleChange}
                                                required
                                                onBlur={() => setTouchedFields((prev) => ({ ...prev, language: true }))}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                margin="dense"
                                                label="חומר נלווה"
                                                type="text"
                                                fullWidth
                                                name="accompanyingMaterial"
                                                value={formData.accompanyingMaterial}
                                                onChange={handleChange}
                                                required
                                                onBlur={() => setTouchedFields((prev) => ({ ...prev, accompanyingMaterial: true }))}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id="numberOfDaysOfQuestionId"
                                                label="מספר ימי השאלה"
                                                variant="outlined"
                                                name="numberOfDaysOfQuestion"
                                                value={formData.numberOfDaysOfQuestion}
                                                type='number'
                                                onChange={handleChange}
                                                required
                                                onBlur={() => setTouchedFields((prev) => ({ ...prev, numberOfDaysOfQuestion: true }))}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth margin="dense">

                                            <InputLabel id="availability-label">זמינות</InputLabel>
                                            <Select
                                                margin="dense"
                                                labelId="availability-label"
                                                id="availability-select"
                                                // value={availability}
                                                label="זמינות"
                                            // onChange={handleChangeAvailable}
                                            >
                                                <MenuItem value="available">זמין</MenuItem>
                                                <MenuItem value="notAvailable">לא זמין</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel id="level-select-label">רמה</InputLabel>
                                            <Select
                                                labelId="level-select-label"
                                                id="level-select"
                                                name="itemLevel"
                                                // value={formData.itemLevel}
                                                input={<OutlinedInput label="רמה" />}
                                            >
                                                {Object.values(LevelEnum).map((level) => (
                                                    <MenuItem key={level} value={level}>
                                                        {level}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    label="הערות"
                                    type="text"
                                    fullWidth
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="tagId">תגיות</InputLabel>
                                    <Select
                                        labelId="tagId"
                                        id="tagId"
                                        multiple
                                        value={formData.tag}
                                        onChange={handleTagChange}
                                        input={<OutlinedInput id="select-multiple-chip" label="תגיות" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={tagStore.tagList.find(tag => tag.id === value)?.name || value} />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {tagStore.tagList.map((tag) => (
                                            <MenuItem key={tag.id} value={tag.id}>
                                                <Checkbox checked={formData.tag.indexOf(tag.id) > -1} />
                                                <ListItemText primary={tag.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {selectedValue === 'book' && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="filePathId"
                                            label="מיקום"
                                            variant="outlined"
                                            name="filePath"
                                            value={formData.filePath}
                                            onChange={handleChange}
                                            required
                                            onBlur={() => setTouchedFields((prev) => ({ ...prev, filePath: true }))}
                                            type='text'
                                        />
                                        {touchedFields.filePath && !formData.filePath && (
                                            <Typography color="error">שדה חובה</Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                            )}
                            {selectedValue === 'file' && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="fileId"
                                            type="file"
                                            label="קובץ"

                                            name="filePath"
                                            onChange={handleChange}
                                            required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onBlur={() => setTouchedFields((prev) => ({ ...prev, filePath: true }))}
                                        />
                                        {touchedFields.filePath && !formData.filePath && (
                                            <Typography color="error">שדה חובה</Typography>
                                        )}
                                        {formData.filePath && !allowedExtensions.includes(fileExtension) && (
                                            <Typography color="error">סוג קובץ לא נתמך. אנא בחר/י PDF, JPG, JPEG, PNG, docx, ZIP, mp3, או MP4 file.</Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                            )}
                            {selectedValue === 'object' && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="amoundId"
                                            label="כמות"
                                            variant="outlined"
                                            name="amount"
                                            // value={formData.filePath}
                                            onChange={handleChange}
                                            required
                                            onBlur={() => setTouchedFields((prev) => ({ ...prev, amount: true }))}
                                            type='text'
                                        />

                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>
                    </DialogContent>
                }
                <DialogActions>
                    <Button type="submit" onClick={handleSubmit} style={{ color: '#0D1E46' }}  >העלאה</Button>
                    <Button onClick={handleClose} style={{ color: '#0D1E46' }}>ביטול</Button>
                </DialogActions>
            </Dialog>
        </>
    );
});

export default ItemDdd;
