import { countries } from "country-data";

const normalized = [...countries.all]
  .sort((a, b) => a.name.localeCompare(b.name, "en"))
  .map(country => ({
    name: country.name,
    currency: country.currencies[0] ?? null
  }));

console.log(normalized);