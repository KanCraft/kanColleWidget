
declare module Config {
    export function get(key: string): any;
}
declare module KanColleWidget {
    export interface IPushServerConfig {
        client_token: string;
    }
    export var PushServerConfig: IPushServerConfig;
}