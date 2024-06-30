// import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

function DetailRequest({ request }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <Typography variant="subtitle1">
        מספר זיהוי: {request.Id}
      </Typography>
      <Typography variant="subtitle1">
        מספר פריט: {request.ItemId}
      </Typography>
      <Typography variant="subtitle1">
        מספר משתמש: {request.UserId}
      </Typography>
      <Typography variant="subtitle1">
        תאריך בקשה: {request.RequestDate}
      </Typography>
      <Typography variant="subtitle1">
        תאריך אישור: {request.ApprovalDate}
      </Typography>
    </div>
  );
}

DetailRequest.propTypes = {
  request: PropTypes.shape({
    Id: PropTypes.number.isRequired,
    ItemId: PropTypes.number.isRequired,
    UserId: PropTypes.number.isRequired,
    RequestDate: PropTypes.string.isRequired,
    ApprovalDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default DetailRequest;
