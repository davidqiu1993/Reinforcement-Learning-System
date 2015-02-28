/**
 * General require tool testing.
 *
 * Author:  David Qiu.
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */


// SECTION: General require tool
describe('drequire', function() {
  // TEST: Existence of mathematics module
  it('should have mathematics module', function() {
    drequire('maths').should.be.ok;
    drequire('mathematics').should.be.ok;
    drequire('math').should.be.ok;
  });

  // TEST: Existence of algorithms module
  it('should have algorithms module', function () {
    drequire('algorithms').should.be.ok;
  });

  // TEST: Existence of agent module
  it('should have agent module', function () {
    drequire('agent').should.be.ok;
  });

  // TEST: Existence of inexistent modules
  it('should not have any inexistent module', function() {
    (drequire('inexistentModuleA') === undefined).should.be.true;
    (drequire('inexistentModuleB') === undefined).should.be.true;
  });
});

