class RainbowEffect {
    constructor(options) {
        this.options = Object.assign({
            rate: 30
        }, options)
    }

    start() {
        const pixelData = new Uint32Array(this.pixelCount)

        let offset = 0

        this._interval = setInterval(() => {
            for (let i = 0; i < this.pixelCount; i++) {
                pixelData[i] = this.wheel((offset + i) & 255)
            }

            this.strip.render(pixelData)

            offset = (offset + 1) % 256
        }, 1000 / this.options.rate)
    }

    stop() {
        clearInterval(this._interval)
    }

    init(strip, pixelCount) {
        this.strip = strip
        this.pixelCount = pixelCount
    }

    wheel(pos) {
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

    color(r, g, b) {
        return (r << 16) | (g << 8) | b
    }
}

module.exports = {
    RainbowEffect
}