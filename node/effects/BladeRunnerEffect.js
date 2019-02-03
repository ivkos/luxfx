const chroma = require("chroma-js")

class BladeRunnerEffect {
    constructor(options) {
        this.options = Object.assign({
            rate: 30,
            mode: "rgb",
            inverseColors: false,
            reverseDirection: false,
        }, options)
    }

    start() {
        const cyan = chroma("cyan").darken(1)
        const magenta = chroma("magenta")

        const sourceColors = this.options.inverseColors ?
            [cyan, magenta, cyan] :
            [magenta, cyan, magenta]

        const colors = chroma
            .scale(sourceColors)
            .mode(this.options.mode)
            .colors(this.pixelCount, "num")

        const slideColors = this.options.reverseDirection ?
            () => colors.push(colors.shift()) :
            () => colors.unshift(colors.pop())

        this._interval = setInterval(() => {
            slideColors()

            this.strip.render(Uint32Array.from(colors))
        }, 1000 / this.options.rate)
    }

    stop() {
        clearInterval(this._interval)
    }

    init(strip, pixelCount) {
        this.strip = strip
        this.pixelCount = pixelCount
    }
}

module.exports = {
    BladeRunnerEffect
}