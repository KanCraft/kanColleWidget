import {Model} from "chomex";

const S=1000,M=60*S,H=60*M;

class ResourceTracker {
  constructor(accessor) {
    this.accessor = accessor;
  }
  snapshot() {
    const last = this.accessor.last();
    console.log(last);
    if (last && Date.now() - last.created < 5*M) return Promise.resolve(last);
    return new Promise(resolve => {
      const resource = this.accessor.create({
        fuel:    Math.floor(1000 + Math.random() * 100),
        ammo:    Math.floor(800  + Math.random() * 100),
        steel:   Math.floor(1200 + Math.random() * 100),
        bauxite: Math.floor(600  + Math.random() * 400),
        created: Date.now(),
      });
      resolve(resource);
    });
  }
}

export default class Resource extends Model {
  static nextID = Model.sequentialID
  static schema = {
    fuel:    Model.Types.number.isRequired,
    ammo:    Model.Types.number.isRequired,
    steel:   Model.Types.number.isRequired,
    bauxite: Model.Types.number.isRequired,
    created: Model.Types.number.isRequired,
  }
  static tracker() {
    return new ResourceTracker(this);
  }
  static list() {
    return super.list().sort((p, n) => p.created < n.created ? -1 : 1);
  }
  static last() {
    return this.list().pop();
  }
}
