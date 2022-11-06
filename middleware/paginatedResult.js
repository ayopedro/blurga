const User = require("../models/User");

const paginatedResult = (model) => {
  return async (req, res, next) => {
    const { author, tags, title } = req.query;
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const user = req.user;

    let defaultLimit;
    let defaultPage;

    if (limit && limit > 0) {
      defaultLimit = limit;
    } else {
      defaultLimit = 20;
    }

    const totalPages = Math.floor(
      (await model.countDocuments().exec()) / limit
    );

    if (page && page <= totalPages) {
      defaultPage = page;
    } else {
      defaultPage = 1;
    }

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = defaultPage * defaultLimit;

    const result = {};

    if (endIndex < (await model.countDocuments().exec())) {
      result.next = {
        page: defaultPage + 1,
        limit: defaultLimit,
      };
    }

    if (startIndex > 0) {
      result.previous = {
        page: defaultPage - 1,
        limit: defaultLimit,
      };
    }

    try {
      if (user) {
        const foundUser = await User.findOne({ user }).exec();
        const userArticles = foundUser.articles;

        result.results = await model
          .find({ _id: userArticles })
          .limit(defaultLimit)
          .skip(startIndex)
          .exec();
      } else if (author || tags || title) {
        let regex = new RegExp(`^[${author || tags || title}0-9._-]+$`, "ig");

        result.results = await model
          .find({
            $and: [
              { state: "published" },
              {
                $or: [
                  { author: { $regex: regex } },
                  { tags: { $regex: regex } },
                  { title: { $regex: regex } },
                ],
              },
            ],
          })
          .limit(defaultLimit)
          .skip(startIndex)
          .exec();
      } else {
        result.results = await model
          .find({ state: "published" })
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
