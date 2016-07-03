import NotificationService from '../../Services/NotificationService';
const service = new NotificationService();

export function OnNotificationClicked(id) {
  service.clear(id);
}

export function OnMissionNotificationClicked(id) {
  return OnNotificationClicked(id);
}
