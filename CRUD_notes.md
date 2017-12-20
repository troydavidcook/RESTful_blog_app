# Setting Up a Basic full CRUD Application
###### Critial node modules: 
```
const expressSanitizer  = require("express-sanitizer");
const methodOverride    = require("method-override");
const bodyParser        = require("body-parser");
const mongoose          = require("mongoose");
const express           = require("express");
const mongodb           = require("mongodb");
const path              = require("path");
const app               = express();
```



## RESTful Routing - Takeaways

##### A way of mapping our route architecutre in our CRUD (Create, Read, Update, Destroy) applications.
###### There can be serveral pages, but this is a way to make it clean and easier to understand and read the way our routes are handinling our HTTP requests. Get ready for some 'method-override' npm!

  restful_notes restful_routes 
  ___

| **URL** | **HTTP Verb** |  **Action**| **Mongoose Method**|
|------------|-------------|------------|------------|
| /blog/         | GET       | index    | Blog.find({}) 
| /blog/:id      | GET       | show     | Blog.findById(id) : Renders Form
| /blog/:id      | PATCH/PUT | update   | Blog.findByIdAndUpdate()
| /blog/new      | GET       | new      | N/A : Renders Form
| /blog          | POST      | create   | Blog.create()
| /blog/:id/edit | GET       | edit     | Blog.findById(id)
| /blog/:id/     | DELETE    | Remove   | Blog.findByIdAndRemove(id)



###### This is a conventional pattern among developing. May people are looking for this and adagin, is pretty conventional.




### Blog-particular notes.

###### Truncating text to lead to the full post on another page. Shows only enough text  to lead the use to the SHOW page.

```
<p><%= blog.body.substring(0, 80) %>...</p>
<a href="/blogs/<%= blog._id %>">Read More...</a>
```

###### Easy way to the time displayed in a viewable manner 

```
 <span><%= blog.created.toDateString() %></span>
```

Sanitizing data with Express.
```
const expressSanitizer  = require("express-sanitizer");

app.use(bodyParser.urlencoded({extended: true}));
    // Sanitizer must be implemented after body-parser
app.use(expressSanitizer());

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
```