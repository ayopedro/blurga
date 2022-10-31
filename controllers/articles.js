const Article = require("../models/Article");
const User = require("../models/User");

const getArticles = async (req, res) => {
  articles = res.paginatedResult;

  if (!articles) return res.status(204).json({ message: "No article found!" });
  res.status(200).json(articles);
};

const getAdminArticles = async (req, res) => {
  articles = res.paginatedResult;

  if (!articles)
    return res.status(204).json({ message: "No article found!" });

  res.status(200).json(articles); 
};

const addArticle = async (req, res) => {
  const { title, description, tags, author, body } = req.body;
  const user = req.user;

  const foundUser = await User.findOne({ user }).exec();

  const duplicate = await Article.findOne({ title }).exec();

  if (duplicate) {
    return res
      .status(400)
      .json({ message: `Article with title ${title} already exists!` });
  }

  const newArticle = await Article.create({
    title,
    description,
    tags,
    author: author.toLowerCase(),
    body,
  });

  if (!title || !description || !author || !body) {
    return res
      .status(400)
      .json({ message: "Title, Author, Description and Article body are required!" });
  }

  try {
    const result = await newArticle;
    foundUser.articles.push(result._id);
    await foundUser.save();

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateArticle = async (req, res) => {
  const user = req.user;
  const foundUser = await User.findOne({ user }).exec();

  if (!req.body?.id) {
    return res.status(400).json({ message: "ID is required!" });
  }

  const article = await Article.findOne({ _id: req.body.id }).exec();

  if (!article) {
    return res
      .status(204)
      .json({ message: `No article matches ID ${req.body.id}` });
  }

  if (req.body?.state && foundUser.roles.includes("admin")) {
    article.state = req.body.state;
  } else {
    return res.sendStatus(401);
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
  getAdminArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getArticle,
};
