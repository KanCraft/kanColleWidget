
export interface MissionStartFormData {
    api_deck_id: string[];
    api_mission_id: string[];
    api_mission: string[]; // たぶんいらない
    // 以下、含まれているが要らないので扱わない
    // api_serial_cid: string[];
    // api_token: string[];
    // api_verno: string[];
}

export interface RecoveryStartFormData {
    api_highspeed: string[];
    api_ndock_id: string[];
    api_ship_id: string[];
}

export interface MapStartFormData {
    api_deck_id: string[];
    api_maparea_id: string[];
    api_mapinfo_no: string[];
    // 以下、含まれているが要らないので扱わない
    // api_serial_cid: string[];
    // api_token: string[];
    // api_verno: string[];
}

export interface CreateShipFormData {
    api_highspeed: string[];
    api_kdock_id: string[];
    // 以下、含まれているが要らないので扱わない
    // api_large_flag: string[];
    // api_item1: string[];
    // api_item2: string[];
    // api_item3: string[];
    // api_item4: string[];
    // api_item5: string[];
    // api_token: string[];
    // api_verno: string[];
}