const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const Authrouter = require('./src/auth/auth.router');
const UserRouter = require('./src/user/user.router');
const sgMail = require('@sendgrid/mail');




const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Kapusta API',
      version: '1.0.0',
      description:
        "Kapusta  API his is a budget planning API application made with Express and documented with Swagger",
    },
    
  },
  apis: [
      'index.js',
      'src/user/user.router.js',
      'src/auth/auth.router.js',
    ],
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log(swaggerDocs);


dotenv.config();

const PORT = process.env.PORT || 8080;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
start();

function start() {
  const app = initServer();
  connectMiddlewares(app);
  declarateRouters(app);
  connectToDb();
  listen(app);
}
function initServer() {
  return express();
}
function connectMiddlewares(app) {
  app.use(express.json());
  app.use(cors());
  app.use('/images', express.static('public/images/'));
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs)); 
}

function declarateRouters(app) {
  app.use('/user', UserRouter);
  app.use('/auth', Authrouter);
}

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connection successful');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
function listen(app) {
  app.listen(PORT, () => {
    console.log('Server is listening on port', PORT);
  });
}
