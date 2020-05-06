import { ConfigurationModule } from "../config/ConfigurationModule"
import { Strip } from "./Strip"
import { Configuration } from "../config/Configuration"
import { LuxsrvStrip } from "./impl/LuxsrvStrip"
import { ConfigKey } from "../config/ConfigKey"
import { Module } from "@nestjs/common"

@Module({
    imports: [ConfigurationModule],
    providers: [
        {
            provide: Strip, inject: [Configuration], useFactory: config => new LuxsrvStrip(
                config.get(ConfigKey.PIXEL_COUNT),
                config.get(ConfigKey.DEFAULT_BRIGHTNESS),
                config.get(ConfigKey.LUXSRV_ADDRESS),
            ),
        },
    ],
    exports: [Strip],
})
export class StripModule {}