import { Logger, transports } from "winston"
const wcf = require("winston-console-formatter")

const logger = new Logger({
    level: 'info',
})

const { formatter, timestamp } = wcf()

logger.add(transports.Console, {
    formatter,
    timestamp,
})

export default logger