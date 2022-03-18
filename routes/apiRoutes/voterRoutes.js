// const express = require('express');
const router = require('express').Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// READ (GET) all voters
// API endpoint to select all voters from the database  
router.get('/voters', (req, res) => {
  const sql = `SELECT * FROM voters ORDER BY last_name`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'You successfully pulled all voters from the voters database',
        data: rows,
      });
    });
});
// READ (GET) a single candidate
// API endpoint to select a particular voter from the database  
router.get('/voter/:id', (req, res) => {
  const sql = `SELECT * FROM voters WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: `You successfully pulled voter with id ${params} from the voters database`
    });
  });
});
// CREATE (POST) a voter
// API endpoint to create new voter and store to table 
router.post('/voter', ({ body }, res) => {
  // Data validation
  const errors = inputCheck(body, 'first_name', 'last_name', 'email');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.email];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: `You successfully inserted a new voter, ${body.first_name} ${body.last_name}, into the voters database`,
      data: body
    });
  });
});
// UPDATE (PUT) a voter's email address
// API endpoint for updating a specific voter's email address
router.put('/voter/:id', (req, res) => {
  // Data validation
  const errors = inputCheck(req.body, 'email');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE voters SET email = ? WHERE id = ?`;
  const params = [req.body.email, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Voter not found'
      });
    } else {
      res.json({
        message: `You successfully updated the email address to ${params[0]} for voter with id ${params[1]}.`,
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});
// DELETE (DELETE) a voter
// API endpoint for deleting a specific user
router.delete('/voter/:id', (req, res) => {
  const sql = `DELETE FROM voters WHERE id = ?`;

  db.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Voter not found'
      });
    } else {
      res.json({
        message: `You succesfully deleted voter with id ${req.params.id}.`,
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});


module.exports = router;