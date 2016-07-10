import NotificationService from '../../Services/NotificationService';
const service = new NotificationService();
import WindowService from '../../Services/WindowService';
const windows = WindowService.getInstance();

export function OnNotificationClicked(id) {
  service.clear(id);
  windows.find(true).then(tab => {
    windows.focus(tab);
  }).catch(() => {
    windows.open();
  });
}

export function OnMissionNotificationClicked(id) {
  return OnNotificationClicked(id);
}
