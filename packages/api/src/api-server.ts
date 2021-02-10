import * as cors from 'cors';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import { PassportAuthenticator, Server, Errors } from 'typescript-rest';
import config from './lib/config';
import { sentryInit, Sentry } from './utils/sentry';
import { createTypeormConnection } from '@pdeals/db';
import * as myParser from 'body-parser';

export class ApiServer {
  public PORT: number = +config.port || 3000;

  private readonly app: express.Application;
  private server: http.Server = null;

  constructor() {
    this.app = express();

    sentryInit();
    this.config();

    this.app.use(Sentry.Handlers.requestHandler());

    Server.loadServices(this.app, 'controllers/*', __dirname);
    const swaggerFile = './dist/swagger.json';
    Server.swagger(this.app, { filePath: swaggerFile });

    // explorer
    const swaggerDocument = require('../' + swaggerFile);
    const options = {
      explorer: true,
    };
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

    //this.app.use('/queues', UI);
    // error reporting
    this.app.use(Sentry.Handlers.errorHandler());
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      let statusCode = 500;
      if (err instanceof Errors.HttpError) {
        statusCode = (err as Errors.HttpError).statusCode;
      }

      console.error(err);
      res.status(statusCode).send({
        error: {
          name: err.name,
          message: err.message,
        },
      });
    });
  }

  /**
   * Start the server
   */
  public async start() {
    return new Promise<any>(async (resolve, reject) => {
      const conn = await createTypeormConnection();
      console.log(`Connected to database. Connection: ${conn.name} / ${conn.options.database}`);

      this.server = this.app.listen(this.PORT, () => {
        /*if (err) {
                    return reject(err);
                }*/

        // TODO: replace with Morgan call
        // tslint:disable-next-line:no-console
        console.log(`Listening to http://127.0.0.1:${this.PORT}`);

        return resolve();
      });
    });
  }

  /**
   * Stop the server (if running).
   * @returns {Promise<boolean>}
   */
  public async stop(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.server) {
        this.server.close(() => {
          return resolve(true);
        });
      } else {
        return resolve(true);
      }
    });
  }

  /**
   * Configure the express app.
   */
  private config(): void {
    // Native Express configuration
    this.app.use(myParser.json({ limit: '200mb' }));
    this.app.use(myParser.urlencoded({ limit: '200mb', extended: true }));
    this.app.use(
      express.static(path.join(__dirname, 'public'), {
        maxAge: 31557600000,
      })
    );
    this.app.use('/v1/uploads', express.static(config.uploadsPath));
    this.app.use('/uploads', express.static(config.uploadsPath));

    this.app.use(cors());
    this.app.use(
      morgan('combined', {
        skip: function (req, res) {
          if (req.url == '/v2/general/live-status-check') {
            return true;
          } else {
            return false;
          }
        },
      })
    );
    this.configureAuthenticator();
  }

  private configureAuthenticator() {
    const JWT_SECRET: string = 'some-jwt-secret';
    const jwtConfig: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(JWT_SECRET),
    };
    const strategy = new Strategy(jwtConfig, (payload: any, done: (err: any, user: any) => void) => {
      done(null, payload);
    });
    const authenticator = new PassportAuthenticator(strategy, {
      deserializeUser: (user: string) => JSON.parse(user),
      serializeUser: (user: any) => {
        return JSON.stringify(user);
      },
    });
    Server.registerAuthenticator(authenticator);
    // Server.registerAuthenticator(authenticator, 'secondAuthenticator');
  }
}
