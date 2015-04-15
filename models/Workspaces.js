var mongoose = require('mongoose');

var WorkspaceSchema = new mongoose.Schema({
    name: String,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    members: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        role: String
    }]
});

mongoose.model('Workspace', WorkspaceSchema);

