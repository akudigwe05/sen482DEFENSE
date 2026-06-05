const express = require('express');
const healthRouter = require('./routes/health');
const usersRouter = require('./routes/users');
 
const app = express();
app.use(express.json());
 
app.use('/health', healthRouter);
app.use('/api/users', usersRouter);
 
module.exports = app;
