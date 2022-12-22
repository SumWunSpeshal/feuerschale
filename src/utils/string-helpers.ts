import { pipe } from "./pipe";

export function replaceUmlauts(str: string) {
  return str
    .replace(/\u00df/g, "ss")
    .replace(/\u00e4/g, "ae")
    .replace(/\u00f6/g, "oe")
    .replace(/\u00fc/g, "ue")
    .replace(/\u00c4/g, "Ae")
    .replace(/\u00d6/g, "Oe")
    .replace(/\u00dc/g, "Ue");
}

export function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function trim(str: string) {
  return str.trim();
}

export function removeSpaces(str: string) {
  return str.replaceAll(" ", "_");
}

export function formatFileName(fileName: string) {
  return pipe(
    fileName,
    (fileName) => replaceUmlauts(fileName),
    (fileName) => removeAccents(fileName),
    (fileName) => trim(fileName),
    (fileName) => removeSpaces(fileName)
  );
}
