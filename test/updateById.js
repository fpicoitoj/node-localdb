/**
 * Created by fpicoitoj on 2017/6/21.
 */

var path = require('path');
var assert = require("assert");
var user = require('..')(path.join(__dirname, 'data/user.json'));
var userId = -1

describe('node-localdb', function() {
    describe('#updateById()', function () {
        before(function() {
            // remove all data
            user.remove({}).then(function(){});
        });
        after(function() {
            // remove all data
            user.remove({}).then(function(){});
        });

        it('should hash method of #updateById()', function(){
            assert.notEqual(undefined, user.updateById);
            assert.equal('function', typeof user.updateById);
        });
        
        it('should create a user and update it', function (done) {
            user.insert({username: 'jf', password: '123'}).then(function(u){
                userId = u._id; // save auto generated _id

                assert.notEqual(undefined, u);
                assert.notEqual(undefined, u.username);
                assert.notEqual(undefined, u.password);
                assert.equal('jf', u.username);
                assert.equal('123', u.password);
                assert.notEqual(undefined, u._id);
            }).then(function(){
                user.updateById(userId, {username: 'fpj', password: '313', active: true}).then(function(u){
                    assert.notEqual(undefined, u);
                    assert.notEqual(undefined, u.username);
                    assert.notEqual(undefined, u.password);
                    assert.notEqual(undefined, u.active);
                    assert.equal('fpj', u.username);
                    assert.equal('313', u.password);
                    assert.equal(true, u.active);
                    assert.notEqual(undefined, u._id);
                });
            }).then(function(){
                user.find({}).then(function(users){
                    assert.notEqual(undefined, users);
                    assert.equal('object', typeof users);
                    assert.equal(true, users instanceof Array);
                    assert.equal(1, users.length);
                    done();
                });
            });
        });

        it('should not be able to update non-existing user', function (done) {
            user.updateById('-1', {username: 'fpj', password: '313'}).then(function(u){
                assert.notEqual(undefined, u);
                assert.notEqual(undefined, u.username);
                assert.notEqual(undefined, u.password);
                assert.equal('fpj', u.username);
                assert.equal('313', u.password);
                assert.notEqual(undefined, u._id);
            }).catch(function(error) {
                assert.equal('no object found', error.message)
                done();
            });
        });
    });
});