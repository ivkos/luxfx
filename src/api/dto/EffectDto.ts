import { Effect, EffectId } from "../../effects/Effect"

export interface EffectDto {
    id: EffectId,
    name: string
}

export namespace EffectDto {
    export function fromEffect(effect: Effect) {
        return {
            id: effect.getId(),
            name: effect.getName(),
            options: effect.options,
        }
    }
}