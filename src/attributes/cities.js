import countries from './../data/countries.json';
const cities = []

for(let country of countries) {
    const country_name = country["country"]
    cities.push(...country["cities"].map((cities) => cities + " - " + country_name))
}

export const all_cities = cities
