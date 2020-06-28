
import express, { Request, Response } from 'express';
import { proxyController } from '../../controllers';

export const router = express.Router({
    strict: true
});

router.post('/', (req: Request, res: Response) => {
    proxyController.create(req, res);
});

router.get('/', (req: Request, res: Response) => {
    proxyController.read(req, res);
});

router.patch('/', (req: Request, res: Response) => {
    proxyController.update(req, res);
});

router.get('/refresh', (req: Request, res: Response) => {
    proxyController.refresh(req, res);
});

router.get('/basicTest', (req: Request, res: Response) => {
    proxyController.checkBasicFunctionality(req, res);
});

router.post('/performTest', (req: Request, res: Response) => {
    proxyController.performTest(req, res);
});

router.get('/getTests/:ip', (req: Request, res: Response) => {
    proxyController.getTests(req, res);
});

router.delete('/', (req: Request, res: Response) => {
    proxyController.delete(req, res);
});