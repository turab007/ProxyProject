
import express from 'express';
import { PORT } from './config/constants';
import { proxyRouter } from './routes';

const app = express();
app.use(express.json());

app.use('/proxy', proxyRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});