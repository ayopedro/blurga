const User = require("../models/User");
const Article = require("../models/Article");

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const articlesInDb = async () => {
  const articles = await Article.find({});
  return articles.map((article) => article.toJSON());
};

const initialUsers = () => {
  return require("./dummy_DB/users.json");
};

const initialArticles = () => {
  return require("./dummy_DB/articles.json");
};

const createArticleObject = (title) => {
  return {
    title,
    description:
      "Suspendisse et condimentum libero",
    author: "Ayotunde",
    tags: "Nigerian lorem",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut rutrum ipsum, sit amet dapibus tellus. Aliquam et libero vitae nulla vulputate rhoncus. Nunc et justo sollicitudin, sagittis nisl ut, accumsan purus. Cras sapien felis, dictum in tristique in, aliquet in tortor. Phasellus tempus diam turpis, id placerat odio tempus a. Aenean viverra leo turpis, sed vestibulum eros fermentum a. Morbi dictum nunc nisi, vel volutpat lectus interdum id. Vivamus ut lorem vel arcu bibendum convallis quis sit amet ligula. In faucibus tincidunt lobortis. Duis elementum ac sem consectetur pellentesque. Sed commodo, nisl ac commodo lobortis, nisi nulla volutpat dui, id tincidunt lectus nunc eget ligula. Nullam vel scelerisque tellus. Praesent eu ex non augue interdum facilisis. Cras blandit urna at erat sollicitudin, vel molestie lectus auctor.",
  };
};

module.exports = {
  usersInDb,
  createArticleObject,
  articlesInDb,
  initialUsers,
  initialArticles,
};
