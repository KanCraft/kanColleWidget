
export default class PermissionService {
  constructor(private mod = chrome.permissions) {}
  request(perms: chrome.permissions.Permissions) {
    return new Promise(resolve => this.mod.request(perms, resolve));
  }
  contains(perms: chrome.permissions.Permissions): Promise<boolean> {
    return new Promise(resolve => this.mod.contains(perms, resolve));
  }
}