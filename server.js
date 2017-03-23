const express = require('express');
const client_secret = process.env.CLIENT_SECRET;
const client_id = '961e6abf281bd56388ff'
const request = require('request');

const server = express();

server.use('/', express.static(__dirname + '/public'));

server.use('/oauth-callback', (req, res) => {
  const code = req.query.code;

  const options = {
    url: 'https://github.com/login/oauth/access_token',
    headers: {
      'Accept': 'application/json'
    },
    form: {
      client_id,
      client_secret,
      code
    }
  }

  request.post(options, (err, response, body) => {
    res.redirect('/app.html?' + JSON.parse(body).access_token)
  })
});

server.listen(process.env.PORT);
