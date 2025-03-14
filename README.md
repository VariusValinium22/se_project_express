## Project Title: se_project_express

**GitHub Page:** [se_project_express](https://github.com/VariusValinium22/se_project_express)

**Link to the fully deployed app:** [https://wtwr.flazzard.com/](https://wtwr.flazzard.com/)

**Backend GitHub Page:** [https://github.com/VariusValinium22/se_project_express](https://github.com/VariusValinium22/se_project_express)

**Frontend GitHub Page:** [https://variusvalinium22.github.io/se_project_react/](https://variusvalinium22.github.io/se_project_react/)

### Running the Project

- `npm run start` — to launch the server
- `npm run dev` — to launch the server with the hot reload feature

### Project Information

**Project Name:**
se_project_express

**Description:**
This is a backend project built in association with the frontend project **_se_project_react_** for the WTWR application.

Sprint 12:

- utilized databases with MongoDB, set up security and testing, and deployed the web Application onto a remote machine.
- created a server and routes for an API.
- implemented user authorization.
- separated out the ERROR logic to its own utils/errors.js file for better maintainability.
- tested the application with Postman Test Suite to ensure all API Requests work properly.
- used ESLint to ensure code standards like removing unused else blocks.

There are two models, controllers and routes:

- users.js API Endpoints:
  - GET /users
  - GET /user/:userId
  - POST /users
- clothesItems.js API Endpoints:
  - GET /items
  - POST /items
  - DELETE /items/:id
  - PUT /items:id/likes
  - DELETE /items:id/likes

Sprint 13:

- Validation: expanded the userSchema to include email and password. Enabled validator.
  -Created login controller
- added /signin and /signup routes and controllers
- created middlewares/auth.js file for Authorization
- hide the password with .select('+password')
- added the user NOT to be able to delete items added by other users in deleteItems

Added API Endpoints:

- users.js API Endpoints:
  - GET /me (changed from GET /users)
  - PATCH /me
- clothingItems.js API Endpoints:
  - POST /
  - DELETE /:itemId

**Technologies:** Node.js; Express.js; Mongoose; MongoDB; ESLint; Validator; Custom Middleware; Nodemon; Postman; Github Actions; CORS;

Domain Names:
https://wtwr.flazzard.com
https://www.wtwr.flazzard.com
https://api.wtwr.flazzard.com
