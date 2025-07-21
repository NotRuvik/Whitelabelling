const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    // Multi-tenancy: Which organization received this donation?
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    // Who made the donation? Optional because of anonymous donors.
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    // What was the donation for?
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // This allows Mongoose to dynamically reference either the Missionary or Cause model
        refPath: 'targetType',
    },
    targetType: {
        type: String,
        required: true,
        enum: ['Missionary', 'Cause'], // The models that can be donated to
    },
     donationType: {
        type: String,
        enum: ['one-time', 'monthly'],
        default: 'one-time',
    },
    // Payment Details
    stripeCheckoutSessionId: {
        type: String,
        required: false,
        unique: true,
         sparse: true,
    },
     stripePaymentIntentId: {
        type: String,
        required: true,
        unique: true,
    },
    stripeSubscriptionId: { 
        type: String,
        required: false, 
    },
    amount: { type: Number, required: true }, 
    tip: { type: Number, default: 0 }, 
    fee: { type: Number, default: 0 },    
    totalAmount: { type: Number, required: true }, 
    currency: { type: String, default: 'usd' },
    message: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed'],
        default: 'pending',
    },
    isAnonymous: { type: Boolean, default: false },
    donorName: { type: String }, 
    donorEmail: { type: String }, 
}, { timestamps: true });

// Index for efficient querying
donationSchema.index({ organizationId: 1, status: 1 });
donationSchema.index({ targetId: 1, targetType: 1 });
donationSchema.index({ stripeSubscriptionId: 1 });

module.exports = mongoose.model('Donation', donationSchema);