import { Effect } from "../support/types/Effect"
import { Strip } from "../support/types/Strip"
import * as _ from "lodash"


export interface SolidColorStripesEffectOptions {
    colors: number[],
    reverse: boolean,
}

export class SolidColorStripesEffect implements Effect {
    private readonly options: SolidColorStripesEffectOptions = {
        colors: [0xFF0000, 0x00FF00, 0x0000FF],
        reverse: false,
    }

    constructor(private readonly strip: Strip, options?: SolidColorStripesEffectOptions) {
        Object.assign(this.options, options)
    }

    async start() {
        const stripes = this.options.reverse ?
            Array.from(this.options.colors).reverse() :
            this.options.colors

        const pixels = _(Array(this.strip.ledCount))
            .chunk(this.strip.ledCount / stripes.length)
            .slice(0, stripes.length)
            .map((s, i) => _.fill(s, stripes[i]))
            .flatten()
            .value()

        this.strip.render(Uint32Array.from(pixels))
    }

    async stop() { }
}
