class SolidColorEffect {
    constructor(options) {
        this.options = Object.assign({
            color: 0xFFEE88
        }, options)
    }

    start() {
        const pixelData = new Uint32Array(this.pixelCount)

        for (let i = 0; i < this.pixelCount; i++) {
            pixelData[i] = this.options.color
        }

        this.strip.render(pixelData)
    }

    stop() {}

    init(strip, pixelCount) {
        this.strip = strip
        this.pixelCount = pixelCount
    }
}

module.exports = {
    SolidColorEffect
}