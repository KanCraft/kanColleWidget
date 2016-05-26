import Repository from './Repository';

export default class History extends Repository {
  constructor(storage) {
    super('history', storage);
  }
  initialValues() {
    return {
      oppai: 'Cカップ'
    };
  }
}
