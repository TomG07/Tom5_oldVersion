export interface EventOptions {
    name: String,
    eventName: String,
    once: Boolean
}

export default class Event implements EventOptions {

    name: String
    eventName: String
    execute: Function
    once: Boolean

    constructor(options: EventOptions) {
        this.name = options.name,
        this.eventName = options.eventName,
        this.once = options.once
        this.execute = () => {}
    }
}