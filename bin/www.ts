/**
 * Module dependencies.
 */


import Application from '../app';
import IndexController from './../routes/IndexController'

const app = new Application(
  [
    new IndexController(),
  ],
  5000,
);
 
app.listen();



