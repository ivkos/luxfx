import { Effect } from "../support/types/Effect"
import { Strip } from "../support/types/Strip"
import * as chroma from "chroma-js"


export interface BladeRunnerEffectOptions {
    rate: number
    mode: chroma.InterpolationMode
    inverseColors: boolean
    reverseDirection: boolean
}

export class BladeRunnerEffect implements Effect {
    private interval?: NodeJS.Timeout

    private readonly options: BladeRunnerEffectOptions = {
        rate: 30,
        mode: "rgb",
        inverseColors: false,
        reverseDirection: false,
    }

    constructor(private readonly strip: Strip, options?: BladeRunnerEffectOptions) {
        Object.assign(this.options, options)
    }

    async start() {
        const cyan = chroma("cyan").darken(1)
        const magenta = chroma("magenta")

        const sourceColors = this.options.inverseColors ?
            [cyan, magenta, cyan] :
            [magenta, cyan, magenta]

        const colors = chroma
            .scale(sourceColors)
            .mode(this.options.mode)
            .colors(this.strip.ledCount, "num" as any)

        const slideColors = this.options.reverseDirection ?
            () => colors.push(colors.shift()) :
            () => colors.unshift(colors.pop())

        this.interval = setInterval(() => {
            slideColors()

            this.strip.render(Uint32Array.from(colors))
        }, 1000 / this.options.rate)
    }

    async stop() {
        clearInterval(this.interval as any)
    }
}
