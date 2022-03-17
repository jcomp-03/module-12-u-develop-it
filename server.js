const express = require('express');
const db = require('./db/connection'); // import connection module
const apiRoutes = require('./routes/apiRoutes'); // import api routes

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// use apiRoutes
app.use('/api', apiRoutes);


// Default response for any other request (Not Found)
// Important that it comes last of all the routes
app.use((req, res) => {
    res.status(404).end();
  });

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log(`Database connected. You're connected to the ${db.database} database!`);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});