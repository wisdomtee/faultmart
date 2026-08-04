import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();

// Allow more listeners as the application grows
eventEmitter.setMaxListeners(50);

export default eventEmitter;