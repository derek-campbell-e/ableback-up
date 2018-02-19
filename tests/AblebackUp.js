const assert = require('assert');
let AbleBackUp = require('../index')();

describe("AbleBackUp", function(){
  it("should start watching a project folder (s?)", function(){
    AbleBackUp.watch('/Users/derekcampbell/Drop/oixo Project/okaynosaj');
  });
  setTimeout(function(){}, 100000);
});
