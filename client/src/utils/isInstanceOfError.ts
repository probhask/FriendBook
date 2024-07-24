const isInstanceOfError = (error: unknown, defaultMessage?: string) => {
  return error instanceof Error
    ? `${error.message.slice(0, 50)}`
    : defaultMessage
    ? defaultMessage
    : "error";
};
export default isInstanceOfError;
