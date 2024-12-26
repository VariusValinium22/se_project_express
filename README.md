# Project Title

A brief description of what this project does and who it's for# WTWR (What to Wear?): Back End
The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

## Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

### Project Information

**Project Name:** se_project_express

**Description:**
This is a backend project built in association with the frontend project **_se_project_react_**.
I've implemented a server and routes for an API. I've separated out the ERROR logic to its own utils/errors.js file for better maintainability. 

There are two models, controllers and routes:
- users.js API Endpoints:
  - GET /users
  - GET /user/:userId
  - POST /users
- clothesItems.js API Endpoints:
  - GET /items
  - POST /items
  - DELETE /items/:id
  - PUT /items/:id/likes
  - DELETE /items/:id/likes

**Technologies:** Node.js; Express.js; Mongoose; MongoDB; ESLint; Validator; Custom Middleware; Nodemon; Postman; Github Actions;

**GitHub Page:** [se_project_express](https://github.com/VariusValinium22/se_project_express)
