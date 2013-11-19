/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function KaisouAction(){/*** 改装系のAPIが叩かれたときのアクション ***/
    this.achievements = new kanColleWidget.Achievements(new MyStorage());
}

KaisouAction.prototype.forPowerup= function(params){
    this.achievements.update().incrementKaisouCount();
}
