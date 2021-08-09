import React from "react";
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
  mutation UpdateVendor($id: Int!, $category: String, $status: Int) {
    updateVendor(id: $id, category: $category, status: $status) {
      ok
      vendor {
        id
        status
        category
        risk
      }
    }
  }
`;

export const VendorTable = () => {
  const { data } = useQuery(GET_VENDORS_QUERY);
  const vendors = data && data.vendors;
  //TODO: handle local update on changed row instead of refetch all
  const [updateVendor, { loading }] = useMutation(UPDATE_VENDORS_QUERY, {
    refetchQueries: [{ query: GET_VENDORS_QUERY }],
  });

  const findOptionByValue = (options, value) => {
    return options.find((option) => option.value === value);
  };

  //TODO: form validation & error handling
  //      handle individual loading/disable
  const onChangeOption = (id, name, option) => {
    const { value } = option;
    updateVendor({ variables: { id, [name]: value } });
  };

  const header = (
    <tr>
      {vendorTableColumns.map((column) => (
        <th key={column}>{column}</th>
      ))}
    </tr>
  );

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
      //TODO: add hover
      const shortenDescription =
        description.length > 100
          ? description.substring(0, 150) + "..."
          : description;
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
          <td className="tooltip-comment">
            {shortenDescription}
            <span className="tooltip">{description}</span>
          </td>
          <td>
            <div style={{ width: 200 }}>
              <Select
                value={categoryValue}
                options={VENDOR_OPTIONS.Category}
                onChange={(option) => onChangeOption(id, "category", option)}
                isDisabled={loading}
              />
            </div>
          </td>
          <td>
            <div style={{ width: 120 }}>
              <Select
                value={statusValue}
                options={VENDOR_OPTIONS.Status}
                onChange={(option) => onChangeOption(id, "status", option)}
                width="100px"
                isDisabled={loading}
              />
            </div>
          </td>
          <td>
            <div style={{ width: 120 }}>
              <Select
                value={riskValue}
                options={VENDOR_OPTIONS.Risk}
                onChange={(option) => onChangeOption(id, "risk", option)}
                isDisabled={loading}
              />
            </div>
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
        <Text>loading...</Text>
      )}
    </>
  );
};
