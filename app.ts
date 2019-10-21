import express from 'express';
import * as path  from 'path';
import cookieParser from 'cookie-parser';
import logger  from 'morgan';

import IndexController from './routes/IndexController';
import { EcomServer } from "./server";
import { Router, Request, Response, NextFunction } from 'express';
import errorMiddleware from './middleware/error.middleware';

class Application  {

    public app: express.Application;
    public port: number;
    public oData: express.Router;


    constructor(controllers, port) {
        this.app = express();
        this.oData = EcomServer.create();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeODataController();
        //this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(logger('dev'));
        this.app.use(express.json());
        //this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    private initializeControllers(controllers) {
        controllers.forEach((controller) => {
          this.app.use('/', controller.router);
        });
    }

    public initializeODataController(){
        this.app.use('/oData', this.oData);
    }


    public listen() {
        this.app.listen(this.port, () => {
          console.log(`App listening on the port ${this.port}`);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
   
}
export default Application;

