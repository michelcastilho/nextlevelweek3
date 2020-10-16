import express from 'express';

import { getRepository  } from 'typeorm';

import Orphanage from './models/Orphanage';

import './database/connection';

const app = express();

app.use(express.json());

//app.get('/users', () => {
//   console.log('teste');
//});

//app.post('/users/:id', (request, response) => {
    //console.log(request.query);
    //console.log(request.params);
    //console.log(request.body);
    //return response.json( { message: 'teste' } );
//});

app.post('/orphanages', async (request, response) => { // USAR "async" SEMPRE QUE PRECISAR USAR AWAIT. QUERYS SÃO ASSÍNCRONAS!!

    console.log(request.body);

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
});

app.listen(3333);