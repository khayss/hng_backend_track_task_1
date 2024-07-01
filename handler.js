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

  switch (parsedUrl.pathname) {
    case "/api/hello":
      if (parsedUrl.query.visitor_name) {
        try {
          const geoData = await query("ip.json", client_ip);
          const currentWeatherData = await query("current.json", geoData?.city);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify({
              greeting: `Hello,  ${parsedUrl.query.visitor_name}!, the temperature is ${currentWeatherData?.temp_c} degrees Celsius in ${geoData?.city}`,
              succcess: true,
              code: 200,
              client_ip,
            })
          );
        } catch (error) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify({
              error: "error processing this the request. pls try again later",
              succcess: false,
              code: 500,
            })
          );
        }
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify(getErrorResponse(req)));
      }
      break;
    default:
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify(getErrorResponse(req)));
  }
};

export default handler;
