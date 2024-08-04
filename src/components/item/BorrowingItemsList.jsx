import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import borrowingStore from '../../store/borrowingStore';


const columns = [
  { field: 'Id', headerName: 'מספר השאלה', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'Date', headerName: 'תאריך השאלה', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'LibrarianName', headerName: 'שם ספרנית', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'StudentName', headerName: 'שם התלמידה המשאילה', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'ItemTitle', headerName: 'כותרת', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'ItemAuthor', headerName: 'יוצר', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'ItemType', headerName: 'סוג', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'ItemTitle', headerName: 'כותרת', flex: 1, headerAlign: 'center', align: 'center' },
];

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

const DataTable = observer(() => {
  useEffect(() => {
    borrowingStore.fetchBorrowing();
  }, []);

  return (
    <div style={{ height: 400, width: '100%', direction: 'rtl' }}>
      <DataGrid
        rows={borrowingStore.borrowingList.slice()}
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
    </div>
  );
});

export default DataTable;
