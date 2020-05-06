import { Controller, Get, Head } from "@nestjs/common"

@Controller("/")
export class IndexController {
    @Get("/")
    async getIndex() {
        return {}
    }

    @Head("/")
    async getHead() {
        return {}
    }
}