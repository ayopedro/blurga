const { Router } = require("express");
const path = require("path");
const router = Router();

router.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to Blurga</h1>
    <p>A blogging API - An AltSchool Assessment Project</p>
    <p>For Details, visit the <a href="https://github.com/ayopedro/blurga">repository</a></p>
    `);
});

module.exports = router;
