export namespace Color {
    export function validate(color: string) {
        if (color.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) === null) {
            throw new Error(`Invalid color: '${color}'`)
        }
    }

    export function asNumber(color: string) {
        validate(color)
        return parseInt(color.replace("#", ""), 16)
    }
}