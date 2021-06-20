const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');

dotenv.config();
// mongoClient will be used to connect to local server
//remove mongoClient to connect to live site

//connect to local db
// const dburl = 'mongodb://localhost:27017';
 
// mongoClient.connect(dburl, (err, client) => {
//   console.log('Connected to DB');
// }); //remove this code to connect to live site

// app.set('diarypage', __dirname + 'views/diarypage');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(methodOverride('_method'));

//this is to parse the data 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB URl
const url = 'mongodb+srv://ramonju:megatron@cluster0.2d1st.mongodb.net/ProjectDiary?retryWrites=true&w=majority';

//mongoose connect to  DB - this is how we connect
mongoose.connect(url, {
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(console.log('MongoDB connected'))
.catch(err => console.log(err))

const { MongoClient } = require('mongodb');

//Creating the index page and other pages
app.get('/', (req,res) => {
  res.render('index', {});
});

// app.post('api/register', async (req,res) =>{
//   console.log(req.body);
//   res.json({status:'ok'})
// });

app.get('/about', (req,res) => {
  res.render('about', {});
});

app.get('/contact', (req,res) => {
  res.render('contact', {});
});

app.get('/navbar', (req,res) => {
  res.render('navbar', {});
});

app.get('/addPage', (req,res) => {
  res.render('addPage', {});
});

app.get('/fullDiary', (req,res) => {
  res.render('fullDiary', {});
});

const Diary = require('./models/diary');

app.get('/diarypage', (req,res) => {
  Diary.find()
    .then(datas => {
      res.render('diarypage', {datas:datas});
  })
    .catch(err => console.log(err));
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
});

app.put('/diarypage/edit:id', (req,res) => {
  Diary.findOne({
    _id:req.params.id
  }).then(data => {
    data.addTitle = req.body.title
    data.addContent = req.body.description
    data.addDate = req.body.date
    data.save().then(() => {
      res.redirect('/diarypage');
    }).catch(err => console.log(err));
  });
});

app.delete('diarypage/delete:id', (req,res) => {
  res.send(req.params.id)
  // Diary.remove({
  //   _id:req.params.id
  // }).then(() => {
  //   res.redirect('/diarypage');
  // }).catch(err => console.log(err));
});

// FINALLY! WITH THE VIEW BUTTON, THIS ONE ROUTES THE OBJECTID AND SENDS BACK THE INFO FOR THE OBJECT
app.get('/diarypage:id', (req,res) => {
  Diary.findOne({
    _id:req.params.id
  }).then(data => {
    res.render('fullDiary', {data:data});
  });
});

// FIRST ATTEMPT TO TRY THE EDIT FUNCTION BUTTON
app.get('/editDiary/edit:id', (req,res) => {
  Diary.findOne({
    _id:req.params.id
  }).then(data => {
    res.render('editDiary', {data:data});
  }).catch(err => console.log(err));
});


// this is the LIVE PORT - TURN THIS ON to view on site!!
const port = process.env.PORT || 4000;
app.listen(port);

// uncomment this to access local server
// app.listen(3005, (req,res) => {
//   console.log('Listening to port 3005');
// });