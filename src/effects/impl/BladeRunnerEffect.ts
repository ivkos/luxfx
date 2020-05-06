import { ChangedOption, Effect } from "../Effect"
import { Strip } from "../../strip/Strip"
import * as chroma from "chroma-js"
import {
    ColorDescriptor,
    EffectOptions,
    NumberDescriptor,
    PropertyType,
    ToggleDescriptor,
} from "../EffectOptionsPropertyDescriptor"
import { Injectable } from "@nestjs/common"
import * as _ from "lodash"

export interface BladeRunnerEffectOptions extends EffectOptions {
    rate: NumberDescriptor

    color1: ColorDescriptor,
    color2: ColorDescriptor,

    inverseColors: ToggleDescriptor
    reverseDirection: ToggleDescriptor
}

@Injectable()
export class BladeRunnerEffect extends Effect<BladeRunnerEffectOptions> {
    private interval?: NodeJS.Timeout
    readonly options: BladeRunnerEffectOptions = {
        rate: { type: PropertyType.NUMBER, name: "Rate", defaultValue: 30, min: 1, max: 60 },

        color1: { type: PropertyType.COLOR, name: "Color 1", defaultValue: "#0000ff" },
        color2: { type: PropertyType.COLOR, name: "Color 2", defaultValue: "#ff0000" },

        inverseColors: { type: PropertyType.TOGGLE, name: "Inverse colors", defaultValue: false },
        reverseDirection: { type: PropertyType.TOGGLE, name: "Reverse direction", defaultValue: false },
    }
    private colors: number[]

    constructor(private readonly strip: Strip) {
        super()
    }

    getName(): string {
        return "Blade Runner"
    }

    protected onChangeOptions(changedOptions: { [P in keyof BladeRunnerEffectOptions]?: ChangedOption<BladeRunnerEffectOptions, P> }) {
        if ("rate" in changedOptions) {
            this.stop()
            this.startTimer()
        }

        if (_.intersection(Object.keys(changedOptions), ["color1", "color2", "inverseColors", "reverseDirection"]).length !== 0) {
            this.initializeColors()
        }
    }

    async start() {
        this.initializeColors()
        this.startTimer()
    }

    async stop() {
        clearInterval(this.interval as any)
    }

    private startTimer() {
        this.interval = setInterval(() => {
            this.slideColors()
            this.strip.render(Uint32Array.from(this.colors))
        }, 1000 / this.options.rate.value)
    }

    private initializeColors() {
        const color1 = chroma(this.options.color1.value)
        const color2 = chroma(this.options.color2.value)

        const sourceColors = this.options.inverseColors ?
            [color1, color2, color1] :
            [color2, color1, color2]

        this.colors = chroma
            .scale(sourceColors)
            .mode("rgb")
            .colors(this.strip.ledCount, "num" as any)
    }

    private slideColors() {
        if (this.options.reverseDirection) {
            this.colors.push(this.colors.shift())
        } else {
            this.colors.unshift(this.colors.pop())
        }
    }
}
