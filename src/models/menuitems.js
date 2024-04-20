import mongoose, { model, models, Schema } from "mongoose";

const extraPriceSchema = new Schema({
    name: String,
    price: Number,
});

const MenuItemSchema = new Schema({
    itemName: { type: String },
    itemDesc: { type: String },
    image: {type: String},
    selectedCategory: {type: mongoose.Types.ObjectId},
    itemBasePrice: { type: Number },
    itemSize : {type:[extraPriceSchema]},
    extraIngredients : {type: [extraPriceSchema]}
}, { timestamps: true });

export const MenuItem = models?.MenuItem || model('MenuItem', MenuItemSchema);