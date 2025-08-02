import pino from "pino";

const logger = pino({ browser: { asObject: true } });
const serverLogger = pino();

export { logger, serverLogger };
