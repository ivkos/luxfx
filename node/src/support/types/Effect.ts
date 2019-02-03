import { Strip } from "./Strip"

export interface Effect {
	start(): Promise<void>;
	stop(): Promise<void>;
}
