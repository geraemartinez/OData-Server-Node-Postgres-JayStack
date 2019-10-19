import * as express from 'express';
import { Router, Request, Response } from 'express';

class IndexController {

  public path = '/index';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getIndex);
    //this.router.post(this.path, this.createAPost);
  }


  getIndex = (request: express.Request, response: express.Response,next:express.NextFunction) => {
    response.render('index', { title: 'Hola' });
  }

}


export default IndexController;
