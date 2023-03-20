import mongoose from 'mongoose';
import slugify from 'slugify';

const ShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: [true, 'Shop name already exists'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  slug: String,
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  shopCategory: {
    // Array of strings
    type: [String],
    required: [true, 'Please add a shop category'],
    enum: [
      'Electronics',
      'Food',
      'Groceries',
      'Health',
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be less than 5']
  },
  avgRevenue: Number,
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},
  {
    toJSON: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    },
    toObject: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    },
  });

// Middleware - Create slug from name
ShopSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete products when a shop is deleted
ShopSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  console.log(`Products being removed from shop ${this._id}`);
  await this.model('Product').deleteMany({ shop: this._id });
  next();
});

// Reverse populate with virtuals
ShopSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'shop',
  justOne: false
});

export default mongoose.model('Shop', ShopSchema);