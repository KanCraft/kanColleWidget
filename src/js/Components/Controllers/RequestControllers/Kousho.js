/**
 * 工廠のAPIが叩かれようとするときに発動するやつ
 */

import {Logger} from "chomex";
const logger = new Logger();
/**
 * 建造のやつ
 */
export function onCreateShipCompleted(detail) {
    logger.info("ここやな", detail);
}
