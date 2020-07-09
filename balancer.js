const express = require('express');
const request = require('request');
const fs = require('fs');
const https = require('https');

const numberOfServers = 3;
const servers = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002' ];
let current = 0;

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
	const _req = request({ url: servers[current % numberOfServers] + req.url }).on('error', error => {
    		res.status(500).send(error.message);
  	});
  	req.pipe(_req).pipe(res);
	current = current + 1;
	console.log('Current value of current : ' + current);
};

const server = express().use(profilerMiddleware).get('*', handler).post('*', handler);

server.listen(8080);

