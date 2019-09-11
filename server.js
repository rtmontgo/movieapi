const http = require('http'),
fs = require('fs'),
url = require('url');

http.createServer((request, response) => {
  const addr = request.url,
  q = url.parse(addr, true),
  let filePath = '';

  if (q.pathname.includes('documentation')) {
    filePath = `${__dirname}/documentation.html`;
  } else {
    filePath = 'index.html';
  }

//To access the log.txt file and log either an error or data
fs.readFile(filePath, (err, data) => {
  if (err) {
    throw err;
  }

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write(data);
  response.end();
});

fs.appendFile('log.txt', `URL: ${addr}\nTimestamp: ${Date()}\n\n`, err => {
  if (err) {
    console.log(err);
    response.end();
  } else {
    console.log('Added to log');
    response.end();
  }
});
})
  .listen(3000, () => {
    console.log("App listening on port 3000");
  });
