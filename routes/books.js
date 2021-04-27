const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const multer = require("multer");
const path = require("path");
const uploadPath = path.join("public", Book.coverImageBasePath);
const imageMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  }
});

// @route GET /
// @desc  Get all books and render to view
router.get("/", (req, res) => {
  res.send("All Books")
});

// @route GET /new
// @desc  Render form to view for adding a new book
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// @route POST /
// @desc  Create a new book and add to database
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
    coverImageName: fileName,
  });
  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id})
    res.redirect("books");
  } catch {
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find();
    const params = { authors, book };
    if (hasError) {
      params.errorMessage = "Error Creating Book";
    }
    res.render("books/new", params);
  } catch {
    res.redirect("/books");
  }
}

module.exports = router;