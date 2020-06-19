import { Request, Response } from 'express';
import { CrudController } from '../CrudController';
import { Proxy, ProxyInterface } from '../../lib'

export class ProxyController extends CrudController {

    public create(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
        const params: ProxyInterface = req.body;
        Proxy.create<Proxy>(params)
            .then((proxy: Proxy) => res.status(201).json(proxy))
            .catch((err: Error) => res.status(500).json(err));
    }

    public read(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
        Proxy.findAll<Proxy>({}).then((proxy: Array<Proxy>) => {
            res.json(proxy)
        })
    }

    public update(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
        const params: ProxyInterface = req.body.obj;
        const id: string = req.body.id;
        Proxy.update<Proxy>(params, {
            where: {
                id: id
            }
        })
            .then((proxy) => res.sendStatus(200))
            .catch((err: Error) => res.status(500).json(err));
    }

    public delete(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
        Proxy.destroy({
            where: {
                id: req.body.id
            }
        }).then((resp) => {
            if (resp)
                res.status(200).json(resp);
            else
                res.sendStatus(404);
        })
    }
}