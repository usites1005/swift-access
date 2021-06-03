import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from 'morgan';
import helmet from 'helmet';
import config from './config/env';
import {
	converter,
	notFound,
	internal,
	errorHandler,
} from './middleware/error';
import v1Routes from './routes/index';

import cron from 'node-cron';
import EarningsController from './controllers/earnings';

cron.schedule('0 0 0 * * 1-5', () => {
	console.log('running a task every week day');
	EarningsController.cronJobReleaseROI();
});

const MONGODB = config.MONGODB;
const PORT = config.port;
const SERVER_URL = config.serverUrl;

const app: Application = express();

/**
 *  App Configuration
 */
// Setup Request logger
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

app.use(
	logger(logFormat, {
		skip: function (_req, res) {
			if (process.env.NODE_ENV === 'test') {
				return true;
			}

			return res.statusCode < 400;
		},
		stream: process.stderr,
	})
);

app.use(
	logger(logFormat, {
		skip: function (_req, res) {
			return res.statusCode >= 400;
		},
		stream: process.stdout,
	})
);

app.use(helmet());
app.use(
	cors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/', v1Routes);

// error handle middleware must be mounted after all the controller functions of your application have been mounted
app.use(notFound);
app.use(converter);
app.use(internal);
app.use(errorHandler);

mongoose
	.connect(MONGODB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		if (config.env !== 'test') {
			console.log('MongoDB connected successfully!');
		}
	})
	.catch((error) => {
		console.log(error);
	});

// open a port if the environment is not test
if (config.env !== 'test') {
	app.listen({ port: PORT }, () =>
		console.log(`🚀 Server ready at ${SERVER_URL}`)
	);
}

export default app;
