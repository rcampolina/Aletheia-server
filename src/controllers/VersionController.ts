import { Request, Response } from 'express';

export default class VersionController {
  index(request: Request, response: Response) {
    response.json({version: '1.0.0'})
  }
}