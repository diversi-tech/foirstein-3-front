import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/system";
import borrowingStore from "../../store/borrowing-store";
import { observer } from "mobx-react-lite";
import { getUserIdFromTokenid } from "../decipheringToken";
import itemStore from "../../store/item-store";
import Fields_rtl from "../tag/fields_rtl";
const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "black",
}));

const FormStyled = styled("form")(({ theme }) => ({
  width: "100%", // Fix IE 11 issue.
  marginTop: theme.spacing(3),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#0D1E46", // Border color on focus
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#0D1E46", // Label color on focus
    },
  },
}));

const Borrowing = observer(({ buttonName }) => {
  const [formData, setFormData] = useState({
    date: "",
    student: "",
    item: "",
    amount: "",
    remarks: "",
  });
  const [itemInputValue, setItemInputValue] = useState("");
  const [studentInputValue, setStudentInputValue] = useState("");
  const [items, setItems] = useState(false);
  const [students, setStudents] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await borrowingStore.fetchBorrowing();
    };
    fetchData();
  }, []);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleChange = (event, value, name) => {
    switch (name) {
      case "item":
        setFormData((prev) => ({ ...prev, item: value ? value.id : "" }));
        break;
      case "student":
        setFormData((prev) => ({
          ...prev,
          student: value ? value.userId : "",
        }));
        break;
    }
  };

  const handleInputChange = (event, newInputValue, name) => {
    switch (name) {
      case "item":
        setItemInputValue(newInputValue);
        break;
      case "student":
        setStudentInputValue(newInputValue);
        break;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.student) newErrors.student = "זהו שדה חובה.";
    if (!formData.item) newErrors.item = "זהו שדה חובה.";
    if (buttonName === "physical" && !formData.amount)
      newErrors.amount = "זהו שדה חובה.";
    return newErrors;
  };

  const borrowing = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const dataToSend = {
      date: new Date().toISOString(),
      studentID: formData.student,
      bookId: formData.item,
      librarianId: getUserIdFromTokenid(),
      amount: parseInt(formData.amount, 10),
      remarks: formData.remarks,
    };
    await borrowingStore.addBorrowing(dataToSend);
  };

  return (
    <Fields_rtl>
      <ContainerStyled component="main" maxWidth="xs" dir="rtl">
        {buttonName == "book" ? (
          <Typography component="h1" variant="h5">
            השאלת ספר
          </Typography>
        ) : (
          <Typography component="h1" variant="h5">
            השאלת חפצים
          </Typography>
        )}
        <FormStyled onSubmit={borrowing} noValidate>
          <Typography variant="subtitle1" gutterBottom>
            תאריך: {formatDate(new Date())}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                value={borrowingStore.studentList.find(
                  (student) => student.userId === formData.student
                )}
                onChange={(event, value) =>
                  handleChange(event, value, "student")
                }
                inputValue={studentInputValue}
                onInputChange={(event, value) =>
                  handleInputChange(event, value, "student")
                }
                options={borrowingStore.studentList.filter((student) =>
                  (student.fname + " " + student.sname).includes(
                    studentInputValue
                  )
                )}
                getOptionLabel={(option) => `${option.fname} ${option.sname}`}
                renderOption={(props, option) => (
                  <li {...props} key={option.userId} dir="rtl">
                    <div style={{ textAlign: "right" }}>
                      <div>{`${option.fname} ${option.sname}`}</div>
                      <div style={{ color: "gray" }}>{option.email}</div>
                    </div>
                  </li>
                )}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    id="student"
                    name="student"
                    label="תלמידה"
                    variant="outlined"
                    fullWidth
                    error={!!errors.student}
                    helperText={errors.student}
                    onFocus={() => setStudents(true)}
                    onBlur={() => setStudents(false)}
                  />
                )}
                open={students}
                onOpen={() => setStudents(true)}
                onClose={() => setStudents(false)}
                filterOptions={(options) => options}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                value={
                  buttonName == "book"
                    ? borrowingStore.bookList.find(
                        (item) => item.id === formData.item
                      )
                    : borrowingStore.physicalList.find(
                        (item) => item.id === formData.item
                      )
                }
                onChange={(event, value) => handleChange(event, value, "item")}
                inputValue={itemInputValue}
                onInputChange={(event, value) =>
                  handleInputChange(event, value, "item")
                }
                options={
                  buttonName == "book"
                    ? borrowingStore.bookList.filter((item) =>
                        item.title.includes(itemInputValue)
                      )
                    : borrowingStore.physicalList.filter((item) =>
                        item.title.includes(itemInputValue)
                      )
                }
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => (
                  <li {...props} key={option.id} dir="rtl">
                    {option.title}
                  </li>
                )}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="פריט"
                    id="item"
                    name="item"
                    variant="outlined"
                    fullWidth
                    error={!!errors.item}
                    helperText={errors.item}
                    onFocus={() => setItems(true)}
                    onBlur={() => setItems(false)}
                  />
                )}
                open={items}
                onOpen={() => setItems(true)}
                onClose={() => setItems(false)}
                filterOptions={(options) => options}
              />
            </Grid>
            {buttonName == "physical" && (
              <Grid item xs={12}>
                <CustomTextField
                  variant="outlined"
                  type="number"
                  fullWidth
                  id="amount"
                  label="כמות"
                  name="amount"
                  value={formData.amount}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || !isNaN(value)) {
                      setFormData((prev) => ({ ...prev, amount: value }));
                    }
                  }}
                  inputProps={{
                    min: "1",
                    step: "1",
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <CustomTextField
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                id="remarks"
                label="הערות"
                name="remarks"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, remarks: e.target.value }))
                }
              />
            </Grid>
          </Grid>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            style={{ backgroundColor: "#0D1E46" }}
          >
            השאלה
          </SubmitButton>
        </FormStyled>
      </ContainerStyled>
    </Fields_rtl>
  );
});

export default Borrowing;
