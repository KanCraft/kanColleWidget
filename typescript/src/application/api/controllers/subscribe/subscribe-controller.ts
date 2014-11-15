
module KCW.API {
    export class SubscribeController extends Controller {
        perform(): Controller {
            var repo = KCW.SubscribersRepository.local();
            var subscriber = repo.find(this.request.sender.id);
            if (subscriber) {
                return this.ok({
                    status: 304,
                    message: "Your app has already subscribed."
                });
            }
            subscriber = new Subscriber(this.request.sender.id);
            if (! this.confirmSubscriberRegistration(subscriber)) {
                window.alert("拒否しました(๑˃̵ᴗ˂̵)و");
                return this.ng({
                    status: 403,
                    message: "Permission denied by user."
                });
            }
            repo.add(subscriber);
            window.alert(subscriber.toURL() + "\nによるアクセスを許可しました.\n(๑˃̵ᴗ˂̵)و");
            return this.ok({
                status: 201,
                message: "Your app started subscribing.",
                body: {"sender":this.request.sender,"subscriber":subscriber}
            });
        }
        private confirmSubscriberRegistration(subscriber: Subscriber): boolean {
            var message: string = "以下のアプリが艦これウィジェット(≠艦これ)の";
            message += "遠征・入渠・建造の終了時間へのアクセスを求めています.\n";
            message += "必ず以下のURLを確認してください.\n\n";
            message += subscriber.toURL();
            message += "\n\n許可しますか？（設定から削除可能です）";
            return window.confirm(message);
        }
    }
}