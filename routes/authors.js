const express = require("express");
const router = express.Router();
const Author = require("../models/author");

// @route GET /
// @desc  Get all authors and render to view
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name != "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors,
    searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});

// @route GET /new
// @desc  Render form to view for adding a new author
router.get("/new", (req, res) => {
  const author = new Author();
  res.render("authors/new", { author });
});

// @route POST /
// @desc  Create a new author and add to database
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    //res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`authors`);
  } catch {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error Creating Author"
    });
  }
});

module.exports = router;