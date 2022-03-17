const express = require('express');
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Gt40mesmer55!!',
      database: 'election'
    },
    console.log('Connected to the election database.')
);

// READ (GET) all candidates
// API endpoint to select all candidates from the database 
app.get('/api/candidates', (req, res) => {
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
app.get('/api/candidate/:id', (req, res) => {
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
app.delete('/api/candidate/:id', (req, res) => {
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
// CREATE a candidate
// API endpoint to create new candidate and store to table 
app.post('/api/candidate', ({ body }, res) => {
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

// UPDATE a candidate's party
// API endpoint for updating a specific candidate's party
app.put('/api/candidate/:id', (req, res) => {
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


// READ (GET) all parties
// API endpoint to select all parties from the database
app.get('/api/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});
// READ (GET) a single party
// API endpoint to select a specific party from the database
app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});
// DELETE (DELETE) a single party
// API endpoint to delete a specific party from the database
app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});



// Default response for any other request (Not Found)
// Important that it comes last of all the routes
app.use((req, res) => {
    res.status(404).end();
  });

// this comes last in the file
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});