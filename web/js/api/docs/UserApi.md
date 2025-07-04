# Api.UserApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**callDelete**](UserApi.md#callDelete) | **POST** /api/user/delete | 
[**login**](UserApi.md#login) | **POST** /api/user/login | 
[**signup**](UserApi.md#signup) | **POST** /api/user/signup | 



## callDelete

> String callDelete()



### Example

```javascript
import Api from 'api';

let apiInstance = new Api.UserApi();
apiInstance.callDelete((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: text/plain


## login

> login(userCredentials)



### Example

```javascript
import Api from 'api';

let apiInstance = new Api.UserApi();
let userCredentials = new Api.UserCredentials(); // UserCredentials | 
apiInstance.login(userCredentials, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userCredentials** | [**UserCredentials**](UserCredentials.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined


## signup

> signup(userCredentials)



### Example

```javascript
import Api from 'api';

let apiInstance = new Api.UserApi();
let userCredentials = new Api.UserCredentials(); // UserCredentials | 
apiInstance.signup(userCredentials, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userCredentials** | [**UserCredentials**](UserCredentials.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

