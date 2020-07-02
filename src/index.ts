import { NestFactory } from "@nestjs/core"
import { ApplicationModule } from "./ApplicationModule"
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule)
    app.enableCors()

    const config = app.get(ConfigService)
    await app.listen(config.get("PORT"))
}

bootstrap()
