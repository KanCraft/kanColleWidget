import { Model, Types } from "chomex";

/**
 * アーカイブに使えるやつ
 */
export default class Scrap extends Model {
  static __ns = "Scrap";
  static schema = {
    name:        Types.string.isRequired,
    filename:    Types.string.isRequired,
    url:         Types.string.isRequired,
    description: Types.string,
    created:     Types.number.isRequired,
    updated:     Types.number,
  }
  static template = {
    filename: () => `scrap-${Date.now()}`,
  }
  static nextID = Model.sequentialID;

  name: string;
  filename: string;
  url: string;
  description: string;
  created: number;
  updated: number;
}
