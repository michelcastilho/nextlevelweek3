import { Request, Response } from 'express';

import { getRepository  } from 'typeorm';

import Orphanage from '../models/Orphanage';

export default {

    async index(request: Request, response: Response) {

        const OrphanagesRepository = getRepository(Orphanage);

        const orphanages = await OrphanagesRepository.find();

        return response.json(orphanages);

    },

    async show(request: Request, response: Response) {

        const { id } = request.params;

        const OrphanagesRepository = getRepository(Orphanage);

        const orphanage = await OrphanagesRepository.findOneOrFail(id);

        return response.json(orphanage);

    },

    async create(request: Request, response: Response) { //USAR "async" SEMPRE QUE PRECISAR USAR AWAIT. QUERYS SÃO ASSÍNCRONAS!!

        console.log(request.body);
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

    const orphanage =  OrphanagesRepository.create({
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends
    });

    await OrphanagesRepository.save(orphanage);

    return response.status(201).json(orphanage); // STATUS 201 SIGNIFICA QUE A CRIAÇÃO FUNCIONOU

    }
}