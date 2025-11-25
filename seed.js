const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const User = require("./models/user.js");

const MONGO_URL = "mongodb://localhost:27017/Wanderlust"; 

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const seedListings = [
  {
    title: "Cozy Mountain Cabin",
    description: "Beautiful mountain cabin with stunning views and modern amenities",
    price: 5000,
    location: "Himachal Pradesh",
    country: "India",
    category: "mountains",
    image: {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      filename: "mountain1.jpg"
    }
  },
  {
    title: "Alpine Mountain Resort",
    description: "Luxury mountain resort with spa and fine dining",
    price: 8000,
    location: "Uttarakhand",
    country: "India",
    category: "mountains",
    image: {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      filename: "mountain2.jpg"
    }
  },
  {
    title: "Modern City Apartment",
    description: "Spacious apartment in the heart of the city with city views",
    price: 4000,
    location: "Mumbai",
    country: "India",
    category: "cities",
    image: {
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      filename: "city1.jpg"
    }
  },
  {
    title: "Downtown Luxury Loft",
    description: "Modern loft with rooftop access and panoramic city views",
    price: 6000,
    location: "Delhi",
    country: "India",
    category: "cities",
    image: {
      url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      filename: "city2.jpg"
    }
  },
  {
    title: "Arctic Ice Lodge",
    description: "Experience the Northern Lights from this cozy ice lodge",
    price: 12000,
    location: "Ladakh",
    country: "India",
    category: "arctic",
    image: {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      filename: "arctic1.jpg"
    }
  },
  {
    title: "Polar Aurora Cabin",
    description: "Watch the midnight sun and northern lights from this remote cabin",
    price: 10000,
    location: "Spiti Valley",
    country: "India",
    category: "arctic",
    image: {
      url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
      filename: "arctic2.jpg"
    }
  },
  {
    title: "Organic Farm Stay",
    description: "Work on an organic farm and enjoy farm-to-table meals",
    price: 2500,
    location: "Punjab",
    country: "India",
    category: "farms",
    image: {
      url: "https://images.unsplash.com/photo-1500382017468-7049fcc2121d?w=800",
      filename: "farm1.jpg"
    }
  },
  {
    title: "Heritage Farm Resort",
    description: "Traditional farmhouse with modern comforts and countryside views",
    price: 3500,
    location: "Rajasthan",
    country: "India",
    category: "farms",
    image: {
      url: "https://images.unsplash.com/photo-1643081332283-dd92fc20c0b2?w=800",
      filename: "farm2.jpg"
    }
  },
  {
    title: "Beachfront Villa",
    description: "Luxury villa with private beach access and infinity pool",
    price: 7000,
    location: "Goa",
    country: "India",
    category: "Beach",
    image: {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      filename: "beach1.jpg"
    }
  },
  {
    title: "Tropical Beach House",
    description: "Charming beach house with ocean views and direct beach access",
    price: 5500,
    location: "Kerala",
    country: "India",
    category: "Beach",
    image: {
      url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
      filename: "beach2.jpg"
    }
  },
  {
    title: "Cozy Studio Room",
    description: "Comfortable studio apartment perfect for solo travelers",
    price: 1500,
    location: "Bangalore",
    country: "India",
    category: "Rooms",
    image: {
      url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      filename: "room1.jpg"
    }
  },
  {
    title: "Luxury Hotel Room",
    description: "5-star hotel room with premium amenities and city views",
    price: 4500,
    location: "Chennai",
    country: "India",
    category: "Rooms",
    image: {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      filename: "room2.jpg"
    }
  },
  {
    title: "Wildlife Safari Lodge",
    description: "Experience wildlife like never before in this safari lodge",
    price: 6500,
    location: "Madhya Pradesh",
    country: "India",
    category: "Wildlife",
    image: {
      url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
      filename: "wildlife1.jpg"
    }
  },
  {
    title: "Jungle Eco Camp",
    description: "Sustainable eco-camp in the heart of the forest",
    price: 3000,
    location: "Assam",
    country: "India",
    category: "Wildlife",
    image: {
      url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
      filename: "wildlife2.jpg"
    }
  },
  {
    title: "Ancient Fort Mansion",
    description: "Stay in a historic fort converted into a luxurious mansion",
    price: 7500,
    location: "Rajasthan",
    country: "India",
    category: "Historical",
    image: {
      url: "https://images.unsplash.com/photo-1566683246869-cc14a01c0dfa?w=800",
      filename: "historical1.jpg"
    }
  },
  {
    title: "Heritage Palace Stay",
    description: "Experience royalty in this beautifully restored heritage palace",
    price: 8500,
    location: "Rajasthan",
    country: "India",
    category: "Historical",
    image: {
      url: "https://images.unsplash.com/photo-1573929623966-8b85ee6b773f?w=800",
      filename: "historical2.jpg"
    }
  }
];

async function seedDB() {
  try {
    await Listing.deleteMany({});
    console.log("Cleared existing listings");
    
    await Listing.insertMany(seedListings);
    console.log("Database seeded with 16 sample listings");
    mongoose.connection.close();
  } catch (err) {
    console.log("Error seeding database:", err);
    mongoose.connection.close();
  }
}

seedDB();