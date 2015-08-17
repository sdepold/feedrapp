import MyLibrary from '../../src/index';

describe('A feature test', function () {
  beforeEach(() => {
    this.lib = new MyLibrary();
    spy(this.lib, 'mainFn');
    this.lib.mainFn();
  });

  it('should have been run once', () => {
    expect(this.lib.mainFn).to.have.been.calledOnce;
  });

  it('should have always returned hello', () => {
    expect(this.lib.mainFn).to.have.always.returned('hey!');
  });
});
