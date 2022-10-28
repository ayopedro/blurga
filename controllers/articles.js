const Article = require("../models/Article");

const getArticles = async (req, res) => {
  const articles = await Article.find();
  if (!articles) return res.status(204).json({ message: "No article found!" });
  res.status(200).json(articles);
};

const addArticle = async (req, res) => {
  const { title, description, tags, author, body } = req.body;

  const duplicate = await Article.findOne({ title }).exec();

  if (duplicate) {
    return res.status(400).json({ message: `Article with title ${title} already exists!` });
  }

  const newArticle = await Article.create({
    title,
    description,
    tags,
    author,
    body,
  });

  if (!title || !description || !author || !body) {
    return res
      .status(400)
      .json({ message: "Title, author, description and body are required!" });
  }

  try {
    const result = await newArticle;
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateArticle = async (req, res) => {
  if (!req.body?.id) {
    return res.status(400).json({ message: "ID is required!" });
  }

  const article = await Article.findOne({ _id: req.body.id }).exec();

  if (!article) {
    return res
      .status(204)
      .json({ message: `No article matches ID ${req.body.id}` });
  }

  if (req.body?.title) {
    article.title = req.body.title;
  }

  if (req.body?.description) {
    article.description = req.body.description;
  }

  if (req.body?.tags) {
    article.tags = req.body.tags;
  }

  if (req.body?.author) {
    article.author = req.body.author;
  }

  if (req.body?.body) {
    article.body = req.body.body;
  }

  const result = await article.save();

  res.json(result);
};

const deleteArticle = async (req, res) => {
  if (!req.body?.id) {
    return res.status(400).json({ message: "Article ID is required!" });
  }

  const article = await Article.findOne({ _id: req.body.id }).exec();

  if (!article) {
    return res
      .status(400)
      .json({ message: `article ID ${req.body.id} not found!` });
  }

  const result = await article.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getArticle = async (req, res) => {
  if (!req.params?.id) {
    return res.status(400).json({ message: "Article ID is required!" });
  }

  const article = await Article.findOne({ _id: req.body.id }).exec();

  if (!article) {
    return res
      .status(400)
      .json({ message: `Article ID ${req.params.id} not found!` });
  }

  res.json(article);
};

module.exports = {
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getArticle,
};
