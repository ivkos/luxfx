export interface Strip {
    readonly ledCount: number
    render(pixelData: Uint32Array): Promise<void>
    setBrightness(value: number): Promise<void>
    reset(): Promise<void>
}
