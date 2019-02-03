const _ = require("lodash")

class SolidColorStripesEffect {
    constructor(options) {
        this.options = Object.assign({
            colors: [0xFF0000, 0x00FF00, 0x0000FF],
            reverse: false,
        }, options)
    }

    start() {
        const stripes = this.options.reverse ? 
            Array.from(this.options.colors).reverse() :
            this.options.colors

        const pixels = _(Array(this.pixelCount))
            .chunk(this.pixelCount / stripes.length)
            .slice(0, stripes.length)
            .map((s, i) => _.fill(s, stripes[i]))
            .flatten()
            .value()

        this.strip.render(Uint32Array.from(pixels))
    }

    stop() {}

    init(strip, pixelCount) {
        this.strip = strip
        this.pixelCount = pixelCount
    }
}

module.exports = {
    SolidColorStripesEffect
}