const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Article = require("../models/Article");
const {
  usersInDb,
  createArticleObject,
  articlesInDb,
  initialUsers,
  initialArticles,
} = require("./testFunctions");

jest.setTimeout(50000);

const api = supertest(app);

let accessToken;

const loginUser = async (email) => {
  const response = await api.post("/auth/login").send({
    email,
    password: "test123",
  });

  accessToken = response.body.accessToken;
};

const createUser = async (user) => {
  const response = await api.post("/auth/register").send({
    firstname: user.first_name,
    lastname: user.last_name,
    email: user.email,
    role: user.role,
    password: user.password,
  });

  return response;
};


beforeAll(async () => {
  await User.deleteMany({});
  await Article.deleteMany({});

  const users = initialUsers();
  for (let i = 0; i < users.length; i++) {
    await createUser(users[i]);
  }

  const articles = initialArticles();
  for (let i = 0; i < articles.length; i++) {
    await Article.create(articles[i]);
  }
});

describe("Adding an article to the API", () => {
  it("Add article while authenticated", async () => {
    const email = "user1@mail.com";
    await loginUser(email);

    const articlesInDB = await articlesInDb();

    const response = await api
      .post("/articles")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(createArticleObject(`Article by ${email}`))
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("tags");
    expect(response.body).toHaveProperty("author");
    expect(response.body).toHaveProperty("read_count");
    expect(response.body).toHaveProperty("reading_time");
    expect(response.body).toHaveProperty("body");
    expect(response.body).toHaveProperty("state");
    expect(response.body.state).toBe("draft");

    const newArticlesInDB = await articlesInDb();
    expect(articlesInDB.length).toBe(newArticlesInDB.length - 1);
  });

  it("should not add an article if token is not provided", async () => {
    const initialArticlesInDb = await articlesInDb();

    const response = await api
      .post("/articles")
      .send(createArticleObject("Article by unauthenticated user"))
      .expect(401);

    expect(response.body.status).toBe(undefined);

    const newArticlesInDB = await articlesInDb();
    expect(initialArticlesInDb.length).toBe(newArticlesInDB.length);
  });
});

describe("GET all blogs", () => {
  it("unauthenticated users should be able to get a list of published blogs", async () => {
    const response = await api
      .get("/articles")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const stateOfArticle = Object.entries(response.body).map((article) => article.state);
    expect(stateOfArticle).not.toContain("draft");
  });

  it('returns a maximum of 20 blogs per page', async () => {
    const response = await api
      .get('/articles')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(Object.entries(response.body).length).toBeLessThanOrEqual(20)
  })

  it("Authenticated users should be able to get a list of published blogs", async () => {
    const email = "user1@mail.com";
    await loginUser(email);

    const response = await api
      .get("/articles")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const stateOfArticle = Object.entries(response.body).map((article) => article.state);
    expect(stateOfArticle).not.toContain("draft");
  });

  it("should return a single article in the DB requested by ID", async () => {
    const initialArticles = await articlesInDb();

    const articlesShown = initialArticles[0];

    const returnedArticle = await api
      .get(`/articles/${articlesShown._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedArticleShown = JSON.parse(JSON.stringify(articlesShown));

    expect(returnedArticle.body.title).toEqual(
      processedArticleShown.title
    );
    expect(returnedArticle.body.body).toEqual(processedArticleShown.body);
    expect(returnedArticle.body.tags).toEqual(processedArticleShown.tags);
    expect(returnedArticle.body._id).toEqual(processedArticleShown._id);
  });

  it("article requested should display the name of the author", async () => {
    const initialArticles = await articlesInDb();
    const users = await usersInDb();
    const user1 = users[0];

    const articlesToShow = initialArticles[0];

    const returnedArticle = await api
      .get(`/articles/${articlesToShow._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const authorOfArticle = returnedArticle.body.author;
    expect(authorOfArticle.username).toBe(user1.username);
    expect(authorOfArticle.id).toBe(user1.id);
  });
});

afterAll(async () => {
 mongoose.connection.close();
});
