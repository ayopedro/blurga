require('dotenv').config()

const DATABASE_URI = process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URI : process.env.DATABASE_URI

module.exports = DATABASE_URI;