import mongoose from "mongoose";

const subrubSchema = mongoose.Schema({
  ssc_code: {
    type: Number,
  },
  suburb: {
    type: String,
  },
  urban_area: {
    type: String,
  },
  postcode: {
    type: Number,
  },
  state_name: {
    type: String,
  },
  state: {
    type: String,
  },
  type: {
    type: String,
  },
  local_goverment_area: {
    type: String,
  },
  statistic_area: {
    type: String,
  },
});

export const Suburb = mongoose.model("editedSuburbs", subrubSchema);
