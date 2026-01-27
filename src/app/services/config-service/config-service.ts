import { Injectable } from '@angular/core';
import {EnvironmentalValuesInterface} from '../../interfaces/environmental-values-interface';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
    #config!: EnvironmentalValuesInterface;

    setConfig(config: EnvironmentalValuesInterface) { this.#config = config; }
    getConfig(): EnvironmentalValuesInterface { return this.#config; }
}
