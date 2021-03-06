
import express from 'express';
import { PORT } from './config/constants';
import { proxyRouter } from './routes';
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());

app.use('/proxy', proxyRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});