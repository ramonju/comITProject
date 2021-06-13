const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));

//this is to parse the data 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB URL
const url = 'mongodb+srv://ramonju:megatron@cluster0.2d1st.mongodb.net/ProjectDiary?retryWrites=true&w=majority';

//mongoose connect to  DB - this is how we connect
mongoose.connect(url, {
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(console.log('MongoDB connected'))
.catch(err => console.log(err))

const Diary = require('./models/diary');

//Creating the index page and other pages
app.get('/', (req,res) => {
  res.render('index', {});
});

app.get('/about', (req,res) => {
  res.render('about', {});
});

app.get('/contact', (req,res) => {
  res.render('contact', {});
});

app.get('/navbar', (req,res) => {
  res.render('navbar', {});
});

app.get('/diarypage', (req,res) => {
  res.render('diarypage', {});
});

app.get('/addPage', (req,res) => {
  res.render('addPage', {});
});

//adding a new entry in addPage, then redirecting to diarypage
app.post('/addNewEntry', (req,res)=> {
  const Data = new Diary({
    addTitle: req.body.title,
    addContent: req.body.description,
    addDate: req.body.date
})

//saving data in the database
Data.save().then(() => {
    console.log("Data Saved");
    res.redirect('/diarypage');
})
    .catch(err => console.log(err));
})

const port = process.env.PORT || 4000;
app.listen(port);