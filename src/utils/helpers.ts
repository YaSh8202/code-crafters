export function timeAgo(date: Date) {
  const time = Date.now() - new Date(date).getTime();

  // time in milliseconds
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (time < second) {
    return "just now";
  } else if (time < minute) {
    const count = Math.floor(time / second);
    return `${count} second${count > 1 ? "s" : ""} ago`;
  } else if (time < hour) {
    const count = Math.floor(time / minute);
    return `${count} minute${count > 1 ? "s" : ""} ago`;
  } else if (time < day) {
    const count = Math.floor(time / hour);
    return `${count} hour${count > 1 ? "s" : ""} ago`;
  } else {
    const count = Math.floor(time / day);
    return `${count} day${count > 1 ? "s" : ""} ago`;
  }
}
