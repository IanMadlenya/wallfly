/**
 * Api Module
 * The Api module contains all interactions with the server. If you want to
 * make network requests to the server, then it should be a method in the Api
 * module that initiates the request.
 */
var axios = require('axios');
var config = require('./config.js');
var User = require('./User.js');
let host = `${config.server}/api`;
if (__DEV__) {
  host = config.server; // remove /api namespace for local server calls.
}
let userId = User.getUserId(); // current logged in user. Used in url creation.

let Api = {
  // Create a new account
  createAccount({ data={}, callback=()=>{} }) {
    axios.post(`${host}/users`, data, {
      withCredentials: true,
      timeout: 4000,
    })
    .then((response) => { // 2xx response
      callback(null, response);
    })
    .catch((response) => { // Non 2xx response
      let error = response.data.errorMessage;
      console.log(`Error in Api.createAccount(): ${error}`);

      callback(new Error(error), response);
    });
  },

  // Log a user in
  login({ data={}, callback=()=>{} }) {
    axios.post(`${host}/login`, data, {
      withCredentials: true,
      timeout: 4000,
    })
    .then((response) => { // 2xx response
      userId = response.data.id;
      callback(null, response);
    })
    .catch((response) => { // Non 2xx response received.
      let error = response.data.errorMessage;
      console.log(`Error in Api.login(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Logout a user
  logout({ callback=()=>{} }) {
    axios.get(`${host}/logout`, {
      withCredentials: true
    })
    .then((response) => { // 2xx response
      callback(null, response);
    })
    .catch((response) => { // Non 2xx response received.
      let error = response.data.errorMessage;
      console.log(`Error in Api.logout(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Fetches a user model for the current user
  getUser({ callback = () => {} } = {}) {
    userId = User.getUserId();
    axios.get(`${host}/users/${userId}`, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.getUser(): ${error}`);

      callback(new Error(error), response);
    });
  },

  // Update the user model
  updateUser({ data={}, callback = () => {} } = {}) {
    userId = User.getUserId();
    axios.put(`${host}/users/${userId}`, data, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.updateUser(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Fetch calendar events for the current user.
  getEvents({ callback = () => {} } = {}) {
    userId = User.getUserId();
    axios.get(`${host}/users/${userId}/events`, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.getEvents(): ${error}`);

      callback(new Error(error), response);
    });
  },

  // Fetch messages for the current user.
  getMessages({ callback = () => {} } = {}) {
    userId = User.getUserId();
    axios.get(`${host}/users/${userId}/messages`, {
        withCredentials: true, // send cookies for cross-site requests
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.getMessages(): ${error}`);

      callback(new Error(error), response);
    });
  },

  // Post new messages from the current user
  postMessages({ data={}, callback=()=>{} }) {
    userId = User.getUserId();
    data.sender = userId;
    axios.post(`${host}/users/${userId}/messages`, data, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.postMessages(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Fetch property inspection details
  getInspections({ callback=()=>{} }) {
    userId = User.getUserId();
    axios.get(`${host}/users/${userId}/inspections`, {
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getInspections(): ${error}`);
        callback(new Error(error), response);
      });
  },

  // Fetch list of past rent payments
  getPayments({ callback=()=>{} }) {
    userId = User.getUserId();
    axios.get(`${host}/users/${userId}/payments`, {
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getPayments(): ${error}`);
        callback(new Error(error), response);
      });
  },

  // Add a new payment
  addPayment({ data={}, callback=()=>{} }) {
    userId = User.getUserId();
    data.sender = userId;
    axios.post(`${host}/users/${userId}/payments`, data, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.addPayment(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Fetch list of repair requests
  getRepairRequests({ callback=()=>{} }) {
    userId = User.getUserId();
    axios.get(`${host}/users/${userId}/repairs`, {
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getRepairRequests(): ${error}`);
        callback(new Error(error), response);
      });
  },

  // Add a new repair request
  addRepairRequest({ data={}, callback=()=>{} }) {
    userId = User.getUserId();
    axios.post(`${host}/users/${userId}/repairs`, data, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.addRepairRequest(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Fetch information for a given tenants property
  getUserPropertyDetails({ callback=()=>{} }) {
    userId = User.getUserId();
    axios.get(`${host}/users/${userId}/property`, {
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getUserPropertyDetails(): ${error}`);
        callback(new Error(error), response);
      });
  },

  // ---------------------------------------------------------------------------
  // Owner / Agent endpoints
  // ---------------------------------------------------------------------------

  // Fetch a list of properties
  getPropertyList({ callback=()=>{} }) {
    userId = User.getUserId();

    axios.get(`${host}/properties`, {
        params: {
          userId: userId,
        },
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getPropertyList(): ${error}`);
        callback(new Error(error), response);
      });
  },

  // Add a new property
  addNewProperty({ data={}, callback=()=>{} }) {
    userId = User.getUserId();

    axios.post(`${host}/properties`, data, {
      params: {
        userId: userId,
      },
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.addNewProperty(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Fetch property details for the specified property
  getPropertyDetails({ propertyId, callback=()=>{} }) {
    axios.get(`${host}/properties/${propertyId}/details`, {
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getPropertyDetails(): ${error}`);
        callback(new Error(error), response);
      });
  },

  // Update details for the specified property
  updatePropertyDetails({ data={}, callback=()=>{} }) {
    axios.post(`${host}/properties/${data.propertyId}/details`, data, {
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getPropertyDetails(): ${error}`);
        callback(new Error(error), response);
      });
  },

  // Fetches payments for a particular property
  getPropertyPayments({ propertyId, callback=()=>{} }) {
    axios.get(`${host}/properties/${propertyId}/payments`, {
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getPropertyPayments(): ${error}`);
        callback(new Error(error), response);
      });
  },

  // Fetches a list of property repair requests
  getPropertyRepairRequests({ propertyId, callback=()=>{} }) {
    axios.get(`${host}/properties/${propertyId}/repairRequests`, {
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getPropertyRepairRequests(): ${error}`);
        callback(new Error(error), response);
      });
  },

  // Updates a specific repair request
  updateRepairRequest({ data={}, callback=()=>{} }) {
    axios.put(`${host}/properties/${data.propertyId}/repairRequests`, data, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.updateRepairRequest(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Fetches a properties inspection reports
  getPropertyInspectionReports({ propertyId, callback=()=>{} }) {
    axios.get(`${host}/properties/${propertyId}/inspectionReports`, {
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getPropertyInspectionReports(): ${error}`);
        callback(new Error(error), response);
      });
  },

  // Adds a new inspection report for a property
  addPropertyInspectionReports({ data={}, callback=()=>{} }) {
    axios.post(`${host}/properties/${data.propertyId}/inspectionReports`, data, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.addPropertyInspectionReports(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Fetches the events for a given property
  getPropertyCalendarEvents({ propertyId, callback=()=>{} }) {
    axios.get(`${host}/properties/${propertyId}/calendarEvents`, {
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getPropertyCalendarEvents(): ${error}`);
        callback(new Error(error), response);
      });
  },

  // Adds a new event for a given property
  addPropertyCalendarEvents({ data={}, callback=()=>{} }) {
    axios.post(`${host}/properties/${data.propertyId}/calendarEvents`, data, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.addPropertyCalendarEvents(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Fetches the contacts details for a given property.
  getPropertyContacts({ propertyId, callback=()=>{} }) {
    axios.get(`${host}/properties/${propertyId}/contacts`, {
        withCredentials: true, // send cookies for cross-site requests
      })
      .then((response) => {
        callback(null, response);
      })
      .catch((response) => {
        let error = response.data.errorMessage;
        console.log(`Error in Api.getPropertyContacts(): ${error}`);
        callback(new Error(error), response);
      });
  },


  // ---------------------------------------------------------------------------
  // Messages Resource Endpoints
  // ---------------------------------------------------------------------------
  /**
   * Returns the 20 most recent messages sent to the authenticated user from
   * the specified senderId.
   * Parameters:
   *  - senderId: the senderId of the messages to fetch.
   *  - count(optional): number of messages to fetch
   *  - offset(optional): offset in the message history (allow for paging)
   */
  fetchMessages({ params={}, callback = ()=>{} } = {}) {
    axios.get(`${host}/messages`, {
      params: params,
      withCredentials: true, // send cookies for cross-site requests
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.fetchMessages(): ${error}`);
      callback(new Error(error), response);
    });
  },

  /**
   * Sends a new message to the specified user from the authenticated user.
   * Parameters:
   *   - partnerId: the id of recipient of the message.
   *   - message: Message to send
   */
  newMessage({ params={}, callback=()=>{} }) {
    axios.post(`${host}/messages`, params, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.postMessages(): ${error}`);
      callback(new Error(error), response);
    });
  },


  // ---------------------------------------------------------------------------
  // Events Resource Endpoints
  // ---------------------------------------------------------------------------
  // Fetch all events
  getAllEvents({ params={}, callback=()=>{} }) {
    axios.get(`${host}/events`, {
      params: params,
      withCredentials: true, // send cookies for cross-site requests
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.getAllEvents(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Update a given event
  updateEvent({ data={}, callback=()=>{} }) {
    axios.put(`${host}/events/${data.id}`, data, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.updateEvent(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Delete a given event
  deleteEvent({ eventId, callback=()=>{} }) {
    axios.delete(`${host}/events/${eventId}`, {
      withCredentials: true, // send cookies for cross-site requests
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.deleteEvent(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // ---------------------------------------------------------------------------
  // Repair Requests Resource Endpoints
  // ---------------------------------------------------------------------------
  // Fetch all repair requests
  getAllRepairRequests({ params={}, callback=()=>{} }) {
    axios.get(`${host}/repairRequests`, {
      params: params,
      withCredentials: true, // send cookies for cross-site requests
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.getAllRepairRequests(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Update the given repair request
  putRepairRequest({ data={}, callback=()=>{} }) {
    axios.put(`${host}/repairRequests/${data.id}`, data, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.putRepairRequest(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // ---------------------------------------------------------------------------
  // Payments Resource Endpoints
  // ---------------------------------------------------------------------------
  // Fetch all payments
  getAllPayments({ params={}, callback=()=>{} }) {
    axios.get(`${host}/payments`, {
      params: params,
      withCredentials: true, // send cookies for cross-site requests
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.getAllPayments(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Add a new payment
  postPayment({ payload={}, callback=()=>{} }) {
    axios.post(`${host}/payments`, payload, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.postPayment(): ${error}`);
      callback(new Error(error), response);
    });
  },

  // Update a payment
  putPayment({ id, payload={}, callback=()=>{} }) {
    axios.put(`${host}/payments/${id}`, payload, {
      withCredentials: true
    })
    .then((response) => {
      callback(null, response);
    })
    .catch((response) => {
      let error = response.data.errorMessage;
      console.log(`Error in Api.putPayment(): ${error}`);
      callback(new Error(error), response);
    });
  },

};




module.exports = Api;
