const {model, models, Schema } = require("mongoose");
import brcypt from 'bcrypt';

const UserSchema = new Schema({
    name: {type: String},
    email: { type: String, required: true, unique: true },
    password: {
        type: String, required: true, validate: (pass) => {
            if (!pass?.length || pass.length < 5) {
                new Error('password must be atleast 5 characters');
            }
        }
    },
    phoneNumber: {type: String},
    streetAddress: {type: String},
    postalCode: {type: String},
    city: {type: String},
    country: {type: String},
    admin: {type: Boolean, default: false}
},
    { timestamps: true });

UserSchema.post('validate', function(user) {
    const password = user.password;
    const secret = brcypt.genSaltSync(10);
    const EncryptedPassword = brcypt.hashSync(password, secret);
    user.password = EncryptedPassword;
})

export const User = models?.User || model('User', UserSchema)