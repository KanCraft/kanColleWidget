/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function KaisouAction(){/*** 改装系のAPIが叩かれたときのアクション ***/
    this.achievements = new Achievements();
}

KaisouAction.prototype.forPowerup= function(params){
    this.achievements.update().incrementKaisouCount();
}
