import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import borrowingStore from '../../store/borrowingStore';
import { Modal, Box,Tabs,Grid,Tab } from '@mui/material';
import Button from '@mui/material/Button';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import { IconButton, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { CacheProvider } from "@emotion/react";
import { cacheRtl } from "../tag/fields_rtl";
import ItemSearch from "./item-search";
import { TypeEnum } from "../Enums";
import { localeText } from './item-list';
import { toJS } from 'mobx';

const keyToHebrew = {
  id: "מספר זיהוי",
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

const LibrarianDetailsModal = ({ open, handleClose, librarian }) => (
  <Modal open={open} onClose={handleClose}>
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, width: 300, margin: 'auto', mt: 5 }}>
      <div dir="rtl">
        <Typography variant="h6" component="h2" textAlign={'center'}>
          פרטי הספרנית
        </Typography>
        <Typography>שם: {librarian.librarianFname} {librarian.librarianSname}</Typography>
        <Typography>מייל: {librarian.librarianEmail}</Typography>
        <Typography>טלפון: {librarian.librarianPhoneNumber}</Typography>
        <Typography>הרשאה: {librarian.librarianRole}</Typography>
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
        <Typography>שם: {student.studentFname} {student.studentSname}</Typography>
        <Typography>מייל: {student.studentEmail}</Typography>
        <Typography>טלפון: {student.studentPhoneNumber}</Typography>
      </div>
      <Button onClick={handleClose} sx={{ mt: 2 }}>סגור</Button>
    </Box>
  </Modal>

);

const BorrowingTable = observer(() => {
  const [borrowingItems,setBorrowingItems]=useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const [librarianDetails, setLibrarianDetails] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true); 
  //     await borrowingStore.fetchBorrowing();
  //     setLoading(false); 
  //   };
  
  //   fetchData();
  // }, []);
  // useEffect(()=>{
  //  setBorrowingItems(borrowingStore.getborrowingList)
  
  // },[borrowingStore.borrowingList,filterType])
    
  // useEffect(()=>{
  //   setFilteredItems(filterItems());
  // },[borrowingItems])
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await borrowingStore.fetchBorrowing();
      setLoading(false);
    };

    fetchData();
  }, [borrowingStore]);

  useEffect(() => {
    const items = borrowingStore.getborrowingList;
    console.log('Borrowing Items:', items);
    setBorrowingItems(items);
  }, [borrowingStore.borrowingList]);

  useEffect(() => {
    const items = filterItems(toJS(borrowingStore.borrowingList));
    console.log('Filtered Items:', items);
    setFilteredItems(items);
  }, [borrowingItems, filterType]);

  const filterItems = (items) => {
    debugger
    // const JSitems=toJS(borrowingItems);
    // console.log("borItems:",JSitems)
    if (!items) {
      return [];
    }
    if (filterType === "all") {
      return items;
    }
    if (filterType === "book") {
      return items.filter((item) => item.itemType === TypeEnum.BOOK);
    }
    if (filterType === 'object') {
    return items.filter((item) =>item.itemType === TypeEnum.PHYSICALITEM);
    }
      return items.filter((item) => item.itemType === TypeEnum.FILE);
  };

  const handleSearch = (searchTerm) => {
    const filtered = borrowingStore.borrowingList.filter((item) =>
      item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filterItems(filtered));
  };

  const columns = [
    { field: 'id', headerName: keyToHebrew['id'], flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: keyToHebrew['date'], flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'itemTitle', headerName: keyToHebrew['itemTitle'], flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'itemType', headerName: keyToHebrew['itemType'],
      renderCell: (params) => {
        switch (params.row.itemType) {
          case 'book': return <MenuBookRoundedIcon sx={{ color: "#0D1E46" }}/>
          case 'file': return <TextSnippetRoundedIcon sx={{ color: "#0D1E46" }}/>
          case 'physical': <CategoryIcon sx={{ color: "#0D1E46" }}/>
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
    { field: 'amount', headerName: keyToHebrew['amount'],
    renderCell: (params) => {
     if(!params.row.amount)
     {
      return 'לא מוגדרת כמות'
     }
    },
     flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'remarks', headerName: keyToHebrew['remarks'], flex: 1, headerAlign: 'center', align: 'center' },
  ];

  return (
  loading?(
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="50vh"
  >
    <CircularProgress />
  </Box>
  ):
    (<div style={{ height: 400, width: '100%', direction: 'rtl' }}>
         <Grid
          container
          spacing={2}
          sx={{ backgroundColor: "#0D1E46", padding: 2 }}
        >
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
      <DataGrid
        rows={filteredItems}
        columns={columns}
        localeText={localeText}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
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
    </div>)
  );
});

export default BorrowingTable;





