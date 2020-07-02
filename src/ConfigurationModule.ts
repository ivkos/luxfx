import { ConfigModule, ConfigService } from "@nestjs/config"
import { Module } from "@nestjs/common"

@Module({
    imports: [ConfigModule.forRoot({
        envFilePath: [".env", ".env.default"],
    })],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigurationModule {}