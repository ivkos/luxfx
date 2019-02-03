import { Effect } from "../support/types/Effect"
import { Strip } from "../support/types/Strip"


export interface SolidColorEffectOptions {
    color: number
}

export class SolidColorEffect implements Effect {
    private readonly options: SolidColorEffectOptions = {
        color: 0xFFEE88
    }

    constructor(private readonly strip: Strip, options?: SolidColorEffectOptions) {
        Object.assign(this.options, options)
    }

    async start() {
        const pixelData = new Uint32Array(this.strip.ledCount)

        for (let i = 0; i < this.strip.ledCount; i++) {
            pixelData[i] = this.options.color
        }

        this.strip.render(pixelData)
    }

    async stop() { }
}
