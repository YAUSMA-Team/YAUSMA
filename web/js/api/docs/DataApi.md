# Api.DataApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getMarketOverview**](DataApi.md#getMarketOverview) | **GET** /api/data/market-overview | 
[**getNews**](DataApi.md#getNews) | **GET** /api/data/news | 



## getMarketOverview

> [MarketOverviewItem] getMarketOverview()



### Example

```javascript
import Api from 'api';

let apiInstance = new Api.DataApi();
apiInstance.getMarketOverview((error, data, response) => {
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

[**[MarketOverviewItem]**](MarketOverviewItem.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getNews

> [NewsItem] getNews(opts)



### Example

```javascript
import Api from 'api';

let apiInstance = new Api.DataApi();
let opts = {
  'ticker': "ticker_example" // String | 
};
apiInstance.getNews(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ticker** | **String**|  | [optional] 

### Return type

[**[NewsItem]**](NewsItem.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

