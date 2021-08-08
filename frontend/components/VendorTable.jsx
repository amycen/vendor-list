import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Text } from "../lib";
import { VENDOR_OPTIONS } from "./../constants";
import { gql, useQuery } from "@apollo/client";
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;

const GET_VENDORS_QUERY = gql`
  query GetVendors {
    vendors {
      id
      name
      description
      externalLink
      status
      category
      risk
    }
  }
`;

const columns = [
  {
    dataField: "name",
    text: "Vendor Name",
    sort: true,
  },
  {
    dataField: "description",
    text: "Description",
    editor: {
      type: Type.TEXTAREA,
    },
  },
  {
    dataField: "category",
    text: "Category",
    editor: {
      type: Type.SELECT,
      options: VENDOR_OPTIONS.Category,
    },
  },
  {
    dataField: "status",
    text: "Status",
    editor: {
      type: Type.SELECT,
      options: VENDOR_OPTIONS.Status,
    },
    sort: true,
  },
  {
    dataField: "risk",
    text: "Risk",
    editor: {
      type: Type.SELECT,
      options: VENDOR_OPTIONS.Risk,
    },
    sort: true,
    // formatter: (cell) => VENDOR_OPTIONS.Risk[cell],
    // filter: selectFilter({
    //   options: VENDOR_OPTIONS.Risk,
    // }),
  },
];

const VendorTable = () => {
  const { data } = useQuery(GET_VENDORS_QUERY);
  const vendors = useMemo(() => data && data.vendors, [data]);
  return (
    <>
      {vendors ? (
        <ToolkitProvider
          keyField="id"
          data={vendors}
          columns={columns}
          search
          cellEdit={cellEditFactory({ mode: "click", blurToSave: true })}
          pagination={paginationFactory()}
          //   filter={filterFactory()}
          exportCSV
        >
          {(props) => (
            <div>
              <SearchBar {...props.searchProps} />
              <ExportCSVButton {...props.csvProps}>
                Export to CSV
              </ExportCSVButton>
              <hr />
              <BootstrapTable {...props.baseProps} />
            </div>
          )}
        </ToolkitProvider>
      ) : (
        <Text>loading...</Text>
      )}
    </>
  );
};

export default VendorTable;
