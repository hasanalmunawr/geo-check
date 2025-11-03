// index.js
import fetch from 'node-fetch'
import express from 'express'
import fs from  'fs'
import bodyParser from 'body-parser'
// const express = require('express');
// const fs = require('fs');
// // const fetch = require('node-fetch'); // node 18+ bisa pakai global fetch
// const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // serve halaman frontend

// endpoint untuk menerima log dari client
app.post('/log', (req, res) => {
    const entry = {
        timestamp: new Date().toISOString(),
        ip_reported: req.body.ip || null,         // ip yang didapat dari ipapi
        country: req.body.country || null,
        city: req.body.city || null,
        userAgent: req.body.userAgent || req.headers['user-agent'] || null,
        remote_addr: req.headers['x-forwarded-for'] || req.connection.remoteAddress || null,
        raw: req.body
    };
    const line = JSON.stringify(entry) + '\n';
    // append to file
    fs.appendFile('geo_logs.txt', line, (err) => {
        if (err) console.error('write log error', err);
    });
    console.log('LOGGED:', entry);
    res.json({ success: true });
});

// simple health
app.get('/ping', (req, res) => res.send('ok'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server listening on', PORT));
