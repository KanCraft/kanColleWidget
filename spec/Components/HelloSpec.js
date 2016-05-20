describe("Foo", () => {
  chai.should();
  describe("Bar", () => {
    it("baz", () => {
      true.should.be.true;
      // true.should.be.false;
      let hello = new Hello();
      // hello.foo().should.equal.'Foo';
      chai.expect(hello.foo()).to.equal('This is Hello.foo');
    })
  })
})
