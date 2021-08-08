import React from "react";
import { css } from "aphrodite";
import customStyleSheet from "../lib/customStyleSheet";
import { VendorTable } from "../components";

const styles = customStyleSheet(({ color }) => ({
  container: {
    backgroundColor: color.background,
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  header: {
    height: "20vh",
  },
  vendorTable: {
    height: "70vh",
    width: "85vw",
  },
}));

function Vendors() {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.header)}>Browse Vendors</div>
      <div className={css(styles.vendorTable)}>
        <VendorTable />
      </div>
    </div>
  );
}

export default Vendors;
