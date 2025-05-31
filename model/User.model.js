import mongoose, { Schema, models, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  authMethod: {
    type: String,
    default: "local",
    enum: ["local", "google", "apple"],
  },
  authMethodId: {
    type: String,
    description: "The id of the user in the auth provider",
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  next();
});

UserSchema.statics.findByEmail = async function (email) {
  return await this.findOne({ email });
};

UserSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

UserSchema.methods.generateAuthToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

UserSchema.methods.isEmailVerified = async function () {
  return this.emailVerified;
};

UserSchema.plugin(mongoosePaginate);
const UserModel = models.User || model("User", UserSchema);

export default UserModel;
