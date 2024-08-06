import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Borrowing from "./borrowing-file";
import { getRoleFromToken } from "../decipheringToken";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function borrowing() {
  const [value, setValue] = React.useState(-1);
  const [permissions, setPermissions] = React.useState(getRoleFromToken());
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#FFD700",
          },
          "& .MuiTab-root": {
            color: "#0D1E46",
            "&.Mui-selected": {
              color: "#0D1E46",
            },
          },
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {permissions == "LibrarianBook" ? (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="חפץ" {...a11yProps(0)} disabled />
            <Tab label="ספר" {...a11yProps(1)} />
          </Tabs>
        ) : permissions == "Librarian" ? (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="חפץ" {...a11yProps(0)} />
            <Tab label="ספר" {...a11yProps(1)} />
          </Tabs>
        ) : (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="חפץ" {...a11yProps(0)} disabled />
            <Tab label="ספר" {...a11yProps(1)} disabled />
          </Tabs>
        )}
      </Box>
      {value === -1 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          בחר לשונית כדי להציג את התוכן
        </Box>
      ) : (
        <>
          <CustomTabPanel value={value} index={0}>
            <Borrowing buttonName={"physical"} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Borrowing buttonName={"book"} />
          </CustomTabPanel>
        </>
      )}
    </Box>
  );
}
