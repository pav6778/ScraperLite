const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

const PORT = process.env.PORT || 3000;

const db = require('./models')

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NPRscraper";

mongoose.connect(MONGODB_URI);

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', function(req,res){
    res.render('index')
});

app.get('/scrape', function(req,res){

    axios.get('https://www.npr.org/sections/news/').then(function(htmlBody){

        const $ = cheerio.load(htmlBody.data)

        $('.title').each(function(i, element){

            let result = {}

            result.title = $(this).children('a').text()
            result.link = $(this).children('a').attr('href')


            db.Article.create(result).then(function(article){
                console.log(article)
            }).catch(function(err) {

                console.log(err);
              });

        });
    }).then(function(data){

        res.redirect('/')
    })
});

app.get('/articles', function(req, res){
    db.Article.find({}).then(function(article){
        res.json(article)
    }).catch(function(err) {
        res.json(err);
      });
});

app.get("/articles/:id", function(req, res) {

    db.Article.findOne({ _id: req.params.id })

      .populate("note")
      .then(function(article) {

        res.json(article);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.post("/articles/:id", function(req, res) {

    db.Note.create(req.body)
      .then(function(note) {

        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: note._id }, { new: true });
      })
      .then(function(article) {

        res.json(article);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.get('/delete', function(req, res){

      db.Article.remove({}).then(function(data){
          console.log(data)
      }).catch(function(err){
          res.json(err);
      })
      res.redirect('/')
  });

app.listen(PORT, function(){
    console.log("Server is listening at port:" + PORT);
});