import * as express from 'express';
import authRouter from './routes/auth.routes';
import lobbyRouter from './routes/lobby.routes';
import profileRouter from './routes/profile.routes';

export default (app: express.Application) => {
  //auth routes
  app.use(authRouter);

  //lobby routes
  app.use(lobbyRouter);

  //profile routes
  app.use(profileRouter);
};
