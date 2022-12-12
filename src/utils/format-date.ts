type DateFun = (
  date: Date | number | string | null | undefined
) => string | undefined;

type DateHelper = {
  "yyyy-MM-dd": DateFun;
  "dd.MM.": DateFun;
  "dd.MM.yyyy": DateFun;
  Month_yyyy: DateFun;
  full: DateFun;
};

export const formatDate: DateHelper = {
  "yyyy-MM-dd": (date) =>
    date ? new Date(date).toISOString().split("T")[0] : undefined,
  "dd.MM.": (date) =>
    date
      ? new Date(date).toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
        })
      : undefined,
  "dd.MM.yyyy": (date) =>
    date
      ? new Date(date).toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : undefined,
  Month_yyyy: (date) =>
    date
      ? new Date(date).toLocaleDateString("de-DE", {
          month: "long",
          year: "numeric",
        })
      : undefined,
  full: (date) =>
    date
      ? new Date(date).toLocaleDateString("de-DE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined,
};
