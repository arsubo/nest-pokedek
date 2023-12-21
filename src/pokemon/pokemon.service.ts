import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Pokemon } from './entities/pokemon.entity';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  private defaultLimit : number;

  constructor(
    @InjectModel(Pokemon.name) 
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
    ) 
    {
    
      this.defaultLimit = configService.get<number>('defaultLimit')
     
    }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {      
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }

  }

  findAll(paginatioDto: PaginationDto) {
    
    const {limit = this.defaultLimit, offset = 0} = paginatioDto;
    
    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
          no: 1,
        })
    .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    //por ID
    if(!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    //MongoID
    if(!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);    
    }

    //Name
    if(!pokemon) { 
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()});
    }

    //si no existe del todo
    if(!pokemon) throw new NotFoundException(`Pokemon with ID, Name or no "${term}", not found `);

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, {new: true});
      return {...pokemon.toJSON(), ...updatePokemonDto};
    }catch(error) {
      this.handleException(error);
    }
 

  }

  async remove(id: string) {    
    //const result = await this.pokemonModel.findByIdAndDelete(id);
    const result = await this.pokemonModel.deleteOne({_id: id});
    if(result.deletedCount === 0)
      throw new BadRequestException(`Pokemon with id "${id}", not found`); 

    return result;
  }


  private  handleException(error: any){
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists in db ${ JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't update Pokemon - Check server logs`);
  }
}
