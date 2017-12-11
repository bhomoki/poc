if (typeof Object.create !== 'function') {
    /**
     * Creates a new object with the specified prototype object and properties.
     * @param {Object} val
     */
    Object.create = function (val) {
        function F() {}
        F.prototype = val;
        return new F();
    };
};

/**
 * @namespace LMI
 */
var LMI = LMI || {};

LMI.global = this;

/**
 * Returns true if the specified value is undefined. It's the preferred mode for checking whether the value is defined
 * or not.
 * 
 * @param {*} val The value which will be checked.
 * @return {Boolean} Whether the value is defined.
 * @static
 */
LMI.isUndefined = function(val) {
    return typeof val === 'undefined';
};

/**
 * Returns true if the specified value is |null|
 * @param {*} val Variable which will be tested.
 * @return {boolean} Whether variable is null.
 */
LMI.isNull = function(val) {
    return val === null;
};

/**
 * Returns true if the specified value is |null| or undefined or an empty string
 * @param {*} val Variable which will be tested.
 * @return {boolean} Whether variable is null, undefinen or empty string.
 */
LMI.isNullOrEmptyString = function(val) {
    return LMI.isNull(val) || LMI.isUndefined(val) ||
        (LMI.isString(val) && val == '');
}

/**
 * Returns true if the specified value is a string
 * @param {*} val value will be tested.
 * @return {boolean} true if the value is a string.
 */
LMI.isString = function(val) {
  return typeof val == 'string';
};

/**
 * Returns true if the specified value is a bool.
 * @param {*} val Variable to test.
 * @return {bool} Whether variable is bool.
 */
LMI.isBoolean = function(val) {
  return typeof val == 'boolean';
};

/**
 * Returns true if the specified value is a number
 * @param {*} val Variable to test.
 * @return {bool} Whether variable is a number.
 */
LMI.isNumber = function(val) {
  return typeof val == 'number';
};

/**
 * Returns true if the specified value is a function type.
 * @param {*} val Type to test.
 * @return {bool} Whether Type is a function.
 */
LMI.isFunction = function(val) {
   return LMI.typeOf(val) == 'function';
};

/**
 * Returns true if the specified value is an array type.
 * @param {*} val Type to test.
 * @return {bool} Whether Type is a function.
 */
LMI.isArray = function(val) {
   return LMI.typeOf(val) == 'array';
};

/**
 * Returns true if the specified value is an object type.
 * @param {*} val Type to test.
 * @return {bool} Whether Type is a function.
 */
LMI.isObject = function(val) {
   return LMI.typeOf(val) == 'object';
};

/**
 * Returns the type of the specified value. It differs from the typeof operator usage
 * in such that way that try to hide the weaknesses of javascript.
 * Source: http://javascript.crockford.com/remedial.html and its improvements from google.
 * @param value
 */
LMI.typeOf = function(value) {
var s = typeof value;
  if (s == 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals tyepof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }

      // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.
      var className = Object.prototype.toString.call(
          /** @type {Object} */ (value));
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == '[object Window]') {
        return 'object';
      }

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use goog.isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if ((className == '[object Array]' ||
           // In IE all non value types are wrapped as objects across window
           // boundaries (not iframe though) so we have to do object detection
           // for this edge case
           typeof value.length == 'number' &&
           typeof value.splice != 'undefined' &&
           typeof value.propertyIsEnumerable != 'undefined' &&
           !value.propertyIsEnumerable('splice')

          )) {
        return 'array';
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if ((className == '[object Function]' ||
          typeof value.call != 'undefined' &&
          typeof value.propertyIsEnumerable != 'undefined' &&
          !value.propertyIsEnumerable('call'))) {
        return 'function';
      }


    } else {
      return 'null';
    }

  } else if (s == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox
    // typeof behaves similarly for HTML{Applet,Embed,Object}Elements
    // and RegExps.  We would like to return object for those and we can
    // detect an invalid function by making sure that the function
    // object has a call method.
    return 'object';
  }
  return s;
};

/**
 * Empty function used for default values of callbacks.
 * @return {void} Nothing.
 */
LMI.emptyFunction = function() {};

