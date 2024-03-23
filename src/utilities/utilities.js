export const JSDateToExcelDate = (val) => {
  const inDate = new Date(val);
  const returnDateTime =
    25569.0 +
    (inDate.getTime() - inDate.getTimezoneOffset() * 60 * 1000) /
      (1000 * 60 * 60 * 24);
  return returnDateTime.toString().substr(0, 5);
};

export const excelDateToJSDate = (serial) => {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);
  const fractionalDay = serial - Math.floor(serial) + 0.0000001;
  let totalSeconds = Math.floor(86400 * fractionalDay);
  const seconds = totalSeconds % 60;
  totalSeconds -= seconds;

  const year = dateInfo.getFullYear();
  const month =
    dateInfo.getMonth() < 10 ? `0${dateInfo.getMonth()}` : dateInfo.getMonth();
  const date =
    dateInfo.getDate() < 10 ? `0${dateInfo.getDate()}` : dateInfo.getDate();

  return `${date}.${month}.${year}`;
};

export const saveImg = () => {
  const ctx = document.getElementsByTagName('canvas')[0];
  const a = document.createElement('a');
  a.href = ctx.toDataURL('image/png').replace('image/png', 'image/octet-stream'); ;
  a.download = `img_${new Date().getTime()}.jpeg`;
  document.body.appendChild(a);
  a.click();
};
