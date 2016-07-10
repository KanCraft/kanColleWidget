import Frame from '../../Models/Frame';

export function GetAll(message) {
  return {status: 200, data: Frame.all()};
}
