const sendResponse = (
  statusCode: number,
  message: string,
  payload: string | {},
  error?: string | [] | {} | null,
  token?: string,
) => ({
  statusCode,
  message,
  payload,
  error,
  token,
});

export default sendResponse;
