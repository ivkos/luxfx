import { Injectable, NotFoundException, NotImplementedException, OnModuleInit } from "@nestjs/common"
import { Action, Effect, EffectId } from "../effects/Effect"
import { ModuleRef } from "@nestjs/core"
import { EnabledEffects } from "../effects/EnabledEffects"
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EffectsService implements OnModuleInit {
    private effects: { [key: string]: Effect }
    private currentEffect: Effect

    constructor(private readonly config: ConfigService,
                private readonly moduleRef: ModuleRef) {}

    onModuleInit() {
        this.effects = Object.fromEntries(EnabledEffects.map(clazz => {
            const instance = this.moduleRef.get(clazz, { strict: false })
            instance.initializeDefaultOptions()
            return [instance.getId(), instance]
        }))

        this.currentEffect = this.findById(this.config.get("DEFAULT_EFFECT"))
        this.currentEffect.start()
    }

    findById(id: EffectId): Effect {
        const result = this.effects[id]
        if (result === undefined) throw new NotFoundException(`Effect '${id}' not found`)
        return result
    }

    findAllEffectIds(): EffectId[] {
        return Object.keys(this.effects)
    }

    findAll(): Effect[] {
        return Object.values(this.effects)
    }

    getCurrentEffect() {
        return this.currentEffect
    }

    async setCurrentEffect(effectId: EffectId): Promise<Effect> {
        const oldEffect = this.currentEffect
        if (oldEffect) await oldEffect.stop()

        const newEffect = this.findById(effectId)
        await newEffect.start()

        this.currentEffect = newEffect
        return this.currentEffect
    }

    setCurrentEffectOptions(options: object) {
        return this.currentEffect.setOptions(options)
    }

    async executeCurrentEffectAction(action: Action) {
        switch (action) {
            case Action.START:
                return this.currentEffect.start()

            case Action.STOP:
                return this.currentEffect.stop()

            case Action.RESET:
                throw new NotImplementedException("Reset is not implemented") // TODO Implement

            default:
                throw new Error(`Unknown action: ${action}`)
        }
    }
}