'use strict';

const _ = require('lodash');
const Jo = require('jojen');

module.exports = function mongooseJojen(schema, opts) {

    const ruleSet = {};

    const tree = schema.tree;
    for (let key in tree) {
        if (tree.hasOwnProperty(key)) {
            if (tree[key].hasOwnProperty('joRule')) {
                ruleSet[key] = tree[key].joRule;
            }
            else {
                ruleSet[key] = Jo.any();
            }
        }
    }

    const validator = Jo.object().keys(ruleSet);

    schema.pre('validate', function (next) {
        // console.log(validator.getRules())
        Jo.validate(this.toObject(), validator, (err, result) => {
            if (err) {
                return next(err);
            }
            return next();
        });
    });
};
