import { Effect } from "../Effect"
import { Strip } from "../../strip/Strip"
import { range } from "lodash"
import {
    ColorDescriptor,
    EffectOptions,
    NumberDescriptor,
    PropertyType,
} from "../EffectOptionsPropertyDescriptor"
import { Color } from "../../utils/Color"
import { Injectable } from "@nestjs/common"


export interface TheaterChaseEffectOptions extends EffectOptions {
    rate: NumberDescriptor,
    color: ColorDescriptor,
    step: NumberDescriptor
}

@Injectable()
export class TheaterChaseEffect extends Effect<TheaterChaseEffectOptions> {
    private shouldStop?: boolean
    readonly options: TheaterChaseEffectOptions = {
        rate: { type: PropertyType.NUMBER, name: "Rate", defaultValue: 10, min: 1, max: 60 },
        color: { type: PropertyType.COLOR, name: "Color", defaultValue: "#FFEE88" },
        step: { type: PropertyType.NUMBER, name: "Step", defaultValue: 5, min: 1, max: 20 },
    }

    constructor(private readonly strip: Strip) {
        super()
    }

    getName(): string {
        return "Theater Chase"
    }

    async start() {
        const pixelData = new Uint32Array(this.strip.ledCount)
        const color = Color.asNumber(this.options.color.value)

        this.shouldStop = false
        while (!this.shouldStop) {
            for (let q of range(this.options.step.value)) {
                for (let i of range(0, this.strip.ledCount, this.options.step.value)) {
                    pixelData[i + q] = color
                }

                this.strip.render(pixelData)
                await TheaterChaseEffect.sleep(1000 / this.options.rate.value)

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
