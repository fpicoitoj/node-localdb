/**
 * Created by fpicoitoj on 2017/6/21.
 */

var path = require('path');
var assert = require("assert");
var user = require('..')(path.join(__dirname, 'data/user.json'));
var _ = require('lodash')

describe('node-localdb', function() {
    describe('#update()', function () {
        before(function() {
            // remove all data
            user.remove({}).then(function(){});
        });
        after(function() {
            // remove all data
            user.remove({}).then(function(){});
        });

        it('should hash method of #update()', function(){
            assert.notEqual(undefined, user.update);
            assert.equal('function', typeof user.update);
        });

        it('should create two users with same field value', function (done) {
            user.insert({username: 'jf', password: '123', active: true}).then(function(u){
                assert.notEqual(undefined, u);
                assert.notEqual(undefined, u.username);
                assert.notEqual(undefined, u.password);
                assert.notEqual(undefined, u.active);
                assert.equal('jf', u.username);
                assert.equal('123', u.password);
                assert.equal(true, u.active);
                assert.notEqual(undefined, u._id);
            }).then(function(){
                user.insert({username: 'fpj', password: '313', active: true}).then(function(u){
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
                    assert.equal(2, users.length);
                    assert.deepEqual(_.pick(users[0], ['username', 'password', 'active']), {username: 'jf', password: '123', active: true})
                    assert.deepEqual(_.pick(users[1], ['username', 'password', 'active']), {username: 'fpj', password: '313', active: true})
                    done();
                });
            });
        });
        
        it('should update two users with same field value and add another field', function (done) {
            user.update({active: true}, {active: false, age: 31}).then(function(users){
                assert.notEqual(undefined, users);
                assert.equal('object', typeof users);
                assert.equal(true, users instanceof Array);
                assert.equal(2, users.length);
                assert.deepEqual(_.pick(users[0], ['username', 'password', 'active', 'age']), {username: 'jf', password: '123', active: false, age: 31});
                assert.deepEqual(_.pick(users[1], ['username', 'password', 'active', 'age']), {username: 'fpj', password: '313', active: false, age: 31});
            }).then(function(){
                user.find({}).then(function(users){
                    assert.notEqual(undefined, users);
                    assert.equal('object', typeof users);
                    assert.equal(true, users instanceof Array);
                    assert.equal(2, users.length);
                    assert.deepEqual(_.pick(users[0], ['username', 'password', 'active', 'age']), {username: 'jf', password: '123', active: false, age: 31});
                    assert.deepEqual(_.pick(users[1], ['username', 'password', 'active', 'age']), {username: 'fpj', password: '313', active: false, age: 31});
                    done();
                });
            });
        });
    });
});