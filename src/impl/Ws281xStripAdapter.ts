import { Strip } from "../support/types/Strip";
import logger from "../util/Logger";
const ws281x = require("rpi-ws281x-native")

export class Ws281xStripAdapter implements Strip {
    private isReset = false

    constructor(readonly ledCount: number, initialBrightness: number = 255) {
        ws281x.init(ledCount)
        ws281x.setBrightness(initialBrightness)
    }

    async render(pixelData: Uint32Array): Promise<void> {
        if (this.isReset) {
            logger.warn("Tried to render(...) after reset")
            return
        }
        
        ws281x.render(pixelData)
    }

    async setBrightness(value: number): Promise<void> {
        if (this.isReset) {
            logger.warn("Tried to setBrightness(...) after reset")
            return
        }

        ws281x.setBrightness(value)
    }

    async reset(): Promise<void> {
        this.isReset = true
        ws281x.reset()
    }
}