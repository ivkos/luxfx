import { ChangedOption, Effect } from "../Effect"
import { Strip } from "../../strip/Strip"
import { ColorDescriptor, EffectOptions, PropertyType } from "../EffectOptionsPropertyDescriptor"
import { Color } from "../../utils/Color"
import { Injectable } from "@nestjs/common"


export interface SolidColorEffectOptions extends EffectOptions {
    color: ColorDescriptor
}

@Injectable()
export class SolidColorEffect extends Effect<SolidColorEffectOptions> {
    readonly options: SolidColorEffectOptions = {
        color: { type: PropertyType.COLOR, name: "Color", defaultValue: "#FFEE88" },
    }

    constructor(private readonly strip: Strip) {
        super()
    }

    getName(): string {
        return "Solid Color"
    }

    async start() {
        const pixelData = new Uint32Array(this.strip.ledCount)

        const color = Color.asNumber(this.options.color.value)

        for (let i = 0; i < this.strip.ledCount; i++) {
            pixelData[i] = color
        }

        this.strip.render(pixelData)
    }

    async stop() { }


    protected onChangeOptions(changedOptions: { [P in keyof SolidColorEffectOptions]?: ChangedOption<SolidColorEffectOptions, P> }) {
        if ("color" in changedOptions) {
            this.start()
        }
    }
}
