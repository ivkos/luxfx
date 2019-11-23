import { Strip } from "../support/types/Strip";
import logger from "../util/Logger";
import * as dgram from "dgram"
import * as _ from "lodash"

const DEFAULT_PORT = 42170

export class LuxsrvStrip implements Strip {
    private isReset = false
    private brightnessScale = 255 / 255
    private readonly client: dgram.Socket;

    constructor(readonly ledCount: number,
                initialBrightness: number = 255,
                readonly address: string,
                readonly port: number = DEFAULT_PORT) {
        this.ledCount = Math.min(255, ledCount)
        this.brightnessScale = initialBrightness / 255
        this.client = dgram.createSocket("udp4")
    }

    async render(pixelData: Uint32Array): Promise<void> {
        if (this.isReset) {
            logger.warn("Tried to render(...) after reset")
            return
        }

        const preamble = [
            0x4C, // header
            0x58, // header
            0x00, // raw mode
            this.ledCount,
        ]

        const data = _(pixelData).map(pixel => [
            Math.floor(((pixel & 0x00FF00) >> 8) * this.brightnessScale),
            Math.floor(((pixel & 0xFF0000) >> 16) * this.brightnessScale),
            Math.floor((pixel & 0x0000FF) * this.brightnessScale),
        ]).flatten().value()

        const message = Buffer.from(preamble.concat(data))

        await new Promise((resolve, reject) => {
            this.client.send(message, this.port, this.address, (err, bytes) => {
                if (err) return reject(err)
                return resolve(bytes)
            })
        })
    }

    async setBrightness(value: number): Promise<void> {
        if (this.isReset) {
            logger.warn("Tried to setBrightness(...) after reset")
            return
        }

        this.brightnessScale = value / 255
    }

    async reset(): Promise<void> {
        await this.render(new Uint32Array(this.ledCount))

        this.isReset = true
    }
}