import * as express from 'express';
import { Router, Request, Response } from 'express';

const router: Router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


export default router;
