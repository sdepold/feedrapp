Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var lodashDecorators = (function () {
  function lodashDecorator$1 $2
    _classCallCheck(this, lodashDecorators);

    this.msg = 'hey!';
  }

  _createClass(lodashDecorators, [{
    key: 'mainFn',
    value: function mainF$1 $2
      return this.msg;
    }
  }]);

  return lodashDecorators;
})();

exports['default'] = lodashDecorators;
module.exports = exports['default'];