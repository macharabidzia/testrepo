export class ApiError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ApiNetworkError extends ApiError {
  originalError: Error;

  constructor(message: string, originalError: Error) {
    super(message);
    this.originalError = originalError;
    this.name = "ApiNetworkError";
  }
}

export class ApiHttpError extends ApiError {
  status: number;
  statusText: string;
  url: string;
  response: Response;
  body: any;

  constructor(response: Response, body: any, message?: string) {
    const defaultMessage = `API Error: ${response.status} ${response.statusText} for ${response.url}`;
    super(message || defaultMessage);

    this.status = response.status;
    this.statusText = response.statusText;
    this.url = response.url;
    this.response = response;
    this.body = body;
    this.name = "ApiHttpError";
  }
}

export class ApiUnauthorizedError extends ApiHttpError {
  constructor(response: Response, body: any, message?: string) {
    const defaultMessage = "Unauthorized or session expired";
    super(response, body, message || defaultMessage);
    this.name = "ApiUnauthorizedError";
  }
}
