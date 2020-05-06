import { Strip } from "../../strip/Strip"
import { ChangedOption, Effect } from "../Effect"
import { EffectOptions, NumberDescriptor, PropertyType } from "../EffectOptionsPropertyDescriptor"
import { Injectable } from "@nestjs/common"


export interface RainbowEffectOptions extends EffectOptions {
    rate: NumberDescriptor,
}

@Injectable()
export class RainbowEffect extends Effect<RainbowEffectOptions> {
    private interval?: NodeJS.Timeout
    readonly options: RainbowEffectOptions = {
        rate: { type: PropertyType.NUMBER, name: "Rate", defaultValue: 30, min: 1, max: 60 },
    }
    private pixelData: Uint32Array
    private offset: number

    constructor(private readonly strip: Strip) {
        super()
    }

    getName(): string {
        return "Rainbow"
    }

    async start() {
        this.pixelData = new Uint32Array(this.strip.ledCount)
        this.offset = 0
        this.startTimer(this.pixelData, this.offset)
    }

    async stop() {
        this.stopTimer()
    }


    protected onChangeOptions(changedOptions: { [P in keyof RainbowEffectOptions]?: ChangedOption<RainbowEffectOptions, P> }) {
        if ("rate" in changedOptions) {
            this.stopTimer()
            this.startTimer(this.pixelData, this.offset)
        }
    }

    private startTimer(pixelData: Uint32Array, offset: number) {
        this.interval = setInterval(() => {
            for (let i = 0; i < this.strip.ledCount; i++) {
                pixelData[i] = this.wheel((offset + i) & 255)
            }

            this.strip.render(pixelData)

            offset = (offset + 1) % 256
        }, 1000 / this.options.rate.value)
    }

    private stopTimer() {
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
