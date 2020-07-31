const express = require('express');
const client_secret = process.env.CLIENT_SECRET;
const client_id = '961e6abf281bd56388ff'
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const server = express();

server.use('/', express.static(__dirname + '/public'));

server.use('/oauth-callback', (req, res) => {
  const code = req.query.code;
  const params = new URLSearchParams();
  params.append('client_id', client_id);
  params.append('client_secret', client_secret);
  params.append('code', code);

  const options = {
    method: 'POST',
    body: params,
    headers: {
      'Accept': 'application/json'
    }
  }

  fetch('https://github.com/login/oauth/access_token', options)
    .then(data => data.json())
    .then(json => res.redirect('/app.html?' + json.access_token)
    )
});

server.listen(process.env.PORT);
