/// <reference path="../src/view.ts" />
/// <reference path="../definitions/mocha/mocha.d.ts" />
/// <reference path="../definitions/chai/chai.d.ts" />
/// <reference path="../definitions/jquery/jquery.d.ts" />

module Spec {

    chai.should();

    describe('View', () => {
        describe('when created without options', () => {
            var mockView: ShowvMockView;
            beforeEach(() => {
                mockView = new ShowvMockView();
            });
            it('should have $el', () => {
                mockView.$el.should.be.instanceof(jQuery);
            });
            it('tag name should be "div"', () => {
                mockView.$el[0].tagName.should.equal('DIV');
            });
            it('should not have `id`', () => {
                mockView.$el[0].id.should.equal('');
            });
            it('should not have `class`', () => {
                mockView.$el[0].className.should.equal('');
            });
            it('should not have any contents', () => {
                mockView.$el.html().should.equal('');
            });
        });

        describe('when created with some options', () => {
            describe('options with tagName or so', () => {
                var mockView: ShowvMockView;
                beforeEach(() => {
                    var options = {
                        tagName:   'a',
                        id:        'showv-test-000',
                        className: 'tweet',
                        attr: {
                            href: 'http://otiai10.github.io/showv/'
                        }
                    };
                    mockView = new ShowvMockView(options);
                });
                it('should have $el', () => {
                    mockView.$el.should.be.instanceof(jQuery);
                });
                it('tag name should be given tag name', () => {
                    mockView.$el[0].tagName.should.equal('A');
                });
                it('should have given `id`', () => {
                    mockView.$el[0].id.should.equal('showv-test-000');
                });
                it('should have given `class`', () => {
                    mockView.$el[0].className.should.equal('tweet');
                });
                it('should have given attrs', () => {
                    mockView.$el[0].getAttribute('href').should.equal('http://otiai10.github.io/showv/');
                });
            });
            describe('options with $el', () => {
                var mockView: ShowvMockView;
                beforeEach(() => {
                    var _$el = $('<blockquote id="test-bq"></blockquote>');
                    var options = {
                        $el: _$el
                    };
                    mockView = new ShowvMockView(options);
                });
                it('should have $el', () => {
                    mockView.$el.should.be.instanceof(jQuery);
                });
                it('tag name should be given $el\'s tag name', () => {
                    mockView.$el[0].tagName.should.equal('BLOCKQUOTE');
                });
                it('should be given $el\'s `id`', () => {
                    mockView.$el[0].id.should.equal('test-bq');
                });
            });
        });

        describe('when `events` method defiend', () => {
            var mockView: ShowvMockView;
            beforeEach(() => {
                mockView = new ShowvMockView();
                mockView.$el.append(
                    $('<a></a>').attr({'id':'trigger-A'}),
                    $('<a></a>').attr({'id':'trigger-B'})
                );
            });
            it('should delegate events', () => {
                // initially
                mockView.flagA.should.be.false;
                mockView.flagB.should.be.false;
                // after A
                mockView.$el.find('a#trigger-A').click();
                mockView.flagA.should.be.true;
                mockView.flagB.should.be.false;
                // after B
                mockView.$el.find('a#trigger-B').click();
                mockView.flagA.should.be.false;
                mockView.flagB.should.be.true;
            });

            it('event method takes Event Object', () => {
                mockView.$el.click();
                mockView.methodResponse.should.not.be.null;
                mockView.methodResponse.should.instanceof(jQuery.Event);
            });
        });

        describe('when `events` returns Object having event-key without selector', () => {
            var mockView: ShowvMockView;
            beforeEach(() => {
                mockView = new ShowvMockView({
                    tagName: 'a'
                });
            });
            it('should have event delegated on it\'s DOM root', () => {
                mockView.flagX.should.be.false;
                mockView.$el.click();
                mockView.flagX.should.be.true;
                mockView.$el.click();
                mockView.flagX.should.be.false;
            });
        });
    });

    // This is just a mock!
    class ShowvMockView extends showv.View {
        flagX: boolean;
        flagA: boolean;
        flagB: boolean;

        methodResponse: any = "hoge";

        constructor(options: showv.IViewCreateOptions = {}) {
            super(options);
            this.flagX = false;
            this.flagA = false;
            this.flagB = false;
        }
        events(): Object {
            return {
                'click':             'methodX',
                'click a#trigger-A': 'methodA',
                'click a#trigger-B': 'methodB'
            }
        }
        methodA() {
            this.flagA = true;
            this.flagB = false;
        }
        methodB() {
            this.flagA = false;
            this.flagB = true;
        }
        methodX(ev) {
            this.flagX = ! this.flagX;
            this.methodResponse = ev;
        }
    }
}
