const countries = require('./../data/countries.json');
const cities = []

for(let country of countries) {
    const country_name = countries[country]["country"]
    cities.push(...countries[country]["cities"].map((cities) => cities + " - " + country_name))
}

export const all_cities = cities
