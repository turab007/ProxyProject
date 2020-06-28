import { Request, Response } from 'express';
import { CrudController } from '../CrudController';
import { Proxy, ProxyInterface, UpdateDB, UpdateDBInterface, UrlTest, urlTestInterface } from '../../lib'
import * as cheerio from 'cheerio';
import * as request from 'request-promise-native';
import * as ProxyLists from 'proxy-lists';
import { updateDB } from '../../lib/config/database';
const axios = require('axios').default;
import * as ping from 'ping';


export class ProxyController extends CrudController {

    public create(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
        const params: ProxyInterface = req.body;
        Proxy.create<Proxy>(params)
            .then((proxy: Proxy) => res.status(201).json(proxy))
            .catch((err: Error) => res.status(500).json(err));
    }

    public read(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {

        Proxy.findAll<Proxy>({}).then((proxy: Array<Proxy>) => {
            res.json(proxy)
        })


    }

    public async refresh(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
        let update = await UpdateDB.findByPk(1, { raw: true });
        let difference = 600000;
        if (update)
            difference = Date.now() - update!.last_updated
        console.log(difference)
        if (difference >= 600000) {
            let url1 = 'https://free-proxy-list.net/';
            let url2 = 'https://www.netzwelt.de/proxy/index.html';
            const apiUrl = `https://proxy11.com/api/proxy.json?key=MTQwNw.Xu0Mag.2wmeed0XUYidIwawxvTOAOBe5G0`;

            axios
                .get(apiUrl)
                .then((a) => {
                    // console.log(">>>>>>>>>>", a.data);
                    let proxies = a.data.data;
                    proxies.forEach(async proxy => {
                        let obj: ProxyInterface = {
                            ip: proxy.ip,
                            port: proxy.port,
                            code: proxy.country_code,
                            provider: 'proxy11.com',
                            https: 'http',
                            basicFunctionality: false,
                            testDate: null

                        }
                        await Proxy.create(obj);
                    });
                    // res.send(a.data.data);
                })
                .catch(() => { });

            let p1 = await this.getData(url1);
            let $ = cheerio.load(p1);

            let result = $(".table-responsive > table.table-striped > tbody > tr").map((i, element) => ({
                ip: $(element).find('td:nth-of-type(1)').text().trim()
                , port: $(element).find('td:nth-of-type(2)').text().trim()
                , code: $(element).find('td:nth-of-type(3)').text().trim()
                , country: $(element).find('td:nth-of-type(4)').text().trim()
                , https: $(element).find('td:nth-of-type(7)').text().trim()
                , provider: 'free-proxy-list.net'
            })).get()
            let params: ProxyInterface[] = result;
            result.forEach(async element => {
                let a = await Proxy.findByPk(element.ip)
                if (!a) {
                    let resp = await Proxy.create(element)
                }
                else {
                    await a.changed('updatedAt', true)

                }
            })

            let p2 = await this.getData(url2);
            $ = cheerio.load(p2)

            result = $("div.tblc > table > tbody > tr").map((i, element) => ({

                ip: $(element).find('td:nth-of-type(1)').text().trim()
                , port: $(element).find('td:nth-of-type(2)').text().trim()
                , code: $(element).find('td:nth-of-type(3)').text().trim()
                , country: $(element).find('td:nth-of-type(3)').text().trim()
                , https: $(element).find('td:nth-of-type(5)').text().trim()
                , provider: 'netzwelt.de'
            })).get()
            params = result;
            console.log(result)
            result.forEach(async element => {
                let a = await Proxy.findByPk(element.ip, { raw: true })
                if (!a) {
                    let resp = await Proxy.create(element)
                    // console.log('this is resp ', resp);
                }
                else {
                    Proxy.update<Proxy>({ port: a.port }, {
                        where: {
                            ip: a.ip
                        }
                    })
                    console.log('updating updatedAt')

                }
            })
            console.log('size is ', params.length);

            ProxyLists.getProxies({
                // options
                countries: ['us'],
                sourcesWhiteList: ['proxy-list-org', 'xroxy']
            })
                .on('data', function (proxies) {
                    // Received some proxies.
                    proxies.forEach(async element => {
                        let a = await Proxy.findByPk(element.ipAddress)
                        if (!a) {
                            let obj: ProxyInterface = {
                                ip: element.ipAddress,
                                port: element.port,
                                code: element.country,
                                provider: element.source,
                                basicFunctionality: false,
                                testDate: null,
                                https: 'http'
                            }
                            await Proxy.create(obj).catch((err) => {
                                console.log('Error ', err);
                            });

                        }
                        else {

                        }
                    });
                    console.log('got some proxies');
                    console.log(proxies);
                })
                .on('error', function (error) {
                    // Some error has occurred.
                    console.log('error!', error);
                })
                .once('end', function () {
                    // Done getting proxiesN.
                    UpdateDB.findByPk(1).then(updated => {
                        console.log('updated', updated);
                        // let temp:UpdateDBInterface=updated;
                        UpdateDB.update({ 'last_updated': Date.now() }, {
                            where: {
                                id: 1
                            }
                        })
                        if (updated) {
                            updated.set({ 'last_updated': Date.now() }
                            )
                        }
                        else {
                            UpdateDB.create({ last_updated: Date.now() })
                        }
                    })
                    res.sendStatus(200);
                    console.log('end!');
                });
        }
        else {
            res.status(406).send({
                message: 'Updated less than 10 mins ago'
            });
        }
    }

    public async checkBasicFunctionality(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
        console.log('Inside the basic tests')

        let proxies: Proxy[] = await Proxy.findAll<Proxy>({ raw: true });
        proxies.forEach(proxy => {
            ping.promise.probe(proxy.ip).then(res => {
                Proxy.update<Proxy>({ basicFunctionality: res.alive, testDate: Date.now() }, {
                    where: {
                        ip: proxy.ip
                    }
                })
                // console.log('response ',res);
                if (res.alive) {
                    console.log('I am alive', res.host);
                }
                else {
                    console.log('I am dead', res.host);
                }
            }).catch(err => {
                console.log('I have error ', err)
            })

        });
        res.sendStatus(200);

        // res.sendStatus(200);
    }


    public async performTest(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
        const url: string = req.body.url;
        const ip: string = req.body.ip;

        let proxy = await Proxy.findByPk(ip, { raw: true })
        console.log('Inside');
        if (proxy) {
            axios
                .get(url, {
                    proxy: {
                        host: proxy.ip,
                        port: proxy.port,
                    },
                })
                .then(async(response) => {
                    let test = await UrlTest.findOne({ where: { ip: proxy.ip, url: url } });
                    if (!test) {

                        console.log("hello");
                        let urlTest: urlTestInterface = {
                            ip: proxy.ip,
                            url: url,
                            pass: true,
                            testDate: Date.now()
                        }
                         UrlTest.create(urlTest).then(resp => {
                            console.log('Done');
                            res.send("Hello World!");
                        });
                    }
                    else {
                        let urlTest: urlTestInterface = {
                            ip: proxy.ip,
                            url: url,
                            pass: true,
                            testDate: Date.now()
                        }
                         await UrlTest.update(urlTest, { where: { ip: proxy.ip, url: url } })
                            console.log('updated');
                            res.send(200);
                        
                    }
                })
                .catch(async(error) => {
                    let test = await UrlTest.findOne({ where: { ip: proxy.ip, url: url } });
                    if (!test) {

                        let urlTest: urlTestInterface = {
                            ip: proxy.ip,
                            url: url,
                            pass: false,
                            testDate: Date.now()
                        }
                        UrlTest.create(urlTest).then(resp => {
                            console.log("Heavy Error");
                            res.send("Hello World!");
                        });
                    }
                    else {
                       await UrlTest.update(UrlTest, { where: { ip: proxy.ip, url: url } })
                            console.log('updated');
                            res.send(200);
                    }
                });
            // res.send("Hello World!");



        }
        else {
            res.send('IP address not found');
        }
    }

    public async getData(proxy: string) {
        const options = {
            url: proxy,
            method: 'GET',
        }

        return await request.get(options);

        request.get(options).then((html) => {


        });

    }

    public update(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
        const params: ProxyInterface = req.body.obj;
        const ip: string = req.body.ip;
        Proxy.update<Proxy>(params, {
            where: {
                ip: ip
            }
        })
            .then((proxy) => res.sendStatus(200))
            .catch((err: Error) => res.status(500).json(err));
    }

    public delete(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
        Proxy.destroy({
            where: {
                ip: req.body.ip
            }
        }).then((resp) => {
            if (resp)
                res.status(200).json(resp);
            else
                res.sendStatus(404);
        })
    }
    public async getTests(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
        let ip = req.params.ip;
        console.log('This is the ip', ip);
        let proxy = await Proxy.findByPk(ip);
        if (proxy) {
            let tests = await UrlTest.findAll({ where: { ip: ip } });
            res.json(tests);

        }
        else {
            res.send({ message: 'IP does not exists' });
        }
        // Proxy.destroy({
        //     where: {
        //         ip: req.body.ip
        //     }
        // }).then((resp) => {
        //     if (resp)
        //         res.status(200).json(resp);
        //     else
        //         res.sendStatus(404);
        // })

        res.sendStatus(200);
    }

}