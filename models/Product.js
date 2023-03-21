import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: [
      'Electronics',
      'Food',
      'Groceries',
      'Health'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  shop: {
    type: mongoose.Schema.ObjectId,
    ref: 'Shop',
    required: true
  },
},
  {
    toJSON: {
      virtuals: true,
      // Hide the _id field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    },
    toObject: {
      virtuals: true,
      // Hide the _id field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  });

// Static method to get the average revenue (price) of products in a specific shop
ProductSchema.statics.getAverageRevenue = async function (shopId) {
  // Use MongoDB aggregation to calculate the average product price
  const obj = await this.aggregate([
    {
      // $match stage filters documents to only include those with a matching shopId
      $match: { shop: shopId }
    },
    {
      // $group stage groups the documents by the shop field and calculates the average price
      $group: {
        _id: '$shop',
        avgRevenue: { $avg: '$price' }
      }
    }
  ]);

  // Update the shop's avgRevenue field with the calculated value
  try {
    // Use findByIdAndUpdate to update the Shop document with the new average revenue
    await this.model('Shop').findByIdAndUpdate(shopId, {
      // Round the average revenue to the nearest 10 using Math.ceil
      avgRevenue: Math.ceil(obj[0].avgRevenue / 10) * 10
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRevenue after save
ProductSchema.post('save', function () {
  this.constructor.getAverageRevenue(this.shop);
});

// Call getAverageRevenue before remove
ProductSchema.pre('deleteOne', function () {
  this.constructor.getAverageCost(this.shop);
});

export default mongoose.model('Product', ProductSchema);