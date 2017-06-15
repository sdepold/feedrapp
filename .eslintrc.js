module.exports = {
    "extends": "airbnb-base",
    "plugins": [
      "import"
    ],
    "rules": {
      "no-underscore-dangle": 0,
      "class-methods-use-this": 0,
      "comma-dangle": ["error", "never"],
      "arrow-parens": ["error", "always"],
      "func-names": 0
    },
    "globals": {
      "it": true,
      "describe": true,
      "before": true,
      "beforeEach": true,
      "after": true,
      "afterEach": true
    }
};
