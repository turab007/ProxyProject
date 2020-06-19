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
        throw new Error("Method not implemented.");
    }

    public delete(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
        console.log('I am trying')
        Proxy.destroy({
            where: {
                id: req.body.id
            } 
        }).then((resp)=>{
            res.status(200).json(resp);
        })
    }
}