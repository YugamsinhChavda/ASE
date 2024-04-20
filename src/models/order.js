import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
    email: { type: String },
    cartItems: Object,
    streetAddress: {type: String},
    postalCode: {type: String},
    phoneNumber: {type: String},
    city: {type: String},
    country: {type: String},
    paid: {type: Boolean, default: false}
},{timestamps: true})

export const Order = models?.Order || model('Order', OrderSchema);