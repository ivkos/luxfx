import { Body, Controller, Get, Patch, Post } from "@nestjs/common"
import { EffectsService } from "./EffectsService"
import { EffectDto } from "./dto/EffectDto"
import { ActionDto } from "./dto/ActionDto"
import { SetCurrentEffectDto } from "./dto/SetCurrentEffectDto"


@Controller("/effects")
export class EffectsController {
    constructor(private readonly effectService: EffectsService) {}

    @Get("/")
    async getAllEffects(): Promise<EffectDto[]> {
        return (await this.effectService.findAll()).map(effect => EffectDto.fromEffect(effect))
    }

    @Get("/current")
    async getCurrent(): Promise<EffectDto> {
        const currentEffect = await this.effectService.getCurrentEffect()
        return EffectDto.fromEffect(currentEffect)
    }

    @Post("/current")
    async setCurrent(@Body() body: SetCurrentEffectDto) {
        const currentEffect = await this.effectService.setCurrentEffect(body.id)
        return EffectDto.fromEffect(currentEffect)
    }

    @Post("/current/action")
    async executeAction(@Body() dto: ActionDto) {
        await this.effectService.executeCurrentEffectAction(dto.action)
    }

    @Patch("/current")
    async patchEffectOptions(@Body() options: object) {
        return this.effectService.setCurrentEffectOptions(options)
    }
}
