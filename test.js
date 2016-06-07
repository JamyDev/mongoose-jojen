'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const Jo = require('jojen');

const plugin = require('./index.js');

describe('Normal behaviour', () => {
    const User = mongoose.model('User', {
        username: {
            type: String,
            joRule: Jo.required().string().min(4).max(10),
        },
        password: {
            type: String,
            joRule: Jo.required().string().min(8),
        },
        email: {
            type: String,
            joRule: Jo.required().string().email(),
        },
        obj: {
            type: mongoose.SchemaTypes.Mixed,
            joRule: Jo.any(),
        }
    });
    User.schema.plugin(plugin);

    it('should validate', () => {
        // set spy on Jo.validate
        const stub = sinon.stub(Jo, 'validate', (data, schema, cb) => cb(null, {}));

        const user = new User({
            username: 'asdfg',
            password: '12345678',
            email: 'user@example.com',
            obj: {},
        });

        return user.validate()
        .then(() => {
            expect(stub.calledOnce).to.equal(true);
            Jo.validate.restore();
        });
    });

    it('should return an error when validating', () => {
        const user = new User({
            username: 'testistoolong12345',
            password: 'pass',
            email: 'userexample.com',
            obj: {
                test: true
            }
        });

        const defer = Promise.defer();

        user.validate()
        .then(() => {
            defer.reject();
        })
        .catch(err => {
            // console.log(err, err.isJoi)
            expect(err.isJoi).to.equal(true);
            defer.resolve();
        });

        return defer.promise;
    });
});