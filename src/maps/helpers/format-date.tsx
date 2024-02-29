export const formatDate = (date: Date): string => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
};

export const toDateUTC = (dateString: string): Date => {
  // Append 'T00:00:00Z' to the input date string to indicate that
  // the time is midnight in UTC
  const utcDateString = dateString + 'T00:00:00Z';
  // Create a Date object from the UTC date string
  const date = new Date(utcDateString);
  return date;
};

