import * as React from 'react';
import PropTypes from 'prop-types';
//import Swal from 'sweetalert2/dist/sweetalert2.js'
//import 'sweetalert2/src/sweetalert2.scss'
import Swal from 'sweetalert2'
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import GppBadIcon from '@mui/icons-material/GppBad';
import GppGoodIcon from '@mui/icons-material/GppGood';
import VerifiedIcon from '@mui/icons-material/Verified';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import Link from '@mui/material/Link';
import itemStore from '../../store/item-store';
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite';
import './PendingItems.css';
function createData(itemId,title, author, category, createdAt, description, fileP) {
  return {
    itemId,
    title,
    author,
    category,
    createdAt,
    moreDetails: [
      {
        desc: description,
        filePath: fileP,
      },
    ],
  };
}

//itemStore.pendingItemsList.map((item)  => ())
//[
 
// //   createData('ילדים מספרים על עצמם', "חיים ולדר", "ילדים", "24-03-22", "ספר מעניין לילדים", "https://github.com/diversi-tech/foirstein-3-back"),
// //   createData('אבא איתי', "אברהם פריד", "שירי אמונה", "21-08-21", "שיר שבכל מצב אבא איתי", "https://github.com/diversi-tech/foirstein-3-back"),
// //   createData('אשא עיניי', "ליבי קליין", "ספרי מבוגרים", "13-01-23", "ספר על זוגות מתמודדים מכל שכבות הציבור החרדי", "https://github.com/diversi-tech/foirstein-3-back"),
// //   createData('סמי הכבאי', "עודד ברלב", "סרט מצויר לפעוטות", "04-06-20", "סרט חמוד מצויר לילדים קטנים מחייו ומהרפתקאותיו של כבאי", "https://github.com/diversi-tech/foirstein-3-back"),
// ];

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment >
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className="table-cell" align="right">{row.title}</TableCell>
        <TableCell className="table-cell" align="right">{row.author}</TableCell>
        <TableCell className="table-cell" align="right">{row.category}</TableCell>
        <TableCell className="table-cell" align="right">{row.createdAt}</TableCell>
        <IconButton  className="icon-button"  aria-label="Verified" variant="contained" color="primary" onClick={() => approval(row.itemId)} >
         <VerifiedIcon />
        </IconButton>  
        <IconButton  className="icon-button" aria-label="DisabledByDefaultRounded" variant="contained" color="secondary" onClick={() => deny(row.itemId)}>
         <DisabledByDefaultRoundedIcon />
        </IconButton> 
        {/* <Button variant="contained" color="primary" size="small">אישור</Button> */}
        {/* <Button variant="contained" color="secondary" size="small" sx={{ ml: 1 }}>דחייה</Button> */}
      </TableRow>
      <TableRow dir='rtl'>
  <TableCell dir='rtl' style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
 
    <Collapse dir='rtl' in={open} timeout="auto" unmountOnExit>

      {row.moreDetails.map((moreDetail) => (
        
        <div dir='rtl' key={moreDetail.id} style={{paddingRight:"11%"}} >
          <Box display="flex" dir='rtl' >
          <Typography variant="subtitle1" dir='rtl'> <b>תאור: </b></Typography>
            <Typography dir='rtl' variant="subtitle1" style={{ marginRight: "10px" }}>
              {moreDetail.desc}
            </Typography>
            
          </Box>
          <Box display="flex"  dir='rtl'> 
          <Typography variant="subtitle1" dir='rtl'><b>קובץ: </b></Typography>
            <Typography variant="subtitle1" style={{ marginRight: "10px" }} dir='rtl'>
              <Link href="#" underline="hover">
                {`קישור לקובץ`}
              </Link>
            </Typography>
          
          </Box>
        </div>
      ))}
    </Collapse>
  </TableCell>
</TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    moreDetails: PropTypes.arrayOf(
      PropTypes.shape({
        desc: PropTypes.string.isRequired,
        filePath: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
};

async function approval(itemId)
{
    Swal.fire({
      title: "?האם לאשר את הפריט",
      text:"פריט מאושר ייכנס למאגר",
      showDenyButton: true,
      //showCancelButton: true,
      confirmButtonText: "לאשר",
      denyButtonText: `ביטול`
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
       //***********// */

      await itemStore.approvalItem(itemId);
       if(itemStore.isApprov)
        Swal.fire("!הפריט אושר", "", "success");
      else
       Swal.fire("אופס... בעיה בעת שמירת הנתונים", "", "info");
      } 
      else if (result.isDenied) {
        Swal.fire("לא נשמרו שינויים", "", "info");
      }
    });
}
async function deny(itemId)
{
    Swal.fire({
      title: "?האם לא לאשר את הפריט",
      text:"פריט לא מאושר יימחק מהמאגר",
      showDenyButton: true,
      //showCancelButton: true,
      confirmButtonText: "דחיית פריט",
      denyButtonText: `ביטול`
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
       //***********// */

      await itemStore.deniedItem(itemId);
       if(itemStore.isDeind)
        Swal.fire("!הפריט נדחה", "", "success");
      else
       Swal.fire("אופס... בעיה בעת שמירת הנתונים", "", "info");
      } 
      else if (result.isDenied) {
        Swal.fire("לא נשמרו שינויים", "", "info");
      }
    });
}
export const PendingItems= observer(() => {
const rows = toJS(itemStore.getPendingList).map((i)=> (createData(i.id,i.title,i.author,i.category,i.createdAt,i.description,i.filePath) ))
    
  return (
    <TableContainer component={Paper} dir="rtl">
      <Table aria-label="collapsible table">
        <TableHead className="table-head-cell">
          <TableRow className="table-head-cell" >
            <TableCell className="table-head-cell"/>
            <TableCell  className="table-head-cell"style={{  color: 'white' }} align="right" >כותרת</TableCell>
            <TableCell className="table-head-cell" style={{  color: 'white' }} align="right" >מחבר</TableCell>
            <TableCell className="table-head-cell" style={{  color: 'white' }} align="right" >קטגוריה</TableCell>
            <TableCell className="table-head-cell" style={{  color: 'white' }} align="right" >תאריך יצירה</TableCell>
            <TableCell className="table-head-cell" style={{  color: 'white' }} align="right" ></TableCell>
            <TableCell className="table-head-cell" style={{  color: 'white' }} align="right" ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.title} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
})
export default PendingItems;