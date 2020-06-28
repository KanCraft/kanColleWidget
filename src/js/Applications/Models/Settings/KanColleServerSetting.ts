import { Model, Types } from "chomex";
import PermissionService from "../../../Services/Permission";

export interface KanColleServer {
  name: string;
  address: string;
  protocol?: string;
  granted?: boolean;
}

/**
 * どうやら動的に変わるっぽいので、かわったらどうしよ...🥺
 * @see http://kpherox.cf/kancolle/server-list/
 */
export const KanColleServers: KanColleServer[] = [
  { name: "横須賀鎮守府", address: "203.104.209.71" },
  { name: "呉鎮守府", address: "203.104.209.87" },
  { name: "佐世保鎮守府", address: "125.6.184.215" },
  { name: "舞鶴鎮守府", address: "203.104.209.183" },
  { name: "大湊警備府", address: "203.104.209.150" },
  { name: "トラック泊地", address: "203.104.209.134" },
  { name: "リンガ泊地", address: "203.104.209.167" },
  { name: "ラバウル泊地", address: "203.104.209.199" },
  { name: "ショートランド泊地", address: "125.6.189.7" },
  { name: "ブイン基地", address: "125.6.189.39" },
  { name: "タウイタウイ泊地", address: "125.6.189.71" },
  { name: "パラオ泊地", address: "125.6.189.103" },
  { name: "ブルネイ泊地", address: "125.6.189.135" },
  { name: "単冠湾泊地", address: "125.6.189.167" },
  { name: "幌筵泊地", address: "125.6.189.215" },
  { name: "宿毛湾泊地", address: "125.6.189.247" },
  { name: "鹿屋基地", address: "203.104.209.23" },
  { name: "岩川基地", address: "203.104.209.39" },
  { name: "佐伯湾泊地", address: "203.104.209.55" },
  { name: "柱島泊地", address: "203.104.209.102" },
];

export default class KanColleServerSetting extends Model {

  static __ns = "KanColleServerSetting";

  static schema = {
    servers: Types.arrayOf(Types.shape({
      name: Types.string.isRequired,
      address: Types.string.isRequired,
      protocol: Types.string,
    })),
  }

  servers: KanColleServer[];

  static default = {
    // 1モデル1エンティティのモデルなので
    "user": {
      servers: []
    }
  }

  static user(): KanColleServerSetting {
    return this.find("user");
  }

  async check(): Promise<boolean> {
    const ps = new PermissionService();
    return await ps.contains(this.toChromePermissions());
  }

  async add(server: KanColleServer) {
    this.servers.push(server);
    return await this.request();
  }

  async remove(target: KanColleServer): Promise<KanColleServerSetting> {
    const ps = new PermissionService();
    const removed = await ps.remove(this.toChromePermissions(target));
    const servers = removed ? this.servers.filter(s => s.address != target.address) : this.servers.concat();
    return this.update<KanColleServerSetting>({ servers });
  }

  async request() {
    const ps = new PermissionService();
    const granted = await ps.request(this.toChromePermissions());
    return granted && this.update<KanColleServerSetting>({ servers: this.servers });
  }

  toChromePermissions(server?: KanColleServer): chrome.permissions.Permissions {
    const origins: string[] = (server ? [server] : this.servers).map(s => {
      return `${s.protocol ? s.protocol : "http:"}//${s.address}/*`;
    });
    return { origins };
  }

}
