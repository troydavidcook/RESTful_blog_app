##### Truncating text to lead to the full post on another page

```
<p><%= blog.body.substring(0, 80) %>...</p>
<a href="/blogs/<%= blog._id %>">Read More...</a>
```

##### Easy way to the time displayed in a viewable manner 

```
 <span><%= blog.created.toDateString() %></span>
```