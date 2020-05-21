# Dev Campers APP by Brad Traversy

## Docs

[PostMan Docs ](https://documenter.getpostman.com/view/8762260/Szt7BBFE?version=latest)
[Docgen](public/index.html)

## Workflow:

- [x] Specs [Link](Specs.md)

  - [x] Routing Structure

- [ ] Setup

  - [x] Setup GIT
  - [x] Setup Express
  - [x] Setup DotENV
  - [x] Add Dev and Prod Scripts in Pckg.json

- [ ] Basic Routing
  - [x] Setup Express Routes and Routes Dir
  - [x] create routes dir
  - [x] setup express router and mount to server
  - [x] create controllers dir
  - [x] add methods to routes on controller file
  - [x] mount to express router

## Misc

### HTTP Request Methods (REST)

1. GET
2. POST
3. PUT
4. DELETE

##### Resful API Standard

- GET /todos --> get todos
- GET /todos/1 --> get todo of id 1
- POST /todos --> add todos
- POST /todos/1 --> add todo of id 1
- DELETE /todos/1 --> remove todo of id 1

#### Route Structure

/api/v1/bootcamps

### Important HTTP Status Code

- 1.xx -> Informational
- 2.xx -> Success

- 200 -> success
- 201 -> Created and Successfull
- 204 -> No Content (when deleting)

- 300 -> redirection
- 304 -> Not modified

- 4.xx -> Client Error
- 400 -> Bad Request (give what was needed)
- 401 -> Unauthorized
- 404 -> Non Found

- 5.xx -> Server error
- 500 -> Internal Server Error
