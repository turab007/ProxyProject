import { Request, Response } from 'express';
import { CrudController } from '../CrudController';
import { Proxy, ProxyInterface } from '../../lib'
import * as cheerio from 'cheerio';
import * as request from 'request-promise-native';

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

    public async refresh(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
        res.json(await this.getData())
//   return await this.getData();

    }

    public getData() {
        console.log('inside get Data')
        const options = {
            url: 'https://free-proxy-list.net/',
            method: 'GET',
        }

        request.get(options).then((html) => {

            const $ = cheerio.load(html)

            const result = $(".table-responsive > table.table-striped > tbody > tr").map((i, element) => ({
                ip: $(element).find('td:nth-of-type(1)').text().trim()
                , port: $(element).find('td:nth-of-type(2)').text().trim()
                , code: $(element).find('td:nth-of-type(3)').text().trim()
                , country: $(element).find('td:nth-of-type(4)').text().trim()
                , https: $(element).find('td:nth-of-type(7)').text().trim()
                , provider: options.url
            })).get()
            const params: ProxyInterface[] = result;
            result.forEach(async element => {
                let a = await Proxy.findByPk(element.ip)
                if (!a) {
                    let resp = await Proxy.create(element)
                    // console.log('this is resp ', resp);
                }
                else {
                     await a.changed('updatedAt', true)

                }
            })
            console.log('size is ', params.length)
            return params;
        });

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