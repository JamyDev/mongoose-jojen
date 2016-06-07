# mongoose-jojen

Extends a Mongoose model to do extended validation using [Jojen](https://github.com/WatchBeam/jojen).

Validation runs prior to Mongooses validation. For each field in the model you defile a `joRule` which will be combined and used for validation.

## Installation

`npm install mongoose-jojen --save`

## Setup

```javascript
const jojenPlugin = require('mongoose-jojen');
const mongoose = require('mongoose');

// Apply to all Schema's
mongoose.plugin(scopesPlugin);

// Apply to one schema
schema.plugin(scopesPlugin);
```

## Usage

```javascript
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        joRule: Jo.string().min(3).max(12),
    },
    password: {
        type: String,
        joRule: Jo.string().min(8),
    },
    email: {
        type: String,
        joRule: Jo.string().email(),
    },
    balance: {
        type: Number,
        joRule: Jo.number().min(0),
    },
});

const User = mongoose.model('User', UserSchema);

// Validate an instance
user.validate()
.then(() => {
    // Success
}).catch(err => {
    // Validation failed
    // err instanceof ValidationError
    // err.details == array with details
});
```

## License

MIT