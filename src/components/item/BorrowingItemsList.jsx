// import * as React from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { useEffect, useState } from 'react';
// import { observer } from "mobx-react-lite";
// import borrowingStore from '../../store/borrowingStore';
// import { Button, Modal, Box, Typography } from '@mui/material';

// // הגדרת ה-localization עבור DataGrid
// const localeText = {
//   columnMenuSortAsc: "מיון לפי סדר עולה",
//   columnMenuSortDesc: "מיון לפי סדר יורד",
//   columnMenuFilter: "סינון",
//   columnMenuHideColumn: "הסתר עמודה",
//   columnMenuUnsort: "בטל מיון",
//   noRowsLabel: "אין פריטים להצגה",
//   columnMenuManageColumns: "ניהול עמודות",
//   filterPanelAddFilter: "הוסף מסנן",
//   filterPanelDeleteIconLabel: "מחק",
//   filterPanelLinkOperator: "אופרטור לוגי",
//   filterPanelOperators: "אופרטור",
//   filterPanelOperatorAnd: "וגם",
//   filterPanelOperatorOr: "או",
//   filterPanelColumns: "עמודות",
//   filterPanelInputLabel: "ערך",
//   filterPanelInputPlaceholder: "סנן ערך",
//   filterOperatorContains: "מכיל",
//   filterOperatorEquals: "שווה",
//   filterOperatorStartsWith: "מתחיל ב",
//   filterOperatorEndsWith: "מסתיים ב",
//   filterOperatorIs: "הוא",
//   filterOperatorNot: "אינו",
//   filterOperatorAfter: "אחרי",
//   filterOperatorOnOrAfter: "ב או אחרי",
//   filterOperatorBefore: "לפני",
//   filterOperatorOnOrBefore: "ב או לפני",
//   filterOperatorIsEmpty: "ריק",
//   filterOperatorIsNotEmpty: "אינו ריק",
//   filterOperatorIsAnyOf: "הוא אחד מ",
// };

// // Component to display librarian details in a modal
// const LibrarianDetailsModal = ({ open, handleClose, librarian }) => (
//   <Modal open={open} onClose={handleClose}>
//     <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, width: 300, margin: 'auto', mt: 5 }}>
//       <Typography variant="h6" component="h2">
//         פרטי הספרנית
//       </Typography>
//       <Typography>שם: {librarian.LibrarianFname} {librarian.LibrarianSname}</Typography>
//       <Typography>מייל: {librarian.LibrarianEmail}</Typography>
//       <Typography>טלפון: {librarian.LibrarianPhoneNumber}</Typography>
//       <Typography>תפקיד: {librarian.LibrarianRole}</Typography>
//       <Button onClick={handleClose} sx={{ mt: 2 }}>סגור</Button>
//     </Box>
//   </Modal>
// );

// // Component to display student details in a modal
// const StudentDetailsModal = ({ open, handleClose, student }) => (
//   <Modal open={open} onClose={handleClose}>
//     <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, width: 300, margin: 'auto', mt: 5 }}>
//       <Typography variant="h6" component="h2">
//         פרטי התלמידה
//       </Typography>
//       <Typography>שם: {student.StudentFname} {student.StudentSname}</Typography>
//       <Typography>מייל: {student.StudentEmail}</Typography>
//       <Typography>טלפון: {student.StudentPhoneNumber}</Typography>
//       <Button onClick={handleClose} sx={{ mt: 2 }}>סגור</Button>
//     </Box>
//   </Modal>
// );

// const DataTable = observer(() => {
//   const [librarianDetails, setLibrarianDetails] = useState(null);
//   const [studentDetails, setStudentDetails] = useState(null);

//   useEffect(() => {
//     borrowingStore.fetchBorrowing();
//   }, []);

//   useEffect(() => {
//     console.log("bor: "+JSON.stringify(borrowingStore.borrowingList))
//   }, []);

