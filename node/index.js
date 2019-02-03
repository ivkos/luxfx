const logger = require("./logger")
const ws281x = require("rpi-ws281x-native")

// TODO Externalize config
const PIXEL_COUNT = 120
const DEFAULT_BRIGHTNESS = 255
const DEFAULT_EFFECT = "SolidColorEffect"

function resolveEffect(effectName, options) {
    let m

    try {
        m = require(`./effects/${effectName}`)
    } catch (err) {
        logger.error(`Could not resolve effect '${effectName}'`, err)
        return undefined
    }

    const effectClass = m[effectName] || m.default

    if (!effectClass) return undefined

    const effectInstance = new effectClass(options)
    effectInstance.init(ws281x, PIXEL_COUNT)

    return effectInstance
}


// Initialize
setInterval(() => {}, 60 * 60 * 1000)
ws281x.init(PIXEL_COUNT)
ws281x.setBrightness(DEFAULT_BRIGHTNESS)

let effect = resolveEffect(DEFAULT_EFFECT)
if (effect && effect.start) {
    effect.start()
} else {
    logger.error(`Could not resolve default effect '${DEFAULT_EFFECT}'`)
}

function shutdown() {
    logger.info("Shutting down...")

    if (effect && effect.stop) effect.stop()

    // override render() with noop
    ws281x.render = () => {
        logger.warn("Effect tried to render(...) after having its stop() called")
    }

    ws281x.reset()
    process.nextTick(() => process.exit(0))
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)