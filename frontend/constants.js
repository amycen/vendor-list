export const vendorTableColumns = [
  "Name",
  "Description",
  "Category",
  "Status",
  "Risk",
];

export const VENDOR_OPTIONS = {
  Status: [
    { value: 1, label: "Active" },
    { value: 2, label: "Inactive" },
  ],
  Risk: [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ],
  Category: [
    { value: "Software", label: "Software" },
    {
      value: "Consulting, staffing, and professional services",
      label: "Consulting, staffing, and professional services",
    },
    { value: "Other", label: "Other" },
  ],
};
