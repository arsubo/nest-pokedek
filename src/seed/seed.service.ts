import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {
  

  constructor(
    @InjectModel(Pokemon.name) 
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
    ){}

 
  async executeSeed() {
    //borra arreglo de pokemons
    await this.pokemonModel.deleteMany({}); // delete * from pokemons;
     
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon/?limit=650');
    /*
    //forma primera de hacer inserciones masivas
    const insertPromiseArray =[];
    data.results.forEach(async ({name, url}) => {
      const segments = url.split('/');
      const no  : number = +segments[segments.length - 2];       
      //arreglo de promesas para insertar directa
      insertPromiseArray.push(this.pokemonModel.create({name, no}));
    });
    await Promise.all(insertPromiseArray); //espera hasta que todas las promesas se resuelvan
    */

    //forma segunda de hacer inserciones masivas
    const  pokemonToInsert: {name: string, no: number}[]  = [];
    data.results.forEach(async ({name, url}) => {
      const segments = url.split('/');
      const no  : number = +segments[segments.length - 2];       
      //arreglo de registros para insertar directa
      pokemonToInsert.push({name, no});
    });
    await this.pokemonModel.insertMany(pokemonToInsert); //insert into pokemons values ....;

    return 'Seed executed';
  }   
}
