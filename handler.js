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
        "/api/hello?vistor_name='yourname'",
    },
  };
}

const handler = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const clien_ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    null;

  switch (parsedUrl.pathname) {
    case "/api/hello":
      parsedUrl.query.vistor_name;
      res.writeHead(200, { "Content-Type": "application/json" });
      if (parsedUrl.query.vistor_name) {
        try {
          const data = await query("ip.json", clien_ip);

          res.write(
            JSON.stringify({
              greeting: `Hello,  ${parsedUrl.query.vistor_name}!, the temperature is ${data?.current?.temp_c} degrees Celsius in ${data?.location?.name}`,
              succcess: true,
              code: 200,
              clien_ip,
            })
          );
        } catch (error) {
          res.write(
            JSON.stringify({
              error: "error processing this the request. pls try again later",
              succcess: false,
              code: 500,
            })
          );
        }
      } else {
        res.write(JSON.stringify(getErrorResponse(req)));
      }

      break;
    default:
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify(getErrorResponse(req)));
  }
};

export default handler;
