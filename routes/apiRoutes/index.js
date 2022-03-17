// const express = require('express');
const router = require('express').Router();

router.use(require('./candidateRoutes')); // import candidate routes
router.use(require('./partyRoutes')); // import party routes

module.exports = router;