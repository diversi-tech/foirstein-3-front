import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
function DetailRequest({ userId }) {
  const baseUrl = "https://localhost:7297/api/";
  const [request, setRequest] = useState(null);
  const [numOfRequest, setNumOfRequest] = useState(null);
  const [error, setError] = React.useState();
  //פונקציה שמטרתה לחלץ מהפרוקסי
  function extractRawData(proxyObject) {
    if (proxyObject != undefined && proxyObject.data != null) {
      console.log("Extracting data from proxy object:", proxyObject.data);
      return proxyObject.data;
    } else {
      console.log(
        "Returning original object as it's not a proxy:",
        proxyObject
      );
      return proxyObject;
    }
  }
  //קורא פעם אחת מיד כשהמחלקה עולה
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const requestDetails=await fetch(`${baseUrl}`)
        const res = await fetch(
          `${baseUrl}BorrowApprovalRequest/user/${userId}`
        );
        const data = await res.json();
        setRequest(data);
        const d=extractRawData(data2);
        setNumOfRequest(d);
      } catch (error) {
        setError(error);
        console.error("Failed to fetch request:", error);
      }
    };
    fetchRequest();
  }, []);

  if (error) {
    return <Typography variant="subtitle1">נכשל בשל הורדת הבקשה</Typography>;
  }

  if (!request) {
    return <Typography variant="subtitle1">טוען...</Typography>;
  }

  return (
    <div style={{ textAlign: "right" }}>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {request.data.tz}
        </Typography>
        <Typography variant="subtitle1">:מספר זיהוי</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {request.data.userName}
        </Typography>
        <Typography variant="subtitle1">:שם משתמש</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {request.data.passwordHash}
        </Typography>
        <Typography variant="subtitle1">:סיסמא</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {request.data.createdAt}
        </Typography>
        <Typography variant="subtitle1">:תאריך בקשה</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {request.data.updatedAt}
        </Typography>
        <Typography variant="subtitle1">:תאריך אישור</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
          {request.data.phoneNumber}
        </Typography>
        <Typography variant="subtitle1">:פלאפון</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1" style={{ marginRight: '10px' }}>{numOfRequest}</Typography>
        <Typography variant="subtitle1">:כמות בקשות</Typography>
      </Box>
    </div>
  );
}

DetailRequest.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default DetailRequest;
