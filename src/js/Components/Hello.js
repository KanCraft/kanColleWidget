class Hello {
  foo() {
    return 'This is Hello.foo';
  }
}

// WANT
// export default Hello;
// NOT WORKING
// (module || {}).exports = Hello;
// exports.Hello = Hello;
module.exports = Hello;
