const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {
        filename: {
            type: String,
            default: "defaultImage",
        },
        url: {
            type: String,
            default: "https://media.istockphoto.com/id/506903162/photo/luxurious-villa-with-pool.jpg?s=612x612&w=0&k=20&c=Ek2P0DQ9nHQero4m9mdDyCVMVq3TLnXigxNPcZbgX2E=",
            set: (v) => v === "" ? "https://media.istockphoto.com/id/506903162/photo/luxurious-villa-with-pool.jpg?s=612x612&w=0&k=20&c=Ek2P0DQ9nHQero4m9mdDyCVMVq3TLnXigxNPcZbgX2E=" : v,
        }
    },

    price: String,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
