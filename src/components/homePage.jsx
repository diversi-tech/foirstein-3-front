import React from "react";
import { Outlet } from "react-router-dom";

export default function HomePage() {
  return (
    <React.Fragment>
      <div>HomePage</div>
      <Outlet />
    </React.Fragment>
  );
}
