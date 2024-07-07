import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
function DetailRequest({ detailRequest }) {
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
  return (
    <div style={{ textAlign: "right" }}>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {detailRequest.userName}
        </Typography>
        <Typography variant="subtitle1">:שם תלמיד</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {detailRequest.tz}
        </Typography>
        <Typography variant="subtitle1">:תעודת זהות</Typography>
      </Box>
      
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {formatDate(detailRequest.requestDate)}
        </Typography>
        <Typography variant="subtitle1">:תאריך בקשה</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {detailRequest.itemName}
        </Typography>
        <Typography variant="subtitle1">:שם הפריט</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {detailRequest.email}
        </Typography>
        <Typography variant="subtitle1">:מייל</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {detailRequest.phoneNumber}
        </Typography>
        <Typography variant="subtitle1">:פלאפון</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {detailRequest.numUserRequests}
        </Typography>
        <Typography variant="subtitle1">:כמות בקשות</Typography>
      </Box>
    </div>
  );
}

DetailRequest.propTypes = {
  detailRequest: PropTypes.shape({
    tz: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    requestDate: PropTypes.string.isRequired,
    numUserRequests: PropTypes.number.isRequired,
  }).isRequired,
};
export default DetailRequest;
