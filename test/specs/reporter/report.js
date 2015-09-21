var chai = require('chai');

describe('Voyager', function() {
    it('Generates a pass', function (done) {
        done();
    });
    it('Generates a fail', function (done) {
        chai.assert(1 === 3, 'This should result in error');
        done();
    });
});