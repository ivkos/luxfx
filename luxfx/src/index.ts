import logger from "./util/Logger"
import { Ws281xStripAdapter } from "./impl/Ws281xStripAdapter";
import { Strip } from "./support/types/Strip";
import { EffectManager } from "./support/EffectManager";
import { Effect } from "./support/types/Effect";


// TODO Externalize config
const PIXEL_COUNT = 120
const DEFAULT_BRIGHTNESS = 255
const DEFAULT_EFFECT = "SolidColorEffect"


// Initialize
setInterval(() => { }, 60 * 60 * 1000)
const strip: Strip = new Ws281xStripAdapter(PIXEL_COUNT, DEFAULT_BRIGHTNESS)
const effectManager = new EffectManager(strip)

let effect: Effect | undefined;

(async () => {
    try {
        effect = await effectManager.resolveEffect(DEFAULT_EFFECT)
        effect.start()
    } catch (err) {
        logger.error(`Could not resolve default effect '${DEFAULT_EFFECT}'`, err)
    }
})()

function shutdown() {
    logger.info("Shutting down...")

    if (effect && effect.stop) effect.stop()

    strip.reset()
    process.nextTick(() => process.exit(0))
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)