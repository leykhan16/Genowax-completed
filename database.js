const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/admin', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a MongoDB model for your data
const InfoModel = mongoose.model('Info', {
  name: String,
  email: String,
  phone: String,
  age: String,
  gender: String,
  street: String,
  city: String,
  state: String,
  country: String,
  event: String,
  how: String,

});

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/form.html');
});

// Handle form submissions
app.post('/submit', async (req, res) => {
  const { name, email  , phone, age , gender, street, city, state, country, event, how } = req.body;

  // Create a new document with the submitted data
  const newInfo = new InfoModel({ name, email , phone , age, gender , street, city , state, country,event, how });

  

  try {
    // Save the document to MongoDB
    await newInfo.save();
    res.redirect('/index.html');
    
  } catch (error) {
    res.status(500).send('Error storing data.');
  }
  
});

app.use(express.static(__dirname + '/public'));


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/admin', { useNewUrlParser: true, useUnifiedTopology: true });
const Vote = mongoose.model('Vote', { option: String });

app.post('/submit-vote', async (req, res) => {
    const selectedOption = req.body.vote;

    try {
        const newVote = new Vote({ option: selectedOption });
        await newVote.save();
        res.send('Vote submitted successfully.');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/get-results', async (req, res) => {
    try {
        const votes = await Vote.find();
        res.json(votes);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
  console.log("Server is running on port ${3000}");
});