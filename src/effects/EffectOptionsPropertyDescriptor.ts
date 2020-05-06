export type EffectOptionsPropertyDescriptor = NumberDescriptor | ToggleDescriptor | ColorDescriptor
export type EffectOptions = { [key: string]: EffectOptionsPropertyDescriptor }

export enum PropertyType {
    COLOR = "COLOR",
    NUMBER = "NUMBER",
    TOGGLE = "TOGGLE",
}

export interface Descriptor<T> {
    type: PropertyType,
    name: string,
    description?: string,
    defaultValue?: T,
    value?: T,
}

export interface NumberDescriptor extends Descriptor<number> {
    type: PropertyType.NUMBER,
    min?: number,
    max?: number,
}

export interface ToggleDescriptor extends Descriptor<boolean> {
    type: PropertyType.TOGGLE,
}

export interface ColorDescriptor extends Descriptor<string> {
    type: PropertyType.COLOR,
}
