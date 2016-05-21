import {expect} from 'chai';
import Hello from '../../src/js/Components/Hello';

describe("Foo", () => {
  describe("Bar", () => {
    it("baz", () => {
      // true.should.be.false;
      let hello = new Hello();
      // hello.foo().should.equal.'Foo';
      expect(hello.foo()).to.equal('This is Hello.foo');
    })
  })
})
