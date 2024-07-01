import url from "url";
import query from "./api.js";
function getErrorResponse(req) {
  return {
    message: "Not Found",
    code: 404,
    succcess: false,
    data: {
      example:
        (req.protocol || "http") +
        "://" +
        req.headers.host +
        "/api/hello?visitor_name='yourname'",
    },
  };
}

const handler = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const client_ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    null;

  if (parsedUrl.pathname === "/api/hello" && !parsedUrl.query.visitor_name) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify(getErrorResponse(req)));
    return;
  } else if (
    parsedUrl.pathname === "/api/hello" &&
    parsedUrl.query.visitor_name
  ) {
    const { geoData, currentWeatherData } = await getData();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(
      JSON.stringify({
        greeting: `Hello,  ${parsedUrl.query.visitor_name}!, the temperature is ${currentWeatherData?.temp_c} degrees Celsius in ${geoData?.city}`,
        succcess: true,
        code: 200,
        client_ip,
      })
    );
    return;
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify(getErrorResponse(req)));
    return;
  }
};

export default handler;

async function getData() {
  try {
    const geoData = await query("ip.json", client_ip);
    const currentWeatherData = await query("current.json", geoData?.city);

    return {
      geoData,
      currentWeatherData,
    };
  } catch (error) {
    return {
      geoData: null,
      currentWeatherData: null,
    };
  }
}
