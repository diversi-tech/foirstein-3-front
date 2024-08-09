import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import { Modal, Box, Tabs, Grid, Tab, Stack, Pagination, PaginationItem, } from '@mui/material';
import Button from '@mui/material/Button';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import { IconButton, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { CacheProvider } from "@emotion/react";
import { toJS } from 'mobx';
//Icons
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import CircularProgress from "@mui/material/CircularProgress";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SecurityIcon from '@mui/icons-material/Security';
import borrowingStore from '../../store/borrowingStore';
import { cacheRtl } from "../tag/fields_rtl";
import ItemSearch from "./item-search";
import { TypeEnum } from "../Enums";
import { localeText } from './item-list';

const keyToHebrew = {
  id: "מספר ההשאלה",
  date: 'תאריך ההשאלה',
  librarianFname: "שם פרטי של הספרנית",
  librarianSname: "שם משפחה של הספרנית",
  librarianEmail: "מייל של הספרנית",
  librarianPhoneNumber: "טלפון של הספרנית",
  librarianRole: "תפקיד של הספרנית",
  studentFname: "שם פרטי של התלמידה",
  studentSname: "שם משפחה של התלמידה",
  studentEmail: "מייל של התלמידה",
  studentPhoneNumber: "טלפון של התלמידה",
  itemType: 'סוג הפריט',
  itemTitle: 'שם הפריט',
  amount: 'כמות',
  remarks: 'הערות',
  LibrarianFullName: "שם הספרנית",
  StudentFullName: 'שם התלמידה',
};

function formatDate(dateString) {
  const dateObj = new Date(dateString);
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

const LibrarianDetailsModal = ({ open, handleClose, librarian }) => (
  <Modal open={open} onClose={handleClose}>
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, width: 300, margin: 'auto', mt: 5 }}>
      <div dir="rtl">
        <Typography variant="h6" component="h2" textAlign={'center'}>
          פרטי הספרנית
        </Typography>
        <Typography>
          <PersonIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
          {`שם :${librarian.librarianFname} ${librarian.librarianSname}`}
        </Typography>
        <Typography>
          <EmailIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
          {`מייל :${librarian.librarianEmail}`}
        </Typography>
        <Typography>
          <PhoneIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
          {`טלפון :${librarian.librarianPhoneNumber}`}
        </Typography>
        <Typography>
          <SecurityIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
          {`הרשאה :${librarian.librarianRole}`}
        </Typography>
      </div>
      <Button onClick={handleClose} sx={{ mt: 2 }}>סגור</Button>
    </Box>
  </Modal>
);

const StudentDetailsModal = ({ open, handleClose, student }) => (

  <Modal open={open} onClose={handleClose}>
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, width: 300, margin: 'auto', mt: 5 }}>
      <div dir="rtl">
        <Typography variant="h6" component="h2" textAlign={'center'}>
          פרטי התלמידה
        </Typography>
        <Typography>
          <PersonIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
          {`שם :${student.studentFname} ${student.studentSname}`}
        </Typography>
        <Typography>
          <EmailIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
          {`מייל :${student.studentEmail}`}
        </Typography>
        <Typography>
          <PhoneIcon sx={{ height: '1em', marginLeft: '5px', verticalAlign: 'middle' }} />
          {`טלפון :${student.studentPhoneNumber}`}
        </Typography>
      </div>
      <Button onClick={handleClose} sx={{ mt: 2 }}>סגור</Button>
    </Box>
  </Modal>
);

