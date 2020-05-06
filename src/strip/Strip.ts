export abstract class Strip {
    readonly ledCount: number
    abstract render(pixelData: Uint32Array): Promise<void>
    abstract setBrightness(value: number): Promise<void>
    abstract reset(): Promise<void>
}
