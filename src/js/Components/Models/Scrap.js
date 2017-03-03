import {Model} from "chomex";

/**
 * ScrapBookアーカイブに使えるやつ
 */
class Scrap extends Model {
    static schema = {
        name:        Model.Types.string.isRequired,
        filename:    Model.Types.string.isRequired,
        url:         Model.Types.string.isRequired,
        description: Model.Types.string,
        created:     Model.Types.number.isRequired,
        updated:     Model.Types.number,
    }
    static template = {
        filename: () => `scrap-${Date.now()}`,
    }
    // TODO: chomex.Model.sequentialIDにバグがある
    // static nextID = Model.sequentialID;
}

export default Scrap;
