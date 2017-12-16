const _method    = require("method-override");
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
const express    = require("express");
const mongodb    = require("mongodb");
const path       = require("path");
const app        = express();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/restful_blog_app",{useMongoClient: true});

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


//Mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Spock",
//     image: "http://digitalspyuk.cdnds.net/16/44/768x512/gallery-movies-star-trek-spock-4.jpg",
//     body: "Logial dude."
// });

// RESTful routing begins
app.get('/', (req, res) => {
    res.redirect("/blogs");
});

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("Error: ", err) 
        } else {
            res.render("index", { blogs })
        }
    });
});

app.get('/blogs/new', (req,res) => {
    res.render('new');
});

app.post('/blogs', (req, res) => {
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
});

app.get('/blogs/:id', (req, res) => {
    var blogId = req.params.id;
    Blog.findById(blogId, (err, fetchedBlog) => {
        if (err) {
            console.log('Error: ', err);
        } else {
            res.render('show', {blog: fetchedBlog});
        }
    });
});


var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

