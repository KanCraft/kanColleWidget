jest.unmock('chomex');
jest.unmock('../../../src/js/Components/Models/History');
import History from '../../../src/js/Components/Models/History';

// TODO: jest.mockにできる？
Object.defineProperty(window, 'localStorage', { value: (function() {
  var store = {};
  return {
    getItem: function(key) {
      return store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})()});

describe('model History', () => {
  describe('class', () => {
    it('shold do something', () => {
      let history = new History({value: 'this is foo'}, 'foo');
      history.save();

      let foo = History.find('foo');
      expect(foo.value).toBe('this is foo');

    })
  })
})
