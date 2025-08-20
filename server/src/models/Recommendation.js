const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  ranking: {
    type: Number,
    min: 1
  },
  fitScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  reasons: {
    type: String,
    required: true
  },
  programs: [String],
  tuitionRange: {
    min: Number,
    max: Number
  },
  acceptanceRate: {
    type: Number,
    min: 0,
    max: 100
  },
  website: String,
  requirements: {
    minGPA: Number,
    minSAT: Number,
    minTOEFL: Number,
    minIELTS: Number
  }
});

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  preferencesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Preference',
    required: true
  },
  universities: [universitySchema],
  aiResponse: {
    type: String,
    required: function() {
      return this.status === 'completed';
    },
    default: ''
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  metadata: {
    processingTime: Number,
    apiCallsUsed: Number,
    version: {
      type: String,
      default: '1.0'
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
recommendationSchema.index({ userId: 1, createdAt: -1 });
recommendationSchema.index({ preferencesId: 1 });
recommendationSchema.index({ status: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