const BorrowingTable = observer(() => {
  const [filterType, setFilterType] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const [librarianDetails, setLibrarianDetails] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await borrowingStore.fetchBorrowing();
      setLoading(false);
      setPage(1);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("borStore:" + toJS(borrowingStore.borrowingList))
    const items = filterItems(toJS(borrowingStore.borrowingList));
    setFilteredItems(items);
  }, [borrowingStore.borrowingList, filterType]);

  const filterItems = (items) => {
    debugger
    console.log("items:", items)
    switch (filterType) {
      case "all": return items;
      case "book": return items.filter((item) => item.itemType === "book");
      case "physical": return items.filter((item) => item.itemType === "physical");
      case "file": return items.filter((item) => item.itemType === "file");
      default: return [];
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = borrowingStore.borrowingList.filter((item) =>
      item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filterItems(filtered));
  };
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const paginatedItems = filteredItems ? filteredItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  ) : [];
  const columns = [
    { field: 'id', headerName: keyToHebrew['id'], flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'date', headerName: keyToHebrew['date'],
      renderCell: (params) => {
        return formatDate(params.row.date)
      },
      flex: 1, headerAlign: 'center', align: 'center'
    },
    { field: 'itemTitle', headerName: keyToHebrew['itemTitle'], flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'itemType', headerName: keyToHebrew['itemType'],
      renderCell: (params) => {
        switch (params.row.itemType) {
          case 'book': return <MenuBookRoundedIcon sx={{ color: "#0D1E46" }} />
          case 'file': return <TextSnippetRoundedIcon sx={{ color: "#0D1E46" }} />
          case 'physical': return <CategoryIcon sx={{ color: "#0D1E46" }} />
        }
      },
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'StudentFullName',
      headerName: keyToHebrew['StudentFullName'],
      renderCell: (params) => {
        const fname = params.row.studentFname || '';
        const sname = params.row.studentSname || '';
        return (
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <span style={{ marginRight: 40 }}>{`${fname} ${sname}`.trim()}</span>
            <Tooltip title="לפרטים נוספים" arrow>
              <IconButton
                onClick={() => setStudentDetails(params.row)}
                style={{ position: 'absolute', right: 0 }}
              >
                <CallMissedOutgoingIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'LibrarianFullName',
      headerName: keyToHebrew['LibrarianFullName'],
      renderCell: (params) => {
        const fname = params.row.librarianFname || '';
        const sname = params.row.librarianSname || '';
        return (
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <span style={{ marginRight: 40 }}>{`${fname} ${sname}`.trim()}</span>
            <Tooltip title="לפרטים נוספים" arrow>
              <IconButton
                onClick={() => setLibrarianDetails(params.row)}
                style={{ position: 'absolute', right: 0 }}
              >
                <CallMissedOutgoingIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'amount', headerName: keyToHebrew['amount'],
      renderCell: (params) => {
        if (!params.row.amount) {
          return 'לא מוגדרת כמות'
        }
      },
      flex: 1, headerAlign: 'center', align: 'center'
    },
    { field: 'remarks', headerName: keyToHebrew['remarks'], flex: 1, headerAlign: 'center', align: 'center' },
  ];
  const totalItems = filteredItems ? filteredItems.length : 0;
  return (
    <div className="itemListDiv" dir="rtl" style={{ marginBottom: 0, paddingBottom: 0 }}>
      <h2 align="center">רשימת פריטים מושאלים</h2>
      <Grid container spacing={2} sx={{ backgroundColor: "#0D1E46", padding: 2 }}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 600,
              "& .MuiTabs-indicator": {
                backgroundColor: "#FFD700",
              },
              "& .MuiTab-root": {
                color: "#dcdcdc",
                "&.Mui-selected": {
                  color: "#FFD700",
                },
              },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tabs
              onChange={(e, newValue) => {
                setFilterType(newValue);
              }}
              value={filterType}
              aria-label="Tabs where selection follows focus"
              selectionFollowsFocus
            >
              <Tab label="הכל" value="all" />
              <Tab label="ספרים" value="book" />
              <Tab label="קבצים" value="file" />
              <Tab label="חפצים" value="object" />
            </Tabs>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CacheProvider value={cacheRtl}>
            <ItemSearch onSearch={handleSearch} />
          </CacheProvider>
        </Grid>
      </Grid>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div style={{ height: 500, width: '100%', direction: 'rtl', position: 'relative' }}>
            <DataGrid
              rows={paginatedItems}
              columns={columns}
              pageSize={rowsPerPage}
              disableSelectionOnClick
              localeText={localeText}
              autoHeight
              style={{ overflow: "hidden" }}
              pagination={false}
              hideFooterPagination
              position="sticky"
              hideFooter
            />
            <Box textAlign="center" marginTop={2}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <div style={{ position: 'sticky', bottom: 0, backgroundColor: 'white' }}>
                  <Pagination
                    dir="ltr"
                    count={Math.ceil(totalItems / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    color="primary"
                    shape="rounded"
                    renderItem={(item) => <PaginationItem {...item} />}
                  />
                </div>
              </Stack>
            </Box>
          </div>
          {librarianDetails && (
            <LibrarianDetailsModal
              open={Boolean(librarianDetails)}
              handleClose={() => setLibrarianDetails(null)}
              librarian={librarianDetails}
            />
          )}
          {studentDetails && (
            <StudentDetailsModal
              open={Boolean(studentDetails)}
              handleClose={() => setStudentDetails(null)}
              student={studentDetails}
            />
          )}
        </>
      )}
    </div>
  )
});

export default BorrowingTable;





