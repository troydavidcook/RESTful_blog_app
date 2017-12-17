const expressSanitizer  = require("express-sanitizer");
const methodOverride    = require("method-override");
const bodyParser        = require("body-parser");
const mongoose          = require("mongoose");
const express           = require("express");
const mongodb           = require("mongodb");
const path              = require("path");
const app               = express();

// App Config
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/restful_blog_app",{useMongoClient: true});
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}));
// Sanitizer must be implemented after body-parser
app.use(expressSanitizer());
app.use(methodOverride("_method"));
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
 // Index Page, which slash route above will redirect to.
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("Error: ", err) 
        } else {
            res.render("index", { blogs })
        }
    });
});
  
// Renders form to add to index page.
app.get('/blogs/new', (req,res) => {
    res.render('new');
});

// Post route for new item that renders the index page.
app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
});

// Show page to show individual items by ID.
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

// Renders form by ID for item to edit.
app.get('/blogs/:id/edit', (req, res) => {
    var blogId = req.params.id;
    Blog.findById(blogId, (err, fetchedBlog) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: fetchedBlog});
        }
    })
});

// Route to actually update item by ID. Uses a redirect to GET
app.put('/blogs/:id', (req, res) => {
    var blogId = req.params.id;
    var newData = req.body.blog;
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(blogId, newData, (err, updatedBlog) => {
        if (err) {
            console.log("Error", err);
        }
        else {
            res.redirect(`/blogs/${blogId}`);
        }
    });
});

// DELETE route!
app.delete('/blogs/:id', (req, res) => {
    var blogId = req.params.id;
    Blog.findByIdAndRemove(blogId, (err) => {
        if (err) {
            console.log('Error: ', err);
        }
        else {
            res.redirect('/blogs')
        }
    });
});


var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

