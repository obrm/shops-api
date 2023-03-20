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


// Static method to get avg of products cost in the shop
ProductSchema.statics.getAverageRevenue = async function (shopId) {
  const obj = await this.aggregate([
    {
      $match: { shop: shopId }
    },
    {
      $group: {
        _id: '$shop',
        avgRevenue: { $avg: '$price' }
      }
    }
  ]);

  try {
    await this.model('Shop').findByIdAndUpdate(shopId, {
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