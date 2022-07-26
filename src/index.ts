"use strict";
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;
const DBPassword = process.env.MONGODB_PASSWORD;

console.log(`mongodb://nadrukirekdb_MagazynNadrek:${DBPassword}@mongodb.nadrukirekdb.nazwa.pl:4063/nadrukirekdb_MagazynNadrek`);

mongoose
    .connect(
        `mongodb://nadrukirekdb_MagazynNadrek:mdlTpILoQ>3kJk3sbDi94l@mongodb.nadrukirekdb.nazwa.pl:4063/nadrukirekdb_MagazynNadrek`, 
        { useNewUrlParser: true, user: 'nadrukirekdb_MagazynNadrek', pass: '' }
    )
    .then(() => {
        // app.get('/', (req, res) => {
        //     res.send('index')
        // });
        
        // app.listen({ port }, () => {
        //     console.log(`Server is running at http://localhost:8080`);
        // });
        console.log('test')
    })