import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import borrowingStore from '../../store/borrowingStore';
import { Modal, Box } from '@mui/material';
import Button from '@mui/material/Button';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import { IconButton, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";

const localeText = {
  columnMenuSortAsc: "מיון לפי סדר עולה",
  columnMenuSortDesc: "מיון לפי סדר יורד",
  columnMenuFilter: "סינון",
  columnMenuHideColumn: "הסתר עמודה",
  columnMenuUnsort: "בטל מיון",
  noRowsLabel: "אין פריטים להצגה",
  columnMenuManageColumns: "ניהול עמודות",
  filterPanelAddFilter: "הוסף מסנן",
  filterPanelDeleteIconLabel: "מחק",
  filterPanelLinkOperator: "אופרטור לוגי",
  filterPanelOperators: "אופרטור",
  filterPanelOperatorAnd: "וגם",
  filterPanelOperatorOr: "או",
  filterPanelColumns: "עמודות",
  filterPanelInputLabel: "ערך",
  filterPanelInputPlaceholder: "סנן ערך",
  filterOperatorContains: "מכיל",
  filterOperatorEquals: "שווה",
  filterOperatorStartsWith: "מתחיל ב",
  filterOperatorEndsWith: "מסתיים ב",
  filterOperatorIs: "הוא",
  filterOperatorNot: "אינו",
  filterOperatorAfter: "אחרי",
  filterOperatorOnOrAfter: "ב או אחרי",
  filterOperatorBefore: "לפני",
  filterOperatorOnOrBefore: "ב או לפני",
  filterOperatorIsEmpty: "ריק",
  filterOperatorIsNotEmpty: "אינו ריק",
  filterOperatorIsAnyOf: "הוא אחד מ",
};

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

const DataTable = observer(() => {
  const [librarianDetails, setLibrarianDetails] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    borrowingStore.fetchBorrowing();
  }, []);

  useEffect(() => {
    if (borrowingStore.borrowingList.length > 0) {
      const newColumns = [
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

      setColumns(newColumns);
    }
  }, [borrowingStore.borrowingList]);


  return (
    <div style={{ height: 400, width: '100%', direction: 'rtl' }}>
      <DataGrid
        rows={borrowingStore.borrowingList}
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
    </div>
  );
});

export default DataTable;





