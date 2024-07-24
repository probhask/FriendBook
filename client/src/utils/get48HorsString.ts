const get48HoursAgoISOString = () => {
  const now = new Date();
  const hoursAgo48 = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  return hoursAgo48.toISOString();
};
export default get48HoursAgoISOString;
