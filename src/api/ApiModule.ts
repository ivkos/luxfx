import { Module } from "@nestjs/common"
import { ConfigurationModule } from "src/ConfigurationModule"
import { EffectsService } from "./EffectsService"
import { EffectsController } from "./EffectsController"
import { IndexController } from "./IndexController"
import { StripModule } from "../strip/StripModule"
import { EffectsModule } from "../effects/EffectsModule"

@Module({
    imports: [
        ConfigurationModule,
        StripModule,
        EffectsModule,
    ],
    providers: [
        EffectsService,
    ],
    controllers: [
        IndexController,
        EffectsController,
    ],
})
export class ApiModule {}
