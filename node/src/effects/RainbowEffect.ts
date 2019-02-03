import { Strip } from "../support/types/Strip"
import { Effect } from "../support/types/Effect"


export interface RainbowEffectOptions {
    rate: number,
}

export class RainbowEffect implements Effect {
    private interval?: NodeJS.Timeout
    private readonly options: RainbowEffectOptions = {
        rate: 30
    }

    constructor(private readonly strip: Strip, options?: RainbowEffectOptions) {
        Object.assign(this.options, options)
    }

    async start() {
        const pixelData = new Uint32Array(this.strip.ledCount)

        let offset = 0

        this.interval = setInterval(() => {
            for (let i = 0; i < this.strip.ledCount; i++) {
                pixelData[i] = this.wheel((offset + i) & 255)
            }

            this.strip.render(pixelData)

            offset = (offset + 1) % 256
        }, 1000 / this.options.rate)
    }

    async stop() {
        clearInterval(this.interval as any)
    }

    private wheel(pos: number): number {
        if (pos < 85) {
            return this.color(pos * 3, 255 - pos * 3, 0)
        } else if (pos < 170) {
            pos -= 85
            return this.color(255 - pos * 3, 0, pos * 3)
        } else {
            pos -= 170
            return this.color(0, pos * 3, 255 - pos * 3)
        }
    }

    private color(r: number, g: number, b: number): number {
        return (r << 16) | (g << 8) | b
    }
}
