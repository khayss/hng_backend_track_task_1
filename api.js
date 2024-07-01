const baseUrl = "http://api.weatherapi.com/v1";

export default async function query(resource, query) {
  const response = await fetch(
    `${baseUrl}/${resource}?key=${process.env.WEATHER_API_KEY}&q=${query}`
  );

  return await response.json();
}