/**
 * Writes a text in the console (independently from browsers). If you want to use special console methods (assert,
 * debug, count, group, profile, time...etc), you'll have to use the native console object instead of
 * using LMI.log() function.
 * @param {Object|String} message Text which is displayed in console.
 * @param {String} cat Category to use. Can be info, warn, error. The fallback category is log type
 * @example LMI.log('mymessage');LMI.log('msg2','warn');LMI.log('msg','error');
 */
LMI.log = (function() {

    var printByCategory = function (message, cat) {
            switch (cat) {
                case 'info':
                    window.console['info'](message);
                    break;
                case 'warn':
                    window.console['warn'](message);
                    break;
                case 'error':
                    window.console['error'](message);
                    break;
                default:
                    window.console['log'](message);
                    break;
            }
     };

    return function(message, category) {
        if (window.console && window.console['firebug']) {
            // for firebug
            printByCategory(message, category);
        } else if (window.console) {
            // for ie, chrome, safari
            printByCategory(message, category)
        } else if (window.opera) {
            // for opera
            window.opera['postError'](message);
        } else {
            // any other case.
            // TODO: discuss about Client-side Global Logger.
        }
    }

})();

/**
 * Checks a variable and sets a default value if the variable is undefined.
 * Throws an exception if the value is required.
 * @param {Object} value The value that should be checked
 * @param {Object} settings Settings for default function <br />
 *   settings.message: Message in case of missing mandatory value
 *   settings.defaultValue: Default value returned in case of missing value
 */
LMI.checkDefault = function checkDefault(value, settings) {
    if (typeof settings === 'undefined') {
        settings = {};
    }
    var required = typeof settings.required === 'undefined' ? false : settings.required,
            message = typeof settings.message === 'undefined' ? false : settings.message,
            getDefValue = function() {
                if (required) {
                    throw new TypeError(message);
                } else {
                    return settings.defaultValue;
                }
            };

    return typeof value === 'undefined' ? getDefValue() : value;
};

/**
 * Checks if the given value exists in the given object
 * @param {Object} obj Object to be searched for the value
 * @param { * } val Value to check in obj
 * @return {bool} Whether the value exists in the object or not.
 */
LMI.checkValue = function(obj, val) {
    for (var i in obj){
        if (obj[i] === val)
        return true;
    }
    return false;
};

/**
 * Add # to the value if the specified parameter does not start with #.
 * @param {string} val String to be tested.
 * @return {string} string start with #.
 */
LMI.addHashmark = function(val) {
    if (!LMI.isString(val)) {
        return null;
    };
    var length = val.length, result = val;
    if (length !== 0 && val[0] !== '#') {
        result = '#' + val;
    }
    return result;
};

/**
 * Generates a random unique id. (e.g. toc86x, bc2s7g, 46bld8...etc).
 * @return {string} unique id.
 */
LMI.randomId = function() {
    return Math.floor(Math.random() * 2147483648).toString(36);
};

/**
 * Converts a number to hexadecimal form.
 * @param {Number} val Numeric value to convert
 * @return {string} Hex form of the specified number.
 */
LMI.num2hex = function(val) {
    return Number(val).toString(16);
};
/**
 * Converts a hex number to decimal value.
 * @param {string} val Hex number to convert.
 * @return {Number} Numeric value of the hex number.
 */
LMI.hex2num = function(val) {
    return parseInt(val, 16);
};
/**
 * Prevents event bubbling or propagation. CancelBubble is supported only by IE.
 * e.stopPropagation works only in FireFox.
 * @param {Event} e Event object.
 */
LMI.stopEvent = function(e) {
    if (!e) {
        var e = window.event;   // for IE;
    }

    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;      // e.stopPropagation()
    }

    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;      // e.preventDefault()
    }

};
/**
 * Returns the frames count.
 */
LMI.frameLevelCount = function() {
    var _window = window,
        level = 0;
    while (_window.parent.location.href != _window.location.href) {
        _window = _window.parent;
        level++;
    }
    return level;
};

LMI.getCharCode = function (e) {
    return e.keyCode ? e.keyCode : e.which;
};

