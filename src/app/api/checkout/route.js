import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { Options } from "../auth/[...nextauth]/route";
import { Order } from "@/models/order";
import { MenuItem } from "@/models/menuitems";
const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
    mongoose.connect(process.env.MONGO_URL);

    const { cartItems, streetAddress, postalCode, phoneNumber, city, country } = await req.json();

    const session = await getServerSession(Options);
    const email = session?.user?.email;
    const order = await Order.create({
        email, streetAddress, postalCode, phoneNumber,city,country, cartItems, paid: false
    });

    const stripeItems = [];
    for (const item of cartItems) {
        const itemName = item.itemName;

        const itemInfo = await MenuItem.findById(item._id);
        let itemPrice = item.itemBasePrice;
        if(item.size){
           const size = itemInfo.itemSize.find(size => size._id.toString() === item.size._id.toString())
           itemPrice += size.price;
        }
        if(item.extras?.length > 0){
            for(const extraThing of item.extras ) {
                const extraInfo = itemInfo.extraIngredients.find(extra => extra._id.toString() === extraThing._id.toString());
                itemPrice += extraInfo.price;
            }
        }


        stripeItems.push({
            quantity: 1,
            price_data: {
                currency: 'USD',
                product_data: {
                    name: itemName,
                },
                unit_amount: itemPrice * 100,
            }
        })
    }


    const stripeSession = await stripe.checkout.sessions.create({
        line_items: stripeItems,
        mode: 'payment',
        customer_email: email,
        success_url: process.env.NEXTAUTH_URL+'orders/'+order._id.toString()+'?clear-cart=1',
        cancel_url: process.env.NEXTAUTH_URL+'cart?canceled=1',
        metadata: {orderId: order._id ? order._id.toString() : 'undefined' },
        payment_intent_data : {
            metadata: {orderId: order._id ? order._id.toString() : 'undefined' }
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: 'Delivery Fee',
                    type: 'fixed_amount',
                    fixed_amount: {amount: 500, currency: 'USD'},  
                }
            }
        ]
    })

    return Response.json(stripeSession.url);

}