# API Response Standard Documentation

## General Structure

Every API response will consist of the following core properties:

1. **`status`**: A string indicating the outcome of the API request (`"success"` or `"failure"`).
2. **`data`**: The data returned by the API, whose structure can differ based on the request type.
3. **`error`** or **`errors`**: Error details will be included here if the `status` is `"failure"`.

## Successful Responses

### Single Resource

For single-resource responses, the `data` field will contain the resource object:

```json
{
	"status": "success",
	"data": {
		"id": 1,
		"name": "Alice"
	}
}
```

### List of Resources

For multi-resource (list) endpoints, the `data` field should contain an `items` property, which is an array of resource
objects. Additionally, `total` and `next` properties are included:

```json
{
	"status": "success",
	"data": {
		"items": [
			{ "id": 1, "name": "Alice" },
			{ "id": 2, "name": "Bob" }
		],
		"total": 50,
		"next": "url_for_next_page"
	}
}
```

-   **`items`**: An array of resource objects.
-   **`total`**: The total number of available resources, useful for pagination.
-   **`next`**: The URL for the next set of resources in the pagination series.

## Error Responses

### Single Error

When an error is encountered, the `status` field should be `"failure"`, and the `error` field should provide details:

```json
{
	"status": "failure",
	"error": {
		"code": 404,
		"message": "Resource not found"
	}
}
```

### Multiple Errors

When multiple errors need to be reported, the `errors` field should contain an array of error objects:

```json
{
	"status": "failure",
	"errors": [
		{
			"code": 400,
			"message": "Bad Request"
		},
		{
			"code": 401,
			"message": "Unauthorized"
		}
	]
}
```
