import { Request, Response } from 'express';

import { getRepository  } from 'typeorm';

import orphanageView from '../views/orphanages_view';

import Orphanage from '../models/Orphanage';

import * as Yup from 'yup'; // * as Objeto é utilizado para importar tudo de dentro de um arquivo quando o arquivo não possui return default

export default {

    async index(request: Request, response: Response) {

        const OrphanagesRepository = getRepository(Orphanage);

        const orphanages = await OrphanagesRepository.find({
            relations: ['images']
        });

        return response.json(orphanageView.renderMany(orphanages));

    },

    async show(request: Request, response: Response) {

        const { id } = request.params;

        const OrphanagesRepository = getRepository(Orphanage);

        const orphanage = await OrphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return response.json(orphanageView.render(orphanage));

    },

    async create(request: Request, response: Response) { //USAR "async" SEMPRE QUE PRECISAR USAR AWAIT. QUERYS SÃO ASSÍNCRONAS!!

        console.log(request.body);
        console.log(request.files);
    //console.log(request.query);
    //console.log(request.params);

    const {
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends
    } = request.body;

    const OrphanagesRepository = getRepository(Orphanage);

    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map(image => {
        return { path: image.filename }
    })

    const data = {
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends,
        images
    };

    const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        about: Yup.string().required().max(300),
        instructions: Yup.string().required(),
        opening_hours: Yup.string().required(),
        open_on_weekends: Yup.boolean().required(),
        images: Yup.array(
            Yup.object().shape({
                path: Yup.string().required()
            })
        )
    });

    await schema.validate(data, {
        abortEarly: false // garante que todos os erros sejam exibidos. True retorna apenas o primeiro erro e para
    })

    const orphanage =  OrphanagesRepository.create(data);

    await OrphanagesRepository.save(orphanage);

    return response.status(201).json(orphanage); // STATUS 201 SIGNIFICA QUE A CRIAÇÃO FUNCIONOU

    }
}