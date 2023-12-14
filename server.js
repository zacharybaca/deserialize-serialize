const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
    console.log('Body: ', data);
  });

  req.on("end", () => {
    // Parse the body of the request as JSON if Content-Type header is
      // application/json
    // Using includes instead of strict equals checks if the data is that type, even if it includes extra data
    // where strict equals does not
    if (req.headers['content-type'].includes("application/json")) {
      reqBody = JSON.parse(reqBody);
    }
    // Parse the body of the request as x-www-form-urlencoded if Content-Type
      // header is x-www-form-urlencoded
    if (req.headers['content-type'].includes("application/x-www-form-urlencoded")) {
      reqBody = JSON.parse(reqBody);
    }

    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      // Log the body of the request to the terminal
      console.log(req.body);
    }

    const resBody = {
      "Hello": "World!"
    };

    // Return the `resBody` object as JSON in the body of the response
    const newBody = JSON.stringify(resBody);
    res.setHeader('Content-Type', 'application/json');
    res.write(newBody);
    res.end();
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
