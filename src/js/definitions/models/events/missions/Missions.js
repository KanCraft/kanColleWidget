/***** class definitions *****/
function Missions(){/** localStorageにあるmissionsにアクセスするクラス **/
    this.primaryIdName = 'deck_id';
    this.storageName   = 'missions';
    this.soloModel     = SoloMission;
    this.initialValue  = [
        {deck_id: 2, finish: null},
        {deck_id: 3, finish: null},
        {deck_id: 4, finish: null}
    ];
}
// extend
Missions.prototype = Object.create(EventsBase.prototype);
Missions.prototype.constructor = Missions;
