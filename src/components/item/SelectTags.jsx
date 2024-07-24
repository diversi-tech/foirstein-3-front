import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useMediaQuery } from '@mui/material';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import tagStore from '../../store/tag-store';
import PropTypes from 'prop-types';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';

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

// Define RTL theme
const rtlTheme = createTheme({
    direction: 'rtl', // Set text direction to right-to-left
});

function getStyles(id, selectedTags, theme) {
    return {
        fontWeight:
            selectedTags.indexOf(id) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function IconSelectTags({ handleAddItemTag }) {
    const theme = useTheme();
    const [selectedTags, setSelectedTags] = React.useState([]);
    const [tags, setTags] = useState([]);
    const [addTagOpen, setAddTagOpen] = useState(false);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpenTagClick = () => {
        setAddTagOpen(true);
    };

    const handleCloseTagClick = () => {
        setAddTagOpen(false);
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedTags(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    const handleAddTags = () => {
        handleCloseTagClick();
        handleAddItemTag(selectedTags);
        setSelectedTags([])
    };

    useEffect(() => {
        setTags(tagStore.getTagsList); // Make sure this returns an array of objects
    }, [tagStore.tagList]);

    useEffect(() => {
        tagStore.fetchTag();
    }, []);

    return (
        <>
            <Tooltip title="הוסף תגית חדשה" arrow>
                <IconButton
                    onClick={handleOpenTagClick}
                    sx={{
                        backgroundColor: "#0D1E46",
                        color: "#FFD700",
                        padding: '4px 8px',
                        minWidth: '40px',
                        minHeight: '40px',
                        borderRadius: '5px',
                        "&:hover": {
                            backgroundColor: "#0D1E46",
                            color: "#FFD700",
                        },
                    }}
                >
                    <MapsUgcOutlinedIcon style={{ transform: 'scaleX(-1)', fontSize: '25px' }} />
                </IconButton>
            </Tooltip>
            <Dialog
                fullScreen={fullScreen}
                open={addTagOpen}
                onClose={handleCloseTagClick}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"בחרי את התגיות הרצויות"}
                </DialogTitle>
                <DialogContent>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-chip-label">תגיות</InputLabel>
                        <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={selectedTags}
                            onChange={handleChange}
                            input={<OutlinedInput id="select-multiple-chip" label="תגיות" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((id) => (
                                        <Chip
                                            key={id}
                                            label={tags.find((tag) => tag.id === id)?.name || id}
                                        />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {tags.map((tag) => (
                                <MenuItem
                                    key={tag.id}
                                    value={tag.id} // שמור את ה-ID בתור הערך של MenuItem
                                    style={getStyles(tag.id, selectedTags, theme)}
                                >
                                    {tag.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleAddTags}>
                        הוסף
                    </Button>
                    <Button onClick={handleCloseTagClick} autoFocus>
                        ביטול
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

IconSelectTags.propTypes = {
    handleAddItemTag: PropTypes.func.isRequired,
};
