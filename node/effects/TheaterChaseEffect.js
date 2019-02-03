const range = require("lodash/range")

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

class TheaterChaseEffect {
    constructor(options) {
        this.options = Object.assign({
            rate: 10,
            color: 0xFFEE88,
            step: 5,
        }, options)
    }

    async start() {
        const pixelData = new Uint32Array(this.pixelCount)

        this._shouldStop = false
        while(!this._shouldStop) {
            for (let q of range(this.options.step)) {
                for (let i of range(0, this.pixelCount, this.options.step)) {
                    pixelData[i + q] = this.options.color
                }

                this.strip.render(pixelData)
                await sleep(1000 / this.options.rate)

                for (let i of range(0, this.pixelCount, this.options.step)) {
                    pixelData[i + q] = 0
                }
            }
        }
    }

    stop() {
        this._shouldStop = true
    }

    init(strip, pixelCount) {
        this.strip = strip
        this.pixelCount = pixelCount
    }
}

module.exports = {
    TheaterChaseEffect
}