var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var ActionBase = KanColleWidget.ActionBase = function(){};
    ActionBase.prototype.confirmMessage = "以下の任務が未着手です\n\n- {{title}}\n\n\n(もうこの任務について通知を出さない？)";
    ActionBase.prototype.forPreparation = function(){

        if (! Config.get("prevent-forgetting-quest")) return;
        var checker = KanColleWidget.PreChecker;
        var questNotEmbarkedYet = checker[this.precheckKeyword].check();

        if (! questNotEmbarkedYet) return;
        var message = this.confirmMessage.replace('{{title}}', questNotEmbarkedYet.title);
        Util.confirm(message, function(){
            checker.ignore(questNotEmbarkedYet.id);
        });
    };

    ActionBase.prototype.setManually = function(model, kind, params){

        var notificationMessage = '';
        var notificationOptions = {
            startOrFinish: 'start',
            sound: {kind: kind}
        };
        if (params.reset) {
            model.clear(params.identifier);
            notificationMessage = "リマインダーを解除しました!";
            notificationOptions.startOrFinish = 'finish';
            notificationOptions.sound = false;
        } else {
            model.add(params.identifier, params.finish);
            // TODO: tracking
            // self.tracking.set(self.modelName, inputs);
            notificationMessage = Util.zP(2, params.inputs.hour) + ':' + Util.zP(2, params.inputs.minute)
                + "で" + params.text
                + "完了通知を登録しときました!";
        }
        Util.presentation(
            notificationMessage,
            notificationOptions
        );
    };
})();
