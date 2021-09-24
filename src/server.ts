import express from 'express';
import cors from 'cors';
import routes from './routes';
import SentryConfig from './services/sentryConfig';

SentryConfig();
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3333);