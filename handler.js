import url from "url";
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

const handler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const clien_ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    null;

  switch (parsedUrl.pathname) {
    case "/api/hello":
      parsedUrl.query.vistor_name;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify(
          parsedUrl.query.vistor_name
            ? {
                greeting: "Hello, " + parsedUrl.query.vistor_name,
                succcess: true,
                code: 200,
                clien_ip,
              }
            : getErrorResponse(req)
        )
      );
      break;
    default:
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify(getErrorResponse(req)));
  }
};

export default handler;
