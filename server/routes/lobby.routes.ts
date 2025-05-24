import { Request, Response, Router } from 'express';
import { httpGet, httpPost } from '../http_service/http_service';

const lobbyRouter = Router();

lobbyRouter.get(
  '/get-featured-third-party-games',
  async (req: Request, res: Response) => {
    let result = await httpGet(req.path, req.headers);
    let status_code = result['statusCode'];
    delete result.statusCode;
    return res.status(status_code).json(result);
  }
);

lobbyRouter.get('/fetch-all-games', async (req: Request, res: Response) => {
  let result = await httpGet(req.path, req.headers);
  let status_code = result['statusCode'];
  delete result.statusCode;
  return res.status(status_code).json(result);
});

lobbyRouter.post(
  '/fetch-all-third-party-games',
  async (req: Request, res: Response) => {
    let result = await httpPost(req.path, req.body, req.headers);
    let status_code = result['statusCode'];
    delete result.statusCode;
    return res.status(status_code).json(result);
  }
);

export default lobbyRouter;
