export function formatDatetime(datetime: string) {
  const fdatetime = datetime.split("T");
  const [year, month, day] = fdatetime[0].split("-");
  const [hour, minute, second_millisecond] = fdatetime[1]
    .replace("Z", "")
    .split(":");

  return `${day} ${getMonthName(month)} ${year}, ${hour}:${minute}`;
}

export function formatDate(date: string) {
  const fdatetime = date.split("T");
  const [year, month, day] = fdatetime[0].split("-");

  return `${day} ${getMonthName(month)} ${year}`;
}

function getMonthName(month: string) {
  switch (month) {
    case "01":
      return "Januari";
    case "02":
      return "Februari";
    case "03":
      return "Maret";
    case "04":
      return "April";
    case "05":
      return "Mei";
    case "06":
      return "Juni";
    case "07":
      return "Juli";
    case "08":
      return "Agustus";
    case "09":
      return "September";
    case "10":
      return "Oktober";
    case "11":
      return "November";
    case "12":
      return "Desember";
    default:
      return "";
  }
}
