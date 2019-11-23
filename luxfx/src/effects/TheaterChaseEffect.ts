import { Effect } from "../support/types/Effect"
import { Strip } from "../support/types/Strip"
import { range }  from "lodash"


export interface TheaterChaseEffectOptions {
    rate: number,
    color: number,
    step: number
}

export class TheaterChaseEffect implements Effect {
    private shouldStop?: boolean
    private readonly options: TheaterChaseEffectOptions = {
        rate: 10,
        color: 0xFFEE88,
        step: 5,
    }

    constructor(private readonly strip: Strip, options?: TheaterChaseEffectOptions) {
        this.options = Object.assign(this.options, options)
    }

    async start() {
        const pixelData = new Uint32Array(this.strip.ledCount)

        this.shouldStop = false
        while(!this.shouldStop) {
            for (let q of range(this.options.step)) {
                for (let i of range(0, this.strip.ledCount, this.options.step)) {
                    pixelData[i + q] = this.options.color
                }

                this.strip.render(pixelData)
                await TheaterChaseEffect.sleep(1000 / this.options.rate)

                for (let i of range(0, this.strip.ledCount, this.options.step)) {
                    pixelData[i + q] = 0
                }
            }
        }
    }

    async stop() {
        this.shouldStop = true
    }

    private static async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}
