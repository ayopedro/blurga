const User = require("../models/User");

const paginatedResult = (model) => {
  return async (req, res, next) => {
    const { limit, page, author, tags, title, state } = req.query;
    const user = req.user;

    let defaultLimit = 20;
    let defaultPage = 1;

    if (!isNaN(Number(limit)) && Number(limit) > 0)
      defaultLimit = Number(limit);

    const totalPages = Math.floor(model / Number(limit));

    if (!isNaN(Number(page)) && Number(page) <= totalPages)
      defaultPage = Number(page);

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = defaultPage * defaultLimit;

    const result = {};

    if (endIndex < model.length) {
      result.next = {
        page: defaultPage + 1,
        limit: Number(limit),
      };
    }

    if (startIndex > 0) {
      result.previous = {
        page: defaultPage - 1,
        limit: Number(limit),
      };
    }

    try {
      if (user) {
        const foundUser = await User.findOne({ user }).exec();
        const userArticles = foundUser.articles;

        result.results = await model.find({ _id: userArticles }).exec();

      } else {
        result.results = await model
          .find({ $or: [{ author }, { tags }, { title }, { state }] })
          .limit(defaultLimit)
          .skip(startIndex)
          .exec();
      }
      res.paginatedResult = result;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};

module.exports = paginatedResult;
