// const express = require('express');
const router = require('express').Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// READ (GET) all candidates
// API endpoint to select all candidates from the database 
// originally app.get('/api/candidates')
router.get('/candidates', (req, res) => {
    // sql command we're going to feed into db.query
    // let's retrieve all the rows from candidates table
    const sql = `SELECT candidates.*, parties.name AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id`;
    db.query(sql, (err, rows) => {
        if(err) { // error code 500 signifies server error
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Data retrieved successfully!',
            data: rows
        });
    });
});
// READ (GET) a single candidate
// API endpoint to select a specific candidate from the database 
// originally app.get('/api/candidate/:id')
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
                 AS party_name 
                 FROM candidates 
                 LEFT JOIN parties 
                 ON candidates.party_id = parties.id 
                 WHERE candidates.id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) { // error code 500 signifies server error
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Data retrieved successfully!',
            data: row
        });
    });
});
// DELETE a candidate
// API endpoint to delete a specific candidate from the database 
// originally app.post('/api/candidate')
router.delete('/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) { // this covers the case if a candidate that doesn't exist is deleted
        res.json({
          message: `Candidate with id ${params} not found`
        });
      } else {
        res.json({
          message: `Candidate with id ${params} has been deleted.`,
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
});
// CREATE (POST) a candidate
// API endpoint to create new candidate and store to table 
// originally app.put('/api/candidate/:id')
router.post('/candidate', ({ body }, res) => {
    // check if any of the candidate properties are missing first
    // by running the imported function inputCheck, passing the destructured
    // 'body' property out of the request object and then the names of
    // the properties which should exist
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    // sql command aka prepared statement we're going to feed into db.query
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
    // params assigment contains three elements in its array which are the
    // user data we obtained from the req.body parameter.
    const params = [body.first_name, body.last_name, body.industry_connected];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Candidate created successfully!',
            data: body
        });
    });
});
// UPDATE (PUT) a candidate's party
// API endpoint for updating a specific candidate's party
// originally app.delete('/api/candidate/:id')
router.put('/candidate/:id', (req, res) => {
    // ensure a party_id was provided before attempting to update candidate's party
    // in the database
    const errors = inputCheck(req.body, 'party_id');
    // if errors is true, respond with appropriate error message
    // and return out of the function
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
});



module.exports = router;