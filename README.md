# blurga

This is an api for a blog app - An AltSchool Assessment

---

## Requirements

1. User should be able to register
2. User should be able to login with Passport using JWT and expires after one hour
3. Logged in and not logged in users should be able to get a list of published blogs created
4. Logged in and not logged in users should be able to to get a published blog
5. Logged in users should be able to create a blog.
6. When a blog is created, it is in draft state
7. The owner of the blog should be able to update the state of the blog to published
8. The owner of a blog should be able to edit the blog in draft or published state
9. The owner of the blog should be able to delete the blog in draft or published state
10. The owner of the blog should be able to get a list of their blogs.
11. The endpoint should be paginated
12. It should be filterable by state
13. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
14. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated, default it to 20 blogs per page.
15. It should also be searchable by author, title and tags.
16. It should also be orderable by read_count, reading_time and timestamp
17. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
18. An algorithm for calculating the reading_time of the blog.
19. Write tests for all endpoints

---

## Setup

- Install NodeJS, mongodb
- pull this repo
- update env with yourFile.env

---

## Base URL

- https://long-rose-trout-tie.cyclic.app

## Models

---

### User

| field     | data_type | constraints |
| --------- | --------- | ----------- |
| id        | string    | required    |
| firstname | string    | required    |
| lastname  | string    | required    |
| email     | string    | required    |
| password  | string    | required    |

### Article

| field        | data_type | constraints                                             |
| ------------ | --------- | ------------------------------------------------------- |
| title        | string    | required                                                |
| description  | string    | required                                                |
| body         | string    | required                                                |
| state        | string    | required, default:'draft', enum: ['draft', 'published'] |
| tags         | array     | optional                                                |
| read_Count   | Number    | optional                                                |
| reading_time | Number    |                                                         |
| author       | string    | required                                                |

## APIs

---

### Register a User

- Route: /auth/register
- Method: POST
- Body:

```
{
  "email": "test@mail.com",
  "password": "test123",
  "firstname": "jon",
  "lastname": "doe",
  "role": "admin editor user"
}
```

- Responses

Success

```
{
    message: `New user with email address test@mail.com created`,
    user: {
        "email": "test@mail.com",
        "password": *hashedPassword*,
        "first_name": "jon",
        "last_name": "doe",
        "roles": ["admin", "editor", "user"],
        "articles": []
    }
}
```

---

### Login User

- Route: /auth/login
- Method: POST
- Body:

```
{
  "password": "test123",
  "email": "test@mail.com",
}
```

- Responses

Success

```
{
    accessToken: 'sjlkafjkldsfjsddslbdcuibacawcaw.weragfvwca3qd'
}
```

---

### Create a Blog

- Route: /articles
- Method: POST
- Header
  - Authorization: Bearer {token}
- Body:

```
{
  article: {
  title: "Nigeria: A land of opportunities",
  author: "Jon Doe"
  description: "The story of the giant of Africa",
  tags: "Story, History",
  body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
}
```

- Responses

Success

```
{
    created_at: Sun Nov 06 2022 08:35:00 GMT+0100,
    status: true,
    result: {
       title: "Nigeria: A land of opportunities",
       description: "The story of the giant of Africa",
       tags: ['Story', 'History'],
       body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
       state: "draft",
       read_Count:0,
       reading_time:1,
       author: "Jon Doe"
}
```

---

### Get All Published Blogs

- Route: /articles
- Method: GET
- Header
  - Authorization: Bearer {token}
- Query params:
  - page (default: 1)
  - limit (default: 20)
  - author
  - tags
  - title
- Responses

Success

```
{
    results: [{
       title: "Nigeria: A land of opportunities",
       description: "The story of the giant of Africa",
       tags: ['Story', 'History'],
       body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
       state: "draft",
       read_Count:0,
       reading_time:1,
       author: "Jon Doe"
  }]
}
```

---

### Get a blog

- Route: /articles/:articleID
- Method: GET
- Header
  - Authorization: Bearer {token}
- Responses

Success

```
{
    status: true,
    result: {
        title: "Nigeria: A land of opportunities",
       description: "The story of the giant of Africa",
       tags: ['Story', 'History'],
       body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
       state: "draft",
       read_Count:0,
       reading_time:1,
       author: "Jon Doe"
  }
}
```

---

### Update a blog

- Route: /articles/articleID
- Method: PUT
- Header
  - Authorization: Bearer {token}
- Body:

```
{
  title: "Nigeria: The giant of Africa",
}
```

- Responses

Success

```
{
    created_at: Sun Nov 06 2022 08:35:00 GMT+0100,
    status: true,
    result: {title: "Nigeria: The giant of Africa",
       description: "The story of the giant of Africa",
       tags: ['Story', 'History'],
       body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
       state: "draft",
       read_Count:0,
       reading_time:1,
       author: "Jon Doe"}
}
```

---

### Update the state

- Route: /articles/articleID
- Method: PATCH
- Header
  - Authorization: Bearer {token}
- Body:

```
{
  state: "published",
}
```

- Responses

Success

```
{
    created_at: Sun Nov 06 2022 08:35:00 GMT+0100,
    status: true,
    article: {
       {title: "Nigeria: The giant of Africa",
       description: "The story of the giant of Africa",
       tags: ['Story', 'History'],
       body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
       state: "published",
       read_Count:0,
       reading_time:1,
       author: "Jon Doe"}
      }
}
```

---

### Delete a blog

- Route: /articles
- Method: DELETE
- Header
  - Authorization: Bearer {token}
- Body:

```
{
  _id: "635fabb65b42d30512068ca3",
}
```

- Responses

Success

```
{
    result: [],
}
```

---

...

## Contributor

- Ayotunde Pedro
