const PORT = 3001;

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const ZERO = 0;

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  if (path.extname(req.path).length > ZERO) {
    next();
  } else {
    req.url = '/index.html.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/html');
    next();
  }
});

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

app.use(express.static(path.join(__dirname, '/dist')));
app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', PORT);
  }
});
