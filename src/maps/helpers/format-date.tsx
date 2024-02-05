export const formatDate = (date: Date): string => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
};

export const abbrDate = (date: Date): string => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear().toString().slice(2, 4);
  return `${month}/${year}`;
}
