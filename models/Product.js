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
  amount: Number,
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

// Static method to get the average revenue (price * amount) of products in a specific shop
ProductSchema.statics.getAverageRevenue = async function (shopId) {
  // Use MongoDB aggregation to calculate the average product revenue
  const obj = await this.aggregate([
    {
      // $match stage filters documents to only include those with a matching shopId
      $match: { shop: shopId }
    },
    {
      // $addFields stage creates a new field 'revenue' by multiplying price and amount
      $addFields: {
        revenue: {
          $multiply: ['$price', '$amount']
        }
      }
    },
    {
      // $group stage groups the documents by the shop field and calculates the average revenue
      $group: {
        _id: '$shop',
        avgRevenue: { $avg: '$revenue' }
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
    // Log any errors that occurred during the update
    console.error(err);
  }
};

// Call getAverageRevenue after save
ProductSchema.post('save', function () {
  this.constructor.getAverageRevenue(this.shop);
});

// Call getAverageRevenue after update
ProductSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await this.model.getAverageRevenue(doc.shop);
  }
});


// Call getAverageRevenue before remove
ProductSchema.pre('deleteOne', function () {
  this.constructor.getAverageRevenue(this.shop);
});

export default mongoose.model('Product', ProductSchema);