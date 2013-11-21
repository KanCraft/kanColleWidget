/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function HokyuAction(){/*** 補給系のAPIが叩かれたときのアクション ***/
    this.achievements = new KanColleWidget.Achievements(new MyStorage());
}

HokyuAction.prototype.forCharge= function(params){
    this.achievements.update().incrementHokyuCount();
}
