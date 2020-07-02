import { Strip } from "./Strip"
import { LuxsrvStrip } from "./impl/LuxsrvStrip"
import { Module } from "@nestjs/common"
import { ConfigurationModule } from "../ConfigurationModule";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [ConfigurationModule],
    providers: [
        {
            provide: Strip, inject: [ConfigService], useFactory: config => new LuxsrvStrip(
                config.get("PIXEL_COUNT"),
                config.get("DEFAULT_BRIGHTNESS"),
                config.get("LUXSRV_HOST"),
                config.get("LUXSRV_PORT"),
            ),
        },
    ],
    exports: [Strip],
})
export class StripModule {}