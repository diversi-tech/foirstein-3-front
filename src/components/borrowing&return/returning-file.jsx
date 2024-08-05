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
import { toJS } from "mobx";
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

const Returning = observer(({ buttonName }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString(),
    student: "",
    book: "",
    amount: null,
  });
  const [itemInputValue, setItemInputValue] = useState("");
  const [studentInputValue, setStudentInputValue] = useState("");
  const [books, setBooks] = useState(false);
  const [students, setStudents] = useState(false);

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
        setItemInputValue(newInputValue);
        break;
      case "student":
        setStudentInputValue(newInputValue);
        break;
    }
  };

  const getBorrowing = async () => {
    await borrowingStore.fetchBorrowing();
    let list = toJS(borrowingStore.borrowingList);
    const borrowing = list.find((b) => {
      return b.studentId == formData.student && b.bookId == formData.book;
    });
    if (borrowing) return borrowing;
    else borrowingStore.failure("!ההשאלה לא קיימת");
  };

  const returning = async (event) => {
    event.preventDefault();
    const borrowing = await getBorrowing();
    if (borrowing.amount != formData.amount) {
      borrowing.amount -= formData.amount;
      await borrowingStore.updateBorrowing(borrowing.id, borrowing);
    } else {
      await borrowingStore.deleteBorrowing(borrowing.id);
    }
  };

  return (
    <Fields_rtl>
      <ContainerStyled component="main" maxWidth="xs" dir="rtl">
        {buttonName == "book" ? (
          <Typography component="h1" variant="h5">
            החזרת ספר
          </Typography>
        ) : (
          <Typography component="h1" variant="h5">
            החזרת חפצים
          </Typography>
        )}
        <FormStyled onSubmit={returning} noValidate>
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
                value={
                  buttonName == "book"
                    ? borrowingStore.bookList.find(
                        (item) => item.id === formData.item
                      )
                    : borrowingStore.physicalList.find(
                        (item) => item.id === formData.item
                      )
                }
                onChange={(event, value) => handleChange(event, value, "book")}
                inputValue={itemInputValue}
                onInputChange={(event, value) =>
                  handleInputChange(event, value, "book")
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

            {buttonName == "physical" && (
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
            )}
          </Grid>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            style={{ backgroundColor: "#0D1E46" }}
          >
            החזרה
          </SubmitButton>
        </FormStyled>
      </ContainerStyled>
    </Fields_rtl>
  );
});

export default Returning;
