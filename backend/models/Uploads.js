import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  uploadTime: {
    type: Date,
    default: Date.now,
  },
  userEmail: {
    type: String,
    required: true,
  },
  previewRows: { type: Array, default: [] }
});

const Upload = mongoose.model("Upload", uploadSchema);
export default Upload;
