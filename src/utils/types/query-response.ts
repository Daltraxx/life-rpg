/**
 * QueryResponse is a type that represents the response of a query operation. It contains two properties:
 * - `data`: The data returned from the query, which can be of any type `T` or `null` if the query failed. Always null if error is not null.
 * - `error`: An `Error` object if the query failed, or `null` if the query was successful. Always null if data is not null.
 *
 * @template T - The type of the data returned from the query.
 */
export type QueryResponse<T> = | {
  data: T;
  error: null;
} | {
  data: null;
  error: Error;
};