//   const columns = [
//     { field: 'Id', headerName: 'מספר השאלה', flex: 1, headerAlign: 'center', align: 'center' },
//     { field: 'Date', headerName: 'תאריך השאלה', flex: 1, headerAlign: 'center', align: 'center' },
//     {
//       field: 'LibrarianName',
//       headerName: 'שם ספרנית',
//       flex: 1,
//       headerAlign: 'center',
//       align: 'center',
//       renderCell: (params) => (
//         <>
//           {params.row.LibrarianFname} {params.row.LibrarianSname}
//           <Button
//             size="small"
//             onClick={() => setLibrarianDetails(params.row)}
//             sx={{ ml: 1 }}
//           >
//             פרטים
//           </Button>
//         </>
//       ),
//     },
//     {
//       field: 'StudentName',
//       headerName: 'שם התלמידה המשאילה',
//       flex: 1,
//       headerAlign: 'center',
//       align: 'center',
//       renderCell: (params) => (
//         <>
//           {params.row.StudentFname} {params.row.StudentSname}
//           <Button
//             size="small"
//             onClick={() => setStudentDetails(params.row)}
//             sx={{ ml: 1 }}
//           >
//             פרטים
//           </Button>
//         </>
//       ),
//     },
//     { field: 'ItemTitle', headerName: 'כותרת', flex: 1, headerAlign: 'center', align: 'center' },
//     { field: 'ItemType', headerName: 'סוג', flex: 1, headerAlign: 'center', align: 'center' },
//     { field: 'Amount', headerName: 'כמות', flex: 1, headerAlign: 'center', align: 'center' },
//     { field: 'Remarks', headerName: 'הערות', flex: 1, headerAlign: 'center', align: 'center' },
//   ];

//   return (
//     <div style={{ height: 400, width: '100%', direction: 'rtl' }}>
//       <DataGrid
//         rows={borrowingStore.borrowingList}
//         columns={columns}
//         localeText={localeText}
//         initialState={{
//           pagination: {
//             paginationModel: { page: 0, pageSize: 5 },
//           },
//         }}
//         pageSizeOptions={[5, 10]}
//         checkboxSelection
//       />
//       {librarianDetails && (
//         <LibrarianDetailsModal
//           open={Boolean(librarianDetails)}
//           handleClose={() => setLibrarianDetails(null)}
//           librarian={librarianDetails}
//         />
//       )}
//       {studentDetails && (
//         <StudentDetailsModal
//           open={Boolean(studentDetails)}
//           handleClose={() => setStudentDetails(null)}
//           student={studentDetails}
//         />
//       )}
//     </div>
//   );
// });

// export default DataTable;
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import borrowingStore from '../../store/borrowingStore';
import { Button, Modal, Box, Typography } from '@mui/material';

// Localization for DataGrid
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

// Component to display librarian details in a modal
const LibrarianDetailsModal = ({ open, handleClose, librarian }) => (
  <Modal open={open} onClose={handleClose}>
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, width: 300, margin: 'auto', mt: 5 }}>
      <Typography variant="h6" component="h2">
        פרטי הספרנית
      </Typography>
      <Typography>שם: {librarian.LibrarianFname} {librarian.LibrarianSname}</Typography>
      <Typography>מייל: {librarian.LibrarianEmail}</Typography>
      <Typography>טלפון: {librarian.LibrarianPhoneNumber}</Typography>
      <Typography>תפקיד: {librarian.LibrarianRole}</Typography>
      <Button onClick={handleClose} sx={{ mt: 2 }}>סגור</Button>
    </Box>
  </Modal>
);

// Component to display student details in a modal
const StudentDetailsModal = ({ open, handleClose, student }) => (
  <Modal open={open} onClose={handleClose}>
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, width: 300, margin: 'auto', mt: 5 }}>
      <Typography variant="h6" component="h2">
        פרטי התלמידה
      </Typography>
      <Typography>שם: {student.StudentFname} {student.StudentSname}</Typography>
      <Typography>מייל: {student.StudentEmail}</Typography>
      <Typography>טלפון: {student.StudentPhoneNumber}</Typography>
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
      // Create columns dynamically based on the fields of the first object
      const newColumns = Object.keys(borrowingStore.borrowingList[0]).map((key) => ({
        field: key,
        headerName: key,
        flex: 1,
        headerAlign: 'center',
        align: 'center',
      }));
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

