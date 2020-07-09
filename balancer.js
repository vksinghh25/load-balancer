const express = require('express');
const request = require('request');
const fs = require('fs');
const https = require('https');
// const sslify = require('express-sslify');

const servers = ['http://localhost:3000', 'http://localhost:3001' ];

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

const profilerMiddleware = (req, res, next) => {
  	const start = Date.now();
  	// The 'finish' event comes from core Node.js, it means Node is done handing
  	// off the response headers and body to the underlying OS.
  	res.on('finish', () => {
    		console.log('Completed', req.method, req.url, Date.now() - start);
  	});
  	next();
};

const handler = (req, res) => {
	const serverNumber = between(0, 1);
	const _req = request({ url: servers[serverNumber] + req.url }).on('error', error => {
    		res.status(500).send(error.message);
  	});
  	req.pipe(_req).pipe(res);
};

const server = express().use(profilerMiddleware).get('*', handler).post('*', handler);

server.listen(8080);

/*const sslOptions = {
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.cert')
};
https.createServer(sslOptions, app).listen(443); */
