const mongoose = require('mongoose');

const donationSubscriptionSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType'
    },
    targetType: {
        type: String,
        required: true,
        enum: ['Missionary', 'Cause']//enum: ['missionary', 'cause'] 
    },
    stripeSubscriptionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'incomplete', 'past_due', 'canceled', 'unpaid'],
        required: true,
    },
    currentPeriodEnd: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true
});

donationSubscriptionSchema.index({ donorId: 1 });
// donationSubscriptionSchema.index({ stripeSubscriptionId: 1 });

module.exports = mongoose.model('DonationSubscription', donationSubscriptionSchema);