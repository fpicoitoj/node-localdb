/**
 * Created by fpicoitoj on 2017/6/21.
 */

var path = require('path');
var assert = require("assert");
var user = require('..')(path.join(__dirname, 'data/user.json'));
var userId = -1

describe('node-localdb', function() {
    describe('#removeById()', function () {
        before(function() {
            // remove all data
            user.remove({}).then(function(){});
        });
        after(function() {
            // remove all data
            user.remove({}).then(function(){});
        });

        it('should hash method of #removeById()', function(){
            assert.notEqual(undefined, user.removeById);
            assert.equal('function', typeof user.removeById);
        });
        it('should return object when the there is one user in user document', function (done) {
            user.insert({username: 'jf', password: '123'}).then(function(u){
                userId = u._id; // save auto generated _id

                assert.notEqual(undefined, u);
                assert.notEqual(undefined, u.username);
                assert.notEqual(undefined, u.password);
                assert.equal('jf', u.username);
                assert.equal('123', u.password);
                assert.notEqual(undefined, u._id);
            }).then(function(){
                user.removeById(userId);
            }).then(function(){
                user.findOne({}).then(function(u){
                    assert.equal(undefined, u);
                    done();
                });
            });
        });
    });
});