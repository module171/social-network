import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookierSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
import compression from 'compression';
import { config } from '@root/config';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import applicationRoutes from '@root/routes';
import CustomError, { IErrorResponse } from '@global/helpers/error-handler';
import Logger from 'bunyan';
import { SocketIOPostHandler } from '@socket/post';

const SERVER_PORT = 5000;
const log: Logger = config.createLogger('server');

export class ChattyServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  public start(): void {
    this.securityMiddleWare(this.app);
    this.standarMiddleWare(this.app);
    this.routeMiddleWare(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }
  private securityMiddleWare(app: Application): void {
    app.use(
      cookierSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development'
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }
  private standarMiddleWare(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routeMiddleWare(app: Application): void {
    applicationRoutes(app);
  }
  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });
    app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      log.error(error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const SocketIO: Server = await this.createSocketIO(httpServer);
      this.startHtppServer(httpServer);
      this.socketIOConnections(SocketIO);
    } catch (error) {
      log.error(error);
    }
  }
  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
    const publicClient = createClient({ url: config.REDIS_HOST });
    const subClient = publicClient.duplicate();
    await Promise.all([publicClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(publicClient, subClient));
    return io;
  }
  private startHtppServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });
  }
  private socketIOConnections(io: Server): void {
    const postSocketHandler : SocketIOPostHandler = new SocketIOPostHandler(io);

    postSocketHandler.listen();
  }
}
