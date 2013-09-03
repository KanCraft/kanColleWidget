/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function PracticeAction(){/*** pay系のAPIが叩かれたときのアクション ***/
    this.achievements = new Achievements();
}

PracticeAction.prototype.forBattle= function(){
    this.achievements.update().incrementPracticeCount();
}
