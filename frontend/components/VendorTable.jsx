import React, { useState, useMemo } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Text } from "../lib";
import { vendorTableColumns, VENDOR_OPTIONS } from "./../constants";
import Select from "react-select";

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

const UPDATE_VENDORS_QUERY = gql`
  mutation {
    updateVendor(id: 2, name: "test") {
      ok
      vendor {
        id
        name
      }
    }
  }
`;
// const UPDATE_VENDORS_QUERY = gql`
//   mutation updateVendor($id: Int!, $name: String, $status: String) {
//     updateVendor(id: $id, name: $name, status: $status) {
//       ok
//       vendor {
//         id
//         name
//         description
//         externalLink
//         status
//         category
//         risk
//       }
//     }
//   }
// `;

export const VendorTable = () => {
  const { data } = useQuery(GET_VENDORS_QUERY);
  const [updateVendor, { loading, error }] = useMutation(UPDATE_VENDORS_QUERY);
  const vendors = useMemo(() => data && data.vendors, [data]);

  const header = (
    <tr>
      {vendorTableColumns.map((column) => (
        <th key={column}>{column}</th>
      ))}
    </tr>
  );

  const findOptionByValue = (options, value) => {
    return options.find((option) => option.value === value);
  };

  const onChangeStatus = (selectedOption) => {
    console.log("status change...", selectedOption);
    updateVendor();
  };
  const onSubmit = (id) => {
    // const rowId = e.target.parentNode.parentNode.id;
    const data = document.getElementById(id);
    console.log(data);
  };

  const content =
    vendors &&
    vendors.map((vendor) => {
      const {
        id,
        name,
        description,
        externalLink,
        status,
        category,
        risk,
      } = vendor;
      const categoryValue = findOptionByValue(
        VENDOR_OPTIONS.Category,
        category
      );
      const statusValue = findOptionByValue(VENDOR_OPTIONS.Status, status);
      const riskValue = findOptionByValue(VENDOR_OPTIONS.Risk, risk);
      return (
        <tr key={id}>
          <td>
            <a href={externalLink}>{name}</a>
          </td>
          <td>{description}</td>
          <td>
            <Select value={categoryValue} options={VENDOR_OPTIONS.Category} />
          </td>
          <td>
            <Select
              value={statusValue}
              options={VENDOR_OPTIONS.Status}
              onChange={onChangeStatus}
            />
          </td>
          <td>
            <Select value={riskValue} options={VENDOR_OPTIONS.Risk} />
          </td>
          <td>
            <button onClick={() => onSubmit(id)}>Save Changes</button>
          </td>
        </tr>
      );
    });

  return (
    <>
      {vendors ? (
        <table>
          <thead>{header}</thead>
          <tbody>{content}</tbody>
        </table>
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
};
