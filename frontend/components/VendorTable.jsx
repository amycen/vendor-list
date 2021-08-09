import React, { useState, useMemo } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Text } from "../lib";
import { vendorTableColumns, VENDOR_OPTIONS } from "./../constants";
import Select from "react-select";
import { useEffect } from "react";

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
  mutation UpdateVendor($id: Int!, $category: String, $status: Int) {
    updateVendor(id: $id, category: $category, status: $status) {
      ok
      vendor {
        id
        status
        category
      }
    }
  }
`;

export const VendorTable = () => {
  const { data } = useQuery(GET_VENDORS_QUERY);
  const vendors = data && data.vendors;
  const [updateVendor] = useMutation(UPDATE_VENDORS_QUERY, {
    refetchQueries: [{ query: GET_VENDORS_QUERY }],
  });

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

  //TODO: form validation & error handling
  const onChangeOption = (id, name, option) => {
    const { value } = option;
    updateVendor({ variables: { id, [name]: value } });
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
            <Select
              value={categoryValue}
              options={VENDOR_OPTIONS.Category}
              onChange={(option) => onChangeOption(id, "category", option)}
            />
          </td>
          <td>
            <Select
              value={statusValue}
              options={VENDOR_OPTIONS.Status}
              onChange={(option) => onChangeOption(id, "status", option)}
            />
          </td>
          <td>
            <Select
              value={riskValue}
              options={VENDOR_OPTIONS.Risk}
              onChange={(option) => onChangeOption(id, "risk", option)}
            />
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
