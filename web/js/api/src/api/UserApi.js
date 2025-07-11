/**
 * YAUSMA User API - Browser Compatible
 * Converted from ES6 class to browser-compatible JavaScript
 * 
 * The version of the OpenAPI document: 0.1.0
 * 
 * NOTE: This was auto generated by OpenAPI Generator and converted for browser compatibility.
 * https://openapi-generator.tech
 */

/**
 * User API for handling authentication and user management
 * @param {Object} apiClient - API client instance for making HTTP requests
 */
function UserApi(apiClient) {
    this.apiClient = apiClient || (typeof ApiClient !== 'undefined' ? ApiClient.instance : null);
    
    if (!this.apiClient) {
        throw new Error('UserApi requires an ApiClient instance');
    }
}


/**
 * Callback function to receive the result of the callDelete operation.
 * @param {String} error Error message, if any.
 * @param {String} data The data returned by the service call.
 * @param {String} response The complete HTTP response.
 */

/**
 * Delete user account
 * @param {Function} callback The callback function, accepting three arguments: error, data, response
 */
UserApi.prototype.callDelete = function(callback) {
    var postBody = null;
    var pathParams = {};
    var queryParams = {};
    var headerParams = {};
    var formParams = {};

    var authNames = [];
    var contentTypes = [];
    var accepts = ['text/plain'];
    var returnType = 'String';
    
    return this.apiClient.callApi(
        '/api/user/delete', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
    );
};

/**
 * Callback function to receive the result of the login operation.
 * @param {String} error Error message, if any.
 * @param data This operation does not return a value.
 * @param {String} response The complete HTTP response.
 */

/**
 * User login
 * @param {Object} userCredentials User credentials object with email and password
 * @param {Function} callback The callback function, accepting three arguments: error, data, response
 */
UserApi.prototype.login = function(userCredentials, callback) {
    var postBody = userCredentials;
    
    // verify the required parameter 'userCredentials' is set
    if (userCredentials === undefined || userCredentials === null) {
        throw new Error("Missing the required parameter 'userCredentials' when calling login");
    }

    var pathParams = {};
    var queryParams = {};
    var headerParams = {};
    var formParams = {};

    var authNames = [];
    var contentTypes = ['application/json'];
    var accepts = [];
    var returnType = null;
    
    return this.apiClient.callApi(
        '/api/user/login', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
    );
};

/**
 * Callback function to receive the result of the signup operation.
 * @param {String} error Error message, if any.
 * @param data This operation does not return a value.
 * @param {String} response The complete HTTP response.
 */

/**
 * User signup
 * @param {Object} userCredentials User credentials object with email and password
 * @param {Function} callback The callback function, accepting three arguments: error, data, response
 */
UserApi.prototype.signup = function(userCredentials, callback) {
    var postBody = userCredentials;
    
    // verify the required parameter 'userCredentials' is set
    if (userCredentials === undefined || userCredentials === null) {
        throw new Error("Missing the required parameter 'userCredentials' when calling signup");
    }

    var pathParams = {};
    var queryParams = {};
    var headerParams = {};
    var formParams = {};

    var authNames = [];
    var contentTypes = ['application/json'];
    var accepts = [];
    var returnType = null;
    
    return this.apiClient.callApi(
        '/api/user/signup', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
    );
};

// Make available globally
if (typeof window !== 'undefined') {
    window.UserApi = UserApi;
}
