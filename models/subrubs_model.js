import mongoose from "mongoose";

const suburbschema = mongoose.Schema({
  ssc_code: {
    type: Number,
    required: true,
  },
  suburb: {
    type: String,
    required: true,
  },
  urban_area: {
    type: String,
  },
  postcode: {},
  state: {
    required: true,
    type: String,
  },
  state_name: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
  local_goverment_area: {
    type: String,
    required: true,
  },
  statistic_area: {
    type: String,
    required: true,
  },
  elevation: {
    type: Number,
    required: true,
  },
  population: {
    type: Number,
    required: true,
  },
  median_income: {
    type: Number,
    required: true,
  },
  sqkm: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
});

export const Suburbs = mongoose.model("suburb", suburbschema);
