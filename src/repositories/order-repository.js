'use strict';

const mongoose = require("mongoose");
const Order = mongoose.model("Order");

exports.get = async() => {
    let res = await Order
        .find({}, "number status")
        .populate("customer", "name")
        .populate("items.product", "title");
    return res;
}

exports.create = async(data) => {
    let order = new Order(data);
    await order.save();
}