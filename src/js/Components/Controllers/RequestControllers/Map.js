import {Logger} from "chomex";
const logger = new Logger();

export function onMapPrepare(detail) {
    logger.info(detail);
}
