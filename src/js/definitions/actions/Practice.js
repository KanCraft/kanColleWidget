/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function PracticeAction(){/*** 演習系のAPIが叩かれたときのアクション ***/
    this.achievements = new Achievements(new MyStorage());
}

PracticeAction.prototype.forBattle= function(){
    this.achievements.update().incrementPracticeCount();
}
