
export default class DamageSnapshotDisplay {
    constructor(id = "damagesnapshot", context = window) {
        this.id = id;
        this.context = context;
    }
    show(uri) {
        let div = this.context.document.createElement("div");
        div.id = "damagesnapshot";
        div.style.position ="fixed";
        div.style.left = "0px";
        div.style.top  = "0px";
        div.style.backgroundImage = `url('${uri}')`;
        div.style.backgroundSize = "cover";
        div.style.width="100px"; div.style.height="160px";
        div.style.transition = "0.2s all";
        div.style.opacity = 1;
        div.addEventListener("mouseover", () => div.style.opacity = 1 );
        div.addEventListener("mouseleave", () => div.style.opacity = 0 );
        this.context.document.body.appendChild(div);
    }
    remove() {
        this.context.document.querySelector("#damagesnapshot").remove();
    }
}
