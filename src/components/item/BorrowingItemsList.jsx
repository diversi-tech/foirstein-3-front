import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'Id', headerName: 'מספר השאלה', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'BookName', headerName: 'שם הפריט', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'Date', headerName: 'תאריך השאלה', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'Name', headerName: 'שם התלמידה המשאילה', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'LibrarianName', headerName: 'שם הספרנית המאשרת', flex: 1, headerAlign: 'center', align: 'center' },
];

const rows = [
  { Id: 1, BookName: 'Snow', Date: 'Jon', Name: 35, LibrarianName: 'ffff' },
  { Id: 2, BookName: 'לללל', Date: 'ככככ', Name: 89, LibrarianName: 'דדדד' },
];
const localeText = {
    // תרגום של אפשרויות המיון והפילטור לעברית
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
export default function DataTable() {
  return (
    <div style={{ height: 400, width: '100%', direction: 'rtl' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        localeText={localeText}
        getRowId={(row) => row.Id}
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
}
