/**
 * DEVELOPED BY
 * GIL LOPES BUENO
 * gilbueno.mail@gmail.com
 * 
 * FORK:
 * https://gist.github.com/1627705
 */

var $watchjs$ = {
    isFunction: function(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
    },

    isInt: function(x) {
        var y = parseInt(x);
        if (isNaN(y)) return false;
        return x == y && x.toString() == y.toString();
    }
};

Object.defineProperty(Object.prototype, "watch", {
          enumerable: false
        , configurable: true
        , writable: false
        , value: function() {

                    if (arguments.length == 1) 
                        this.watchAll.apply(this, arguments);
                    else if (Array.isArray(arguments[0])) 
                        this.watchMany.apply(this, arguments);
                    else
                        this.watchOne.apply(this, arguments);

                }
});


Object.defineProperty(Object.prototype, "watchAll", {
          enumerable: false
        , configurable: true
        , writable: false
        , value: function(watcher) {
                        
                    var obj = this;

                    if (obj instanceof String || (!(obj instanceof Object) && !Array.isArray(obj))) //accepts only objects and array (not string)
                        return;

                    var props = [];


                    if(Array.isArray(obj)){
                        for (var prop=0; prop<obj.length; prop++) { //for each item if obj is an array 
                            props.push(prop); //put in the props
                        }
                    }else{
                        for (var prop2 in obj) { //for each attribute if obj is an object
                            props.push(prop2); //put in the props
                        }
                    }

                    obj.watchMany(props, watcher); //watch all itens of the props
                }

});


Object.defineProperty(Object.prototype, "watchMany", {
          enumerable: false
        , configurable: true
        , writable: false
        , value: function(props, watcher) {
                    var obj = this;

                    if(Array.isArray(obj)){
                        for (var prop in props) { //watch each iten of "props" if is an array
                            obj.watchOne(props[prop], watcher);
                        }
                    }else{
                        for (var prop2 in props) { //watch each attribute of "props" if is an object
                            obj.watchOne(props[prop2], watcher);
                        }
                    }
                }

});

Object.defineProperty(Object.prototype, "watchOne", {
          enumerable: false
        , configurable: true
        , writable: false
        , value: function(prop, watcher) {
                    var obj = this;

                    var val = obj[prop];

                    if(obj[prop]===undefined || $watchjs$.isFunction(obj[prop])) //dont watch if it is null or a function
                        return;

                    if(obj[prop]!=null)
                        obj[prop].watchAll(watcher); //recursively watch all attributes of this

                    obj.watchFunctions(prop);


                    if (!obj.watchers) {
                        Object.defineProperty(obj, "watchers", {
                              enumerable: false
                            , configurable: true
                            , writable: false
                            , value: {}
                            });
                    }

                    if (!obj.watchers[prop]) 
                        obj.watchers[prop] = [];


                    obj.watchers[prop].push(watcher); //add the new watcher in the watchers array


                    var getter = function() {
                        return val;
                    };


                    var setter = function(newval) {
                        var oldval = val;
                        val = newval;

                        obj[prop].watchAll(watcher);
                        obj.watchFunctions(prop);

                        if (JSON.stringify(oldval) != JSON.stringify(newval) && arguments.callee.caller != watcher) {
                            obj.callWatchers(prop);
                        }
                    };

                    if (Object.defineProperty) { // ECMAScript 5
                        Object.defineProperty(obj, prop, {
                            get: getter,
                            set: setter,
                            enumerable: true,
                            configurable: true
                        });
                    } else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
                        Object.prototype.__defineGetter__.call(obj, prop, getter);
                        Object.prototype.__defineSetter__.call(obj, prop, setter);
                    }


                }
});

Object.defineProperty(Object.prototype, "callWatchers", {
          enumerable: false
        , configurable: true
        , writable: false
        , value: function(prop) {
                    var obj = this;

                    for (var wr in obj.watchers[prop]) {
                        if ($watchjs$.isInt(wr)){
                            obj.watchers[prop][wr]();
                        }
                    }
                }

});



Object.defineProperty(Object.prototype, "watchFunctions", {
          enumerable: false
        , configurable: true
        , writable: false
        , value: function(prop) {
                    var obj = this;

                    if(!obj[prop])
                        return;

                    if (!(obj[prop] instanceof String) && (Array.isArray(obj[prop]))) {//is array?

                        obj[prop].pop = (function() {
                            var original = Array.prototype.pop;
                            return function() {
                                var response = original.apply(this, arguments);

                                obj.watchOne(obj[prop]);
                                obj.callWatchers(prop);

                                return response;
                            };
                        })();


                        obj[prop].push = (function() {
                            var original = Array.prototype.push;
                            return function() {
                                var response = original.apply(this, arguments);

                                obj.watchOne(obj[prop]);
                                obj.callWatchers(prop);

                                return response;
                            };
                        })();


                        obj[prop].reverse = (function() {
                            var original = Array.prototype.reverse;
                            return function() {
                                var response = original.apply(this, arguments);

                                obj.watchOne(obj[prop]);
                                obj.callWatchers(prop);

                                return response;
                            };
                        })();


                        obj[prop].shift = (function() {
                            var original = Array.prototype.shift;
                            return function() {
                                var response = original.apply(this, arguments);

                                obj.watchOne(obj[prop]);
                                obj.callWatchers(prop);

                                return response;
                            };
                        })();


                        obj[prop].sort = (function() {
                            var original = Array.prototype.sort;
                            return function() {
                                var response = original.apply(this, arguments);

                                obj.watchOne(obj[prop]);
                                obj.callWatchers(prop);

                                return response;
                            };
                        })();


                        obj[prop].splice = (function() {
                            var original = Array.prototype.splice;
                            return function() {
                                var response = original.apply(this, arguments);

                                obj.watchOne(obj[prop]);
                                obj.callWatchers(prop);

                                return response;
                            };
                        })();


                        obj[prop].unshift = (function() {
                            var original = Array.prototype.unshift;
                            return function() {
                                var response = original.apply(this, arguments);

                                obj.watchOne(obj[prop]);
                                obj.callWatchers(prop);

                                return response;
                            };
                        })();

                    }



                }
});