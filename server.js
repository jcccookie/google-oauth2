const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(cookieParser());
app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

app.use(express.static(path.join(__dirname, "/views")));

// Index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

// Get OAuth from google
app.get('/oauth', async (req, res, next) => {
  try {
    // Check if state from google server is matched to generated state from client
    if (req.query.state !== req.cookies.sid) {
      res.sendFile(path.join(__dirname, '/views/error.html'));
    } else {
      const options = {
        expire: Date.now() + 3600000,
        httpOnly: false,
        encode: String
      };
  
      res.cookie("state", req.query.state, options);
      res.cookie("code", req.query.code, options);
      
      res.sendFile(path.join(__dirname, '/views/info.html'));
    }
  } catch (error) {
    next(error);
  }
});

// Handling Error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).send({
    Error: err.message
  });
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});