import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
    providers:[AxiosAdapter],
    exports:[AxiosAdapter]  //para que se pueda usar en otros modulos, se exporta el modulo de la clase AxiosAdapter, para que se pueda usar en otros modulos, se exporta el modulo de la clase AxiosAdapter,
})
export class CommonModule {}
