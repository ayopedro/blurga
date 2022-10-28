const Article = require("../models/Article");

const getArticles = async (req, res) => {
  const articles = await Article.find();
  res.status(200).json(articles);
};

const addArticle = async (req, res) => {
  const { title, description, tags, author, body } = req.body;

  const newArticle = await Article.create({
    title,
    description,
    tags,
    author,
    body,
  });

  if (!newArticle.firstname || !newArticle.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required" });
  }

  data.setArticles([...data.articles, newArticle]);
  res.status(201).json(data.articles);
};

const updateArticle = (req, res) => {
  const article = data.articles.find(
    (article) => article.id === parseInt(req.body.id)
  );
  if (!article) {
    return res
      .status(400)
      .json({ message: `article ID ${req.body.id} not found!` });
  }

  if (req.body.firstname) {
    article.firstname = req.body.firstname;
  }

  if (req.body.lastname) {
    article.lastname = req.body.lastname;
  }

  const filteredArray = data.articles.filter(
    (article) => article.id !== parseInt(req.body.id)
  );
  const unsortedArray = [...filteredArray, article];
  data.setarticles(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  res.json(data.articles);
};

const deleteArticle = (req, res) => {
  const article = data.articles.find(
    (article) => article.id === parseInt(req.body.id)
  );
  if (!article) {
    return res
      .status(400)
      .json({ message: `article ID ${req.body.id} not found!` });
  }
  const filteredArray = data.articles.filter(
    (article) => article.id !== parseInt(req.body.id)
  );

  data.setarticles([...filteredArray]);
  res.json(data.articles);
};

const getArticle = (req, res) => {
  const article = data.articles.find(
    (article) => article.id === parseInt(req.params.id)
  );
  if (!article) {
    return res
      .status(400)
      .json({ message: `article ID ${req.params.id} not found!` });
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
