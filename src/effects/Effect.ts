import { EffectOptions, NumberDescriptor, PropertyType } from "./EffectOptionsPropertyDescriptor"
import { Injectable } from "@nestjs/common"
import { Color } from "../utils/Color"

export type EffectId = string
export type ChangedOption<O extends EffectOptions, P extends keyof O> = { oldValue: O[P]["value"], newValue: O[P]["value"] }


@Injectable()
export abstract class Effect<O extends EffectOptions = {}> {
    abstract readonly options: O

    abstract start(): Promise<void>

    abstract stop(): Promise<void>

    abstract getName(): string

    getId(): EffectId {
        return this.constructor.name
    }

    setOptions(newOptions: { [P in keyof O]?: O[P]["value"] }): O {
        const changedOptions = {}

        for (const [k, v] of Object.entries(newOptions)) {
            if (this.options.hasOwnProperty(k)) {
                switch (this.options[k].type) {
                    case PropertyType.NUMBER:
                        const min = (this.options[k] as NumberDescriptor).min
                        const max = (this.options[k] as NumberDescriptor).max
                        if (min !== undefined && v < min) throw new Error(`Number '${v}' is less than min '${min}'`)
                        if (max !== undefined && v > max) throw new Error(`Number '${v}' is greater than max '${max}'`)
                        break
                    case PropertyType.COLOR:
                        Color.validate(v as string)
                        break
                }

                changedOptions[k] = { oldValue: this.options[k].value, newValue: v }
                this.options[k].value = v
            }
        }

        this.onChangeOptions(changedOptions)

        return this.options
    }

    initializeDefaultOptions() {
        for (const opt of Object.values(this.options)) {
            opt.value = opt.defaultValue
        }
    }

    protected onChangeOptions(changedOptions: { [P in keyof O]?: ChangedOption<O, P> }) { }
}

export enum Action {
    START,
    STOP,
    RESET,
}