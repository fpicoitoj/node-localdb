/**
 * Created by jfengjiang on 2015/8/25.
 */

var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');
var _ = require('lodash');
var Promise = require('bluebird');


module.exports = Engine;

/**
 * engine
 * @param filename
 * @constructor
 */
function Engine(filename){
    if(!(this instanceof Engine)){
        return new Engine(filename);
    }
    mkdir(path.dirname(filename));
    if(!fs.existsSync(filename)){
        fs.writeFileSync(filename, '[]', {encoding: 'utf8'});
    }

    this.path = filename;
}

/**
 * findOne
 * @param criteria condition
 * @returns {*}
 */
Engine.prototype.findOne = function (criteria){
     criteria = criteria || {};
    var data = this._fetch();
    return new Promise(function (resolve, reject){
        resolve(_.find(data, criteria));
    });
};

/**
 * find
 * @param criteria
 * @param option
 * @returns {bluebird|exports|module.exports}
 */
Engine.prototype.find = function (criteria, option){
    criteria = criteria || {};
    option = option || {};
    var data = this._fetch();
    var skip = parseInt(option.skip);
    var limit = parseInt(option.limit);
    return new Promise(function (resolve, reject){
        if(!isNaN(skip) && !isNaN(limit)){
            resolve(_.take(_.slice(_.filter(data, criteria), skip), limit));
        }
        else{
            resolve(_.filter(data, criteria));
        }
    });
};

/**
 * count
 * @param criteria
 * @returns {*}
 */
Engine.prototype.count = function (criteria){
     criteria = criteria || {};
    return this.find(criteria).then(function (data){
        return data.length;
    });
};

/**
 * update
 * @param criteria
 * @param obj
 * @returns {bluebird|exports|module.exports}
 */
Engine.prototype.update = function (criteria, obj){
    criteria = criteria || {};
    var self = this;
    var data = this._fetch();
    return new Promise(function (resolve, reject){
        var targets = _.filter(data, criteria);
        var result = [];
        _.forEach(targets, function (target){
            target = _.merge(target, obj);
            result.push(target);
        });
        self._flush(data);
        resolve(result);
    });
};

/**
 * update (PATCH) an object by its _id (auto-generated)
 * @param criteria
 * @param obj
 * @returns {bluebird|exports|module.exports}
 */
Engine.prototype.updateById = function (_id, obj){
    var self = this;
    var data = this._fetch();
    return new Promise(function (resolve, reject){
        var targets = _.filter(data, {_id});

        if (targets.length > 1) reject(new Error('duplicate _id found'))
        if (targets.length === 0) reject(new Error('no object found'))

        var target = targets[0]
        target = _.merge(target, obj);

        self._flush(data);
        resolve(target);
    });
};

/**
 * insert obj
 * @param obj
 */
Engine.prototype.insert = function (obj){
    obj = _.merge(obj, {_id: uuid.v4()});
    var data = this._fetch();
    data.push(obj);
    this._flush(data);
    return new Promise(function (resolve, reject){
        resolve(obj);
    });
};

/**
 * remove
 * @param criteria
 * @returns {bluebird|exports|module.exports}
 */
Engine.prototype.remove = function (criteria){
     criteria = criteria || {};
    var data = this._fetch();
    var targets = _.remove(data, criteria);
    this._flush(data);
    return new Promise(function (resolve, reject){
        resolve(targets);
    });
};

/**
 * removes an object by its _id (auto-generated)
 * @param criteria
 * @returns {bluebird|exports|module.exports}
 */
Engine.prototype.removeById = function (_id){
    var data = this._fetch();
    var targets = _.remove(data, {_id});
    this._flush(data);
    return new Promise(function (resolve, reject){
        if (targets.length > 0) return resolve(targets[0])
        return resolve([])
    });
};

/**
 * fetch data from local file
 * @private
 */
Engine.prototype._fetch = function (){
    var json = fs.readFileSync(this.path, 'utf8');
    return JSON.parse(json);
};

/**
 * write data to local file
 * @param data
 * @private
 */
Engine.prototype._flush = function (data){
    fs.writeFileSync(this.path, JSON.stringify(data));
};


/**
 * mkdir recursive
 * @param dir
 * @param mode
 * @private
 */
function mkdir(dir, mode){
    try{
        fs.mkdirSync(dir, mode);
    }
    catch(e){
        if(e.errno === 34){
            this._mkdir(path.dirname(dir), mode);
            this._mkdir(dir, mode);
        }
    }
}