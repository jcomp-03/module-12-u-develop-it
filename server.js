const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* app.get('/', (req, res) => {
    res.json({
      message: 'Hello World',
      secondMessage: "Again, hello!"
    });
}); */



// Default response for any other request (Not Found)
// Important that it comes last of all the routes
app.use((req, res) => {
    res.status(404).end();
  });

// this comes last in the file
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});