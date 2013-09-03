/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function MapAction(){/*** Map出撃系のAPIが叩かれたときのアクション ***/
    this.achievements = new Achievements();
}

MapAction.prototype.forStart= function(){
    this.achievements.update().incrementMapCount();
}
