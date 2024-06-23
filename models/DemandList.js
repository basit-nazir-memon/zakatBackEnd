const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    originator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    reply: {
        replier: { type: Schema.Types.ObjectId, ref: 'User' },
        reply: { type: String }
    }
});

const DemandListSchema = new Schema({
    PersonId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    Need: { type: String, required: true },
    Reason: { type: String, required: true },
    creationDate: { type: Date, default: Date.now() },
    isApproved: { type: Boolean, default: false },
    approvalDate: { type: Date, default: null},
    viewers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    Comments: [CommentSchema]
});

const DemandList = mongoose.model('DemandList', DemandListSchema);

module.exports = DemandList;
