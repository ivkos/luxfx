import { BladeRunnerEffect } from "./impl/BladeRunnerEffect"
import { RainbowEffect } from "./impl/RainbowEffect"
import { SolidColorEffect } from "./impl/SolidColorEffect"
import { TheaterChaseEffect } from "./impl/TheaterChaseEffect"
import { Type } from "@nestjs/common"
import { Effect } from "./Effect"

export const EnabledEffects: Type<Effect>[] = [
    BladeRunnerEffect,
    RainbowEffect,
    SolidColorEffect,
    TheaterChaseEffect,
]
