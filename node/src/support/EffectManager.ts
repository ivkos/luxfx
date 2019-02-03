import { Effect } from "./types/Effect"
import { Strip } from "./types/Strip"
import * as path from "path"


const EFFECTS_DIR = path.join(__dirname, "..", "effects")

export class EffectManager {
    constructor(private readonly strip: Strip) { }

    async resolveEffect(effectName: string, options?: object): Promise<Effect> {
        let m = require(path.join(EFFECTS_DIR, effectName))

        const effectClass = m[effectName] || m.default
        if (!effectClass) throw new Error("Could not get effect class")

        const effectInstance: Effect = new effectClass(this.strip, options)

        return effectInstance
    }
}