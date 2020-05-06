import { Module } from "@nestjs/common"
import { StripModule } from "../strip/StripModule"
import { EnabledEffects } from "./EnabledEffects"

@Module({
    imports: [StripModule],
    providers: [
        ...EnabledEffects,
    ],
    exports: [
        ...EnabledEffects,
    ],
})
export class EffectsModule {}
