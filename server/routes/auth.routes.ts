import { Request, Response, Router } from 'express';
import { httpGet, httpPost, httpPut } from '../http_service/http_service';

const authRouter = Router();

authRouter.get('/get-currencies', async (req: Request, res: Response) => {
  let result = await httpGet(req.path, req.headers);
  let status_code = result['statusCode'];
  delete result.statusCode;
  return res.status(status_code).json(result);
});

authRouter.post('/signup', async (req: Request, res: Response) => {
  let result = await httpPost(req.path, req.body, req.headers);
  let status_code = result['statusCode'];
  delete result.statusCode;
  return res.status(status_code).json(result);
});

authRouter.post('/auth/login', async (req: Request, res: Response) => {
  let result = await httpPost(req.path, req.body, req.headers);
  let status_code = result['statusCode'];
  delete result.statusCode;
  return res.status(status_code).json(result);
});

authRouter.post(
  '/auth/forget-password',
  async (req: Request, res: Response) => {
    let result = await httpPost(req.path, req.body, req.headers);
    let status_code = result['statusCode'];
    delete result.statusCode;
    return res.status(status_code).json(result);
  }
);

authRouter.put('/auth/reset-password', async (req: Request, res: Response) => {
  let result = await httpPut(req.path, req.body, req.headers);
  let status_code = result['statusCode'];
  delete result.statusCode;
  return res.status(status_code).json(result);
});

authRouter.post(
  '/auth/init-email-verification',
  async (req: Request, res: Response) => {
    let result = await httpPost(req.path, req.body, req.headers);
    let status_code = result['statusCode'];
    delete result.statusCode;
    return res.status(status_code).json(result);
  }
);

authRouter.put(
  '/auth/email-verification',
  async (req: Request, res: Response) => {
    let result = await httpPut(req.path, req.body, req.headers);
    let status_code = result['statusCode'];
    delete result.statusCode;
    return res.status(status_code).json(result);
  }
);

authRouter.post('/auth/verify-tfa', async (req: Request, res: Response) => {
  let result = await httpPost(req.path, req.body, req.headers);
  let status_code = result['statusCode'];
  delete result.statusCode;
  return res.status(status_code).json(result);
});

authRouter.post('/check-username', async (req: Request, res: Response) => {
  let result = await httpPost(req.path, req.body, req.headers);
  let status_code = result['statusCode'];
  delete result.statusCode;
  return res.status(status_code).json(result);
});

authRouter.get('/get-balance', async (req: Request, res: Response) => {
  let result = await httpGet(req.path, req.headers);
  let status_code = result['statusCode'];
  delete result.statusCode;
  return res.status(status_code).json(result);
});

export default authRouter;
