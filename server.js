const express = require("express");
const app = express();
const axios = require("axios");
const port = process.env.PORT || 3000;

app.set("view engine", "pug");
app.use(express.static("public"));

async function searchHN(query) {
  const response = await axios.get(
    `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=90`
  );

  return response.data;
}

app.get("/", (req, res) => {
  res.render("home", {
    title: "Search Hacker News",
  });
});

app.get("/search", async (req, res, next) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) {
      res.redirect(302, "/");
      return;
    }

    const results = await searchHN(searchQuery);
    res.render("search", {
      title: `Search results for: ${searchQuery}`,
      searchResults: results,
      searchQuery,
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  const error = new Error("Not Found");
  res.set("Content-Type", "text/html");
  res.status(404).send("<h1>Page Not Found</h1>");
});

app.use(function (err, req, res, next) {
  console.error(err.status);
  res.set("Content-Type", "text/html");
  res.status(500).send("<h1>Internal Server Error</h1>");
});

const server = app.listen(port || 3000, () => {
  console.log(`Hacker news server started on port: ${server.address().port}`);
});
