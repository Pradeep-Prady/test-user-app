import { Request, Response, Router } from 'express';
import { httpDelete, httpGet, httpPost } from '../http_service/http_service';

const profileRouter = Router();

profileRouter.get('/profile', async (req: Request, res: Response) => {
  let result = await httpGet(req.path, req.headers);
  let status_code = result['statusCode'];
  delete result.statusCode;
  return res.status(status_code).json(result);
});

profileRouter.put(
  '/profile/update-profile',
  async (req: Request, res: Response) => {
    let result = await httpPost(req.path, req.body, req.headers);
    let status_code = result['statusCode'];
    delete result.statusCode;
    return res.status(status_code).json(result);
  }
);

profileRouter.put(
  '/profile/change-password',
  async (req: Request, res: Response) => {
    let result = await httpPost(req.path, req.body, req.headers);
    let status_code = result['statusCode'];
    delete result.statusCode;
    return res.status(status_code).json(result);
  }
);

profileRouter.post(
  '/profile/generate-tfa-creds',
  async (req: Request, res: Response) => {
    let result = await httpPost(req.path, req.body, req.headers);
    let status_code = result['statusCode'];
    delete result.statusCode;
    return res.status(status_code).json(result);
  }
);

profileRouter.post(
  '/profile/verify-tfa',
  async (req: Request, res: Response) => {
    let result = await httpPost(req.path, req.body, req.headers);
    let status_code = result['statusCode'];
    delete result.statusCode;
    return res.status(status_code).json(result);
  }
);

profileRouter.delete(
  '/profile/disable-two-factor',
  async (req: Request, res: Response) => {
    let result = await httpDelete(req.path, req.headers);
    let status_code = result['statusCode'];
    delete result.statusCode;
    return res.status(status_code).json(result);
  }
);

profileRouter.post(
  'create-veriff-sessions',
  async (req: Request, res: Response) => {
    let result = await httpPost(req.path, req.body, req.headers);
    let status_code = result['statusCode'];
    delete result.statusCode;
    return res.status(status_code).json(result);
  }
);

export default profileRouter;
