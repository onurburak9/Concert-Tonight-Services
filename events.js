'use strict'
const queryString = require('query-string');
const rp = require('request-promise');
const middy = require('middy');
const { cors } = require('middy/middlewares');
const API_KEY = "dMDG9fX9tbrqqXgL"
const BASE_URL = "http://api.eventful.com/json/events/search"

const errorHandling = response => {
  const { statusCode, error } = response
  return ({ statusCode, error: error.fault ? { type: error.fault.type, message: error.fault.message } : { ...error } })
}

const execute = async options => {
  try {
    return await rp(options);
  } catch (e) {
    return errorHandling(e);
  }
};

const listConcerts = async (event, context, callback) => {

  try {
    context.callbackWaitsForEmptyEventLoop = false; //
    const { location, within } = event.body
    const params = {
      app_key: API_KEY,
      date: "TODAY",
      category: "music",
      page_size: 250,
      location,
    }
    if (within !== undefined)
      params.within = within
    const stringified = queryString.stringify(params);
    console.log("Stringified", stringified)

    const listOptions = {
      method: 'GET',
      uri: `${BASE_URL}?${stringified}`,
      json: true,
    };
    const response = await execute(listOptions);
    callback(null, response)
  } catch (error) {
    console.log(error);
    callback(error)
  }

}

// function isLatitude(lat) {
//     return isFinite(lat) && Math.abs(lat) <= 90;
// }

// function isLongitude(lng) {
//     return isFinite(lng) && Math.abs(lng) <= 180;
// }

module.exports.listConcerts = middy(listConcerts).use(cors());
