
import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

const router: Router = Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({ ok: true, message: 'Welcome to Api Server!', code: HttpStatus.OK });
});

export default router;