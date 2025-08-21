const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  academicInterests: {
    type: [String],
    required: [true, 'Academic interests are required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one academic interest is required'
    }
  },
  preferredCountries: {
    type: [String],
    required: [true, 'Preferred countries are required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one preferred country is required'
    }
  },
  budgetRange: {
    min: {
      type: Number,
      required: true,
      min: [0, 'Minimum budget cannot be negative']
    },
    max: {
      type: Number,
      required: true,
      min: [0, 'Maximum budget cannot be negative']
    }
  },
  testScores: {
    sat: {
      type: Number,
      min: [400, 'SAT score must be at least 400'],
      max: [1600, 'SAT score cannot exceed 1600']
    },
    toefl: {
      type: Number,
      min: [0, 'TOEFL score cannot be negative'],
      max: [120, 'TOEFL score cannot exceed 120']
    },
    ielts: {
      type: Number,
      min: [0, 'IELTS score cannot be negative'],
      max: [9, 'IELTS score cannot exceed 9']
    },
    gre: {
      type: Number,
      min: [260, 'GRE score must be at least 260'],
      max: [340, 'GRE score cannot exceed 340']
    }
  },
  studyLevel: {
    type: String,
    required: true,
    enum: ['undergraduate', 'graduate', 'doctorate', 'certificate'],
    default: 'undergraduate'
  },
  preferredUniversitySize: {
    type: String,
    enum: ['small', 'medium', 'large', 'any'],
    default: 'any'
  },
  additionalRequirements: {
    type: String,
    maxlength: [500, 'Additional requirements cannot exceed 500 characters']
  },
  preferencesDescription: {
    type: String,
    default: '',
    maxlength: [1000, 'Preferences description cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for faster queries
preferenceSchema.index({ userId: 1 });
preferenceSchema.index({ createdAt: -1 });

// Pre-save middleware to validate budget range
preferenceSchema.pre('save', function(next) {
  if (this.budgetRange && this.budgetRange.min !== undefined && this.budgetRange.max !== undefined) {
    if (this.budgetRange.max < this.budgetRange.min) {
      const error = new Error('Maximum budget must be greater than or equal to minimum budget');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Pre-findOneAndUpdate middleware to validate budget range during updates
preferenceSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.budgetRange) {
    const budgetRange = update.$set.budgetRange;
    if (budgetRange.min !== undefined && budgetRange.max !== undefined) {
      if (budgetRange.max < budgetRange.min) {
        const error = new Error('Maximum budget must be greater than or equal to minimum budget');
        error.name = 'ValidationError';
        return next(error);
      }
    }
  }
  next();
});

module.exports = mongoose.model('Preference', preferenceSchema);
