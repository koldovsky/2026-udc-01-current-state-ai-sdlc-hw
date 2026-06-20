export type QlikFunction = {
  name: string;
  category: string;
  description: string;
  example: string;
};

export const QLIK_FUNCTIONS: QlikFunction[] = [
  {
    name: "Sum",
    category: "Aggregation",
    description: "Returns the sum of values across records in the aggregated data.",
    example: "Sum(Sales)",
  },
  {
    name: "Count",
    category: "Aggregation",
    description: "Returns the number of values in the aggregated data.",
    example: "Count(OrderID)",
  },
  {
    name: "Avg",
    category: "Aggregation",
    description: "Returns the average of values across records in the aggregated data.",
    example: "Avg(Revenue)",
  },
  {
    name: "Max",
    category: "Aggregation",
    description: "Returns the highest value across records in the aggregated data.",
    example: "Max(Price)",
  },
  {
    name: "Min",
    category: "Aggregation",
    description: "Returns the lowest value across records in the aggregated data.",
    example: "Min(Price)",
  },
  {
    name: "If",
    category: "Conditional",
    description: "Returns a value based on whether a condition is true or false.",
    example: "If(Sales > 1000, 'High', 'Low')",
  },
  {
    name: "Match",
    category: "Conditional",
    description: "Compares an expression to a list of values and returns the position of the first match.",
    example: "Match(Status, 'Active', 'Pending', 'Closed')",
  },
  {
    name: "Date",
    category: "Date & Time",
    description: "Formats a numeric date value as a date string using the given format.",
    example: "Date(OrderDate, 'YYYY-MM-DD')",
  },
  {
    name: "Month",
    category: "Date & Time",
    description: "Returns the month name from a date expression.",
    example: "Month(InvoiceDate)",
  },
  {
    name: "Len",
    category: "String",
    description: "Returns the length of a string.",
    example: "Len(CustomerName)",
  },
  {
    name: "Upper",
    category: "String",
    description: "Converts all characters in a string to uppercase.",
    example: "Upper(ProductCode)",
  },
  {
    name: "Trim",
    category: "String",
    description: "Removes leading and trailing whitespace from a string.",
    example: "Trim(Description)",
  },
];
