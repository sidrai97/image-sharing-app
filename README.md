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

### The Backend

#### Development

In order to run local developments, the following packages are needed:
- [serverless](https://github.com/serverless/serverless)
- [serverless-offline](https://github.com/dherault/serverless-offline)
- [serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local)
- [serverless-s3-local](https://github.com/ar90n/serverless-s3-local)

**Dependency Installation**

The Serverless Framework will need us to configure access to AWS. This can be accomplished by running

`serverless config credentials --provider aws --key KEY --secret SECRET`

>Where KEY and SECRET are our AWS Key and secret key. We are not deploying to AWS, but the serverless plugin needs this configuration to exist in order to work correctly.

```bash
npm install -g serverless
npm install -g serverless-offline
serverless plugin install --name serverless-dynamodb-local
serverless plugin install --name serverless-s3-local
```

**Run serverless offline**

```bash
cd backend
npm i
export IS_OFFLINE=true
serverless offline --httpPort 3050 --printOutput
```
Once the serverless application is running open [Postman](https://www.postman.com) and test the requests, see configuration below.

On a separate terminal run the following command which will start a dynamoDb and s3 instance locally:
```bash
cd backend
serverless dynamodb install
serverless dynamodb start &
serverless s3 create
serverless s3 start &
```

#### Deployment

To deploy an application run the following commands:

```bash
cd backend
export NODE_OPTIONS=--max_old_space_size=8192
npm install
serverless deploy -v
```


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