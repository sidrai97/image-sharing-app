# image-sharing-app
Serverless Image Sharing App using Angular, Aws Lamda and Dynamo DB

## Functionality of the application

- [x] **A user needs to authenticate in order to use an application home**
- [x] **The application allows users to create tags.**
- [x] **The application allows users to upload/update/delete images.**
- [x] **The application displays images/tags for all users and user can filter to view only the ones created by the user.**

The application consists of a frontend and backend.

### Frontend

The `image-sharing-app-ui` folder contains a web application using Angular that can use the API developed in the project.
This frontend works with the serverless application.

### Backend
The `backend` folder contains a serverless application that uses the [serverless framework](https://github.com/serverless)

- The code is split into multiple layers separating business logic from I/O related code.
- Code is implemented using async/await and Promises without using callbacks.

#### Authentication

Authentication in this application, is done through [Auth0](https://auth0.com/), Which uses asymmetrically encrypted JWT tokens.

- https://auth0.com/blog/navigating-rs256-and-jwks/


## Usage

### The Frontend

To run a client application run the following commands:

```bash
cd image-sharing-app-ui
npm install
npm run start
```


## Best practices applied

- All resources in the application are defined in the serverless.yml file.
- Each function has its own set of permissions.
- Application has sufficient monitoring.
- HTTP requests are validated.

## Postman debugging API

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project with name `Image-Sharing-App.postman_collection.json`. Import this collection json to POSTMAN to test the API.