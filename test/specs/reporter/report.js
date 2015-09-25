var chai = require('chai');

describe('Voyager', function() {
    it('Generates a pass', function (done) {
        done();
    });
    it('Pipes console log', function (done) {
        done();
        console.log('This is some console log.');
    });
    it('Generates a fail', function (done) {
        chai.assert(1 === 3, 'This should result in error');
        done();
    });
    it('Pipes a console error', function (err) {
        throw err;
    });
});