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
import { getUserIdNumFromToken } from "../decipheringToken";

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

const Returning = observer(() => {
  const [formData, setFormData] = useState({
    date: "",
    student: "",
    book: "",
    librarian: "",
    amount: 1,
  });
  const [bookInputValue, setBookInputValue] = useState("");
  const [studentInputValue, setStudentInputValue] = useState("");
  const [books, setBooks] = useState(false);
  const [students, setStudents] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await borrowingStore.fetchBorrowing();
    };
    fetchData();
  }, []);

  const handleChange = (event, value, name) => {
    switch (name) {
      case "book":
        setFormData((prev) => ({ ...prev, book: value ? value.id : "" }));
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
      case "book":
        setBookInputValue(newInputValue);
        break;
      case "student":
        setStudentInputValue(newInputValue);
        break;
    }
  };

  return (
    <ContainerStyled component="main" maxWidth="xs" dir="rtl">
      <Typography component="h1" variant="h5">
        החזרת מוצר
      </Typography>
      <FormStyled noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              value={borrowingStore.studentList.find(
                (student) => student.userId === formData.student
              )}
              onChange={(event, value) => handleChange(event, value, "student")}
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
                <li {...props} key={option.userId}>
                  {`${option.fname} ${option.sname}`}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="student"
                  name="student"
                  label="תלמידה"
                  variant="outlined"
                  fullWidth
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
              value={borrowingStore.bookList.find(
                (item) => item.id === formData.book
              )}
              onChange={(event, value) => handleChange(event, value, "book")}
              inputValue={bookInputValue}
              onInputChange={(event, value) =>
                handleInputChange(event, value, "book")
              }
              options={borrowingStore.bookList.filter((book) =>
                book.title.includes(bookInputValue)
              )}
              getOptionLabel={(option) => option.title}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.title}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="ספר"
                  id="book"
                  name="book"
                  variant="outlined"
                  fullWidth
                  onFocus={() => setBooks(true)}
                  onBlur={() => setBooks(false)}
                />
              )}
              open={books}
              onOpen={() => setBooks(true)}
              onClose={() => setBooks(false)}
              filterOptions={(options) => options}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              type="number"
              fullWidth
              id="amount"
              label="כמות"
              name="amount"
              value={formData.amount}
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
        </Grid>
        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Sign Up
        </SubmitButton>
      </FormStyled>
    </ContainerStyled>
  );
});

export default Returning;
