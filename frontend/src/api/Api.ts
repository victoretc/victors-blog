/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * * `pending` - Pending
 * * `approved` - Approved
 * * `declined` - Declined
 */
export enum StatusEnum {
  Pending = "pending",
  Approved = "approved",
  Declined = "declined",
}

/**
 * * `book` - Book Club
 * * `author` - Author Club
 */
export enum ClubTypeEnum {
  Book = "book",
  Author = "author",
}

export interface BookClubRequest {
  id: number;
  /**
   * * `book` - Book Club
   * * `author` - Author Club
   */
  clubType?: ClubTypeEnum;
  /** @maxLength 255 */
  bookTitle: string;
  /** @maxLength 255 */
  bookAuthors: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  publicationYear: number;
  /** Book Description */
  description: string;
  /**
   * Author/Host Name
   * @maxLength 255
   */
  authorName?: string;
  /** Author/Host Bio */
  authorBio?: string;
  /** @format uri */
  authorPhoto?: string | null;
  category?: number | null;
  categoryName: string | null;
  status: StatusEnum;
  requester: number;
  /**
   * Link on Telegram chat
   * @format uri
   */
  telegramChatLink: string;
  /**
   * Link on Max chat
   * @format uri
   */
  maxChatLink: string;
  adminComment: string;
  /**
   * Дата создания
   * @format date-time
   */
  created: string;
  /**
   * Дата изменения
   * @format date-time
   */
  modified: string | null;
}

export interface BookClubRequestRequest {
  /**
   * * `book` - Book Club
   * * `author` - Author Club
   */
  clubType?: ClubTypeEnum;
  /**
   * @minLength 1
   * @maxLength 255
   */
  bookTitle: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  bookAuthors: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  publicationYear: number;
  /**
   * Book Description
   * @minLength 1
   */
  description: string;
  /**
   * Author/Host Name
   * @maxLength 255
   */
  authorName?: string;
  /** Author/Host Bio */
  authorBio?: string;
  /** @format binary */
  authorPhoto?: File | null;
  category?: number | null;
}

export interface BookReview {
  id: number;
  club: number;
  user: User;
  /** Book Review */
  review: string;
  /**
   * @min 1
   * @max 5
   */
  assessment: number;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  readPages: number;
  /**
   * Дата создания
   * @format date-time
   */
  created: string;
  /**
   * Дата изменения
   * @format date-time
   */
  modified: string | null;
}

export interface BookReviewRequest {
  club: number;
  /**
   * Book Review
   * @minLength 1
   */
  review: string;
  /**
   * @min 1
   * @max 5
   */
  assessment: number;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  readPages: number;
}

export interface Category {
  id: number;
  name: string;
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string;
  /** Parent Category */
  parent: number | null;
}

export interface Club {
  id: number;
  /**
   * * `book` - Book Club
   * * `author` - Author Club
   */
  clubType?: ClubTypeEnum;
  /** @maxLength 255 */
  bookTitle: string;
  /** @maxLength 255 */
  bookAuthors: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  publicationYear: number;
  /** Book Description */
  description: string;
  /**
   * Author/Host Name
   * @maxLength 255
   */
  authorName?: string;
  /** Author/Host Bio */
  authorBio?: string;
  /** @format uri */
  authorPhoto?: string | null;
  category?: number | null;
  categoryName: string | null;
  /**
   * Link on Telegram chat
   * @format uri
   * @maxLength 200
   */
  telegramChatLink: string;
  /**
   * Link on Max chat
   * @format uri
   * @maxLength 200
   */
  maxChatLink?: string;
  owner: number;
  members: Member[];
  reviews: BookReview[];
  /**
   * Дата создания
   * @format date-time
   */
  created: string;
  /**
   * Дата изменения
   * @format date-time
   */
  modified: string | null;
}

export interface ClubRequest {
  /**
   * * `book` - Book Club
   * * `author` - Author Club
   */
  clubType?: ClubTypeEnum;
  /**
   * @minLength 1
   * @maxLength 255
   */
  bookTitle: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  bookAuthors: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  publicationYear: number;
  /**
   * Book Description
   * @minLength 1
   */
  description: string;
  /**
   * Author/Host Name
   * @maxLength 255
   */
  authorName?: string;
  /** Author/Host Bio */
  authorBio?: string;
  /** @format binary */
  authorPhoto?: File | null;
  category?: number | null;
  /**
   * Link on Telegram chat
   * @format uri
   * @minLength 1
   * @maxLength 200
   */
  telegramChatLink: string;
  /**
   * Link on Max chat
   * @format uri
   * @maxLength 200
   */
  maxChatLink?: string;
}

export interface Member {
  id: number;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /** @maxLength 150 */
  firstName?: string;
  /** @maxLength 150 */
  lastName?: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
}

export interface MemberRequest {
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /** @maxLength 150 */
  firstName?: string;
  /** @maxLength 150 */
  lastName?: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
}

export interface PaginatedBookClubRequestList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?page=4"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?page=2"
   */
  previous?: string | null;
  results: BookClubRequest[];
}

export interface PaginatedBookReviewList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?page=4"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?page=2"
   */
  previous?: string | null;
  results: BookReview[];
}

export interface PaginatedCategoryList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?page=4"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?page=2"
   */
  previous?: string | null;
  results: Category[];
}

export interface PaginatedClubList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?page=4"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?page=2"
   */
  previous?: string | null;
  results: Club[];
}

export interface PatchedBookReviewRequest {
  club?: number;
  /**
   * Book Review
   * @minLength 1
   */
  review?: string;
  /**
   * @min 1
   * @max 5
   */
  assessment?: number;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  readPages?: number;
}

export interface PatchedClubRequest {
  /**
   * * `book` - Book Club
   * * `author` - Author Club
   */
  clubType?: ClubTypeEnum;
  /**
   * @minLength 1
   * @maxLength 255
   */
  bookTitle?: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  bookAuthors?: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  publicationYear?: number;
  /**
   * Book Description
   * @minLength 1
   */
  description?: string;
  /**
   * Author/Host Name
   * @maxLength 255
   */
  authorName?: string;
  /** Author/Host Bio */
  authorBio?: string;
  /** @format binary */
  authorPhoto?: File | null;
  category?: number | null;
  /**
   * Link on Telegram chat
   * @format uri
   * @minLength 1
   * @maxLength 200
   */
  telegramChatLink?: string;
  /**
   * Link on Max chat
   * @format uri
   * @maxLength 200
   */
  maxChatLink?: string;
}

export interface PatchedUserRequest {
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username?: string;
  /** @maxLength 150 */
  firstName?: string;
  /** @maxLength 150 */
  lastName?: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
  /** Reading list is public */
  isReadingListPublic?: boolean;
}

export interface ReadingListBook {
  id: number;
  /** @maxLength 255 */
  bookTitle: string;
  /** @maxLength 255 */
  bookAuthors: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  publicationYear: number;
  /** Book Description */
  description: string;
  review: ReadingListReview | null;
}

export interface ReadingListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  user: ReadingListUser;
  results: ReadingListBook[];
}

export interface ReadingListReview {
  id: number;
  /** Book Review */
  review: string;
  /**
   * @min 1
   * @max 5
   */
  assessment: number;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  readPages: number;
  /**
   * Дата создания
   * @format date-time
   */
  created: string;
}

export interface ReadingListUser {
  id: number;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /** @maxLength 150 */
  firstName?: string;
  /** @maxLength 150 */
  lastName?: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
}

export interface RequestCode {
  detail: string;
}

export interface RequestCodeRequest {
  /**
   * @format email
   * @minLength 1
   */
  email: string;
}

export interface RetrieveCodeRequest {
  /**
   * Email адрес, на который был отправлен код
   * @format email
   * @minLength 1
   */
  email: string;
}

export interface RetrieveCodeResponse {
  /**
   * 4-значный код подтверждения
   * @maxLength 4
   */
  code: string;
}

export interface TokenBlacklistRequest {
  /** @minLength 1 */
  refresh: string;
}

export interface TokenObtainPairWithProperMessage {
  access: string;
  refresh: string;
}

export interface TokenObtainPairWithProperMessageRequest {
  /** @minLength 1 */
  username: string;
  /** @minLength 1 */
  password: string;
}

export interface TokenRefresh {
  access: string;
  refresh: string;
}

export interface TokenRefreshRequest {
  /** @minLength 1 */
  refresh: string;
}

export interface User {
  id: number;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

export interface UserRegister {
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /** @maxLength 128 */
  password: string;
}

export interface UserRegisterRequest {
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /**
   * @minLength 1
   * @maxLength 128
   */
  password: string;
}

export interface UserRequest {
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

export interface VerifyCode {
  access: string;
  refresh: string;
}

export interface VerifyCodeRequest {
  /**
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * @minLength 4
   * @maxLength 4
   */
  code: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Book Club API
 * @version 0.0.0 (v1)
 *
 * So great, needs no docs
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthCodeCreate
     * @request POST:/api/v1/auth/code/
     * @secure
     */
    authCodeCreate: (data: RequestCodeRequest, params: RequestParams = {}) =>
      this.request<RequestCode, any>({
        path: `/api/v1/auth/code/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает последний неиспользованный код для указанного email. Работает только в DEBUG.
     *
     * @tags auth
     * @name AuthCodeRetrieveCreate
     * @request POST:/api/v1/auth/code/retrieve/
     * @secure
     */
    authCodeRetrieveCreate: (
      data: RetrieveCodeRequest,
      params: RequestParams = {},
    ) =>
      this.request<RetrieveCodeResponse, any>({
        path: `/api/v1/auth/code/retrieve/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthCodeVerifyCreate
     * @request POST:/api/v1/auth/code/verify/
     * @secure
     */
    authCodeVerifyCreate: (
      data: VerifyCodeRequest,
      params: RequestParams = {},
    ) =>
      this.request<VerifyCode, any>({
        path: `/api/v1/auth/code/verify/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Takes a token and blacklists it. Must be used with the `rest_framework_simplejwt.token_blacklist` app installed.
     *
     * @tags auth
     * @name AuthLogoutCreate
     * @request POST:/api/v1/auth/logout/
     */
    authLogoutCreate: (
      data: TokenBlacklistRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/auth/logout/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Takes a set of user credentials and returns an access and refresh JSON web token pair to prove the authentication of those credentials.
     *
     * @tags auth
     * @name AuthTokenCreate
     * @request POST:/api/v1/auth/token/
     */
    authTokenCreate: (
      data: TokenObtainPairWithProperMessageRequest,
      params: RequestParams = {},
    ) =>
      this.request<TokenObtainPairWithProperMessage, any>({
        path: `/api/v1/auth/token/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
     *
     * @tags auth
     * @name AuthTokenRefreshCreate
     * @request POST:/api/v1/auth/token/refresh/
     */
    authTokenRefreshCreate: (
      data: TokenRefreshRequest,
      params: RequestParams = {},
    ) =>
      this.request<TokenRefresh, any>({
        path: `/api/v1/auth/token/refresh/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsList
     * @request GET:/api/v1/clubs/
     * @secure
     */
    clubsList: (
      query?: {
        category?: number;
        club_type?: string;
        membership?: string;
        /** A page number within the paginated result set. */
        page?: number;
        /** Number of results to return per page. */
        page_size?: number;
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedClubList, any>({
        path: `/api/v1/clubs/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsCreate
     * @request POST:/api/v1/clubs/
     * @secure
     */
    clubsCreate: (data: ClubRequest, params: RequestParams = {}) =>
      this.request<Club, any>({
        path: `/api/v1/clubs/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsRetrieve
     * @request GET:/api/v1/clubs/{id}/
     * @secure
     */
    clubsRetrieve: (id: number, params: RequestParams = {}) =>
      this.request<Club, any>({
        path: `/api/v1/clubs/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsUpdate
     * @request PUT:/api/v1/clubs/{id}/
     * @secure
     */
    clubsUpdate: (id: number, data: ClubRequest, params: RequestParams = {}) =>
      this.request<Club, any>({
        path: `/api/v1/clubs/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsPartialUpdate
     * @request PATCH:/api/v1/clubs/{id}/
     * @secure
     */
    clubsPartialUpdate: (
      id: number,
      data: PatchedClubRequest,
      params: RequestParams = {},
    ) =>
      this.request<Club, any>({
        path: `/api/v1/clubs/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsDestroy
     * @request DELETE:/api/v1/clubs/{id}/
     * @secure
     */
    clubsDestroy: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/clubs/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsMembersMeCreate
     * @request POST:/api/v1/clubs/{id}/members/me/
     * @secure
     */
    clubsMembersMeCreate: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/clubs/${id}/members/me/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsMembersMeDestroy
     * @request DELETE:/api/v1/clubs/{id}/members/me/
     * @secure
     */
    clubsMembersMeDestroy: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/clubs/${id}/members/me/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsCategoriesList
     * @request GET:/api/v1/clubs/categories/
     * @secure
     */
    clubsCategoriesList: (
      query?: {
        /** A page number within the paginated result set. */
        page?: number;
        /** Number of results to return per page. */
        page_size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedCategoryList, any>({
        path: `/api/v1/clubs/categories/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsCategoriesRetrieve
     * @request GET:/api/v1/clubs/categories/{id}/
     * @secure
     */
    clubsCategoriesRetrieve: (id: number, params: RequestParams = {}) =>
      this.request<Category, any>({
        path: `/api/v1/clubs/categories/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsClubRequestsList
     * @request GET:/api/v1/clubs/club-requests/
     * @secure
     */
    clubsClubRequestsList: (
      query?: {
        /** A page number within the paginated result set. */
        page?: number;
        /** Number of results to return per page. */
        page_size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedBookClubRequestList, any>({
        path: `/api/v1/clubs/club-requests/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsClubRequestsCreate
     * @request POST:/api/v1/clubs/club-requests/
     * @secure
     */
    clubsClubRequestsCreate: (
      data: BookClubRequestRequest,
      params: RequestParams = {},
    ) =>
      this.request<BookClubRequest, any>({
        path: `/api/v1/clubs/club-requests/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsClubRequestsRetrieve
     * @request GET:/api/v1/clubs/club-requests/{id}/
     * @secure
     */
    clubsClubRequestsRetrieve: (id: number, params: RequestParams = {}) =>
      this.request<BookClubRequest, any>({
        path: `/api/v1/clubs/club-requests/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsClubRequestsMineRetrieve
     * @request GET:/api/v1/clubs/club-requests/mine/
     * @secure
     */
    clubsClubRequestsMineRetrieve: (params: RequestParams = {}) =>
      this.request<BookClubRequest, any>({
        path: `/api/v1/clubs/club-requests/mine/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsReviewsList
     * @request GET:/api/v1/clubs/reviews/
     * @secure
     */
    clubsReviewsList: (
      query?: {
        club?: number;
        /** A page number within the paginated result set. */
        page?: number;
        /** Number of results to return per page. */
        page_size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedBookReviewList, any>({
        path: `/api/v1/clubs/reviews/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsReviewsCreate
     * @request POST:/api/v1/clubs/reviews/
     * @secure
     */
    clubsReviewsCreate: (data: BookReviewRequest, params: RequestParams = {}) =>
      this.request<BookReview, any>({
        path: `/api/v1/clubs/reviews/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsReviewsRetrieve
     * @request GET:/api/v1/clubs/reviews/{id}/
     * @secure
     */
    clubsReviewsRetrieve: (id: number, params: RequestParams = {}) =>
      this.request<BookReview, any>({
        path: `/api/v1/clubs/reviews/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsReviewsUpdate
     * @request PUT:/api/v1/clubs/reviews/{id}/
     * @secure
     */
    clubsReviewsUpdate: (
      id: number,
      data: BookReviewRequest,
      params: RequestParams = {},
    ) =>
      this.request<BookReview, any>({
        path: `/api/v1/clubs/reviews/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsReviewsPartialUpdate
     * @request PATCH:/api/v1/clubs/reviews/{id}/
     * @secure
     */
    clubsReviewsPartialUpdate: (
      id: number,
      data: PatchedBookReviewRequest,
      params: RequestParams = {},
    ) =>
      this.request<BookReview, any>({
        path: `/api/v1/clubs/reviews/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clubs
     * @name ClubsReviewsDestroy
     * @request DELETE:/api/v1/clubs/reviews/{id}/
     * @secure
     */
    clubsReviewsDestroy: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/clubs/reviews/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description OpenApi3 schema for this API. Format can be selected via content negotiation. - YAML: application/vnd.oai.openapi - JSON: application/vnd.oai.openapi+json
     *
     * @tags docs
     * @name DocsSchemaRetrieve
     * @request GET:/api/v1/docs/schema/
     * @secure
     */
    docsSchemaRetrieve: (
      query?: {
        format?: "json" | "yaml";
        lang?:
          | "af"
          | "ar"
          | "ar-dz"
          | "ast"
          | "az"
          | "be"
          | "bg"
          | "bn"
          | "br"
          | "bs"
          | "ca"
          | "ckb"
          | "cs"
          | "cy"
          | "da"
          | "de"
          | "dsb"
          | "el"
          | "en"
          | "en-au"
          | "en-gb"
          | "eo"
          | "es"
          | "es-ar"
          | "es-co"
          | "es-mx"
          | "es-ni"
          | "es-ve"
          | "et"
          | "eu"
          | "fa"
          | "fi"
          | "fr"
          | "fy"
          | "ga"
          | "gd"
          | "gl"
          | "he"
          | "hi"
          | "hr"
          | "hsb"
          | "hu"
          | "hy"
          | "ia"
          | "id"
          | "ig"
          | "io"
          | "is"
          | "it"
          | "ja"
          | "ka"
          | "kab"
          | "kk"
          | "km"
          | "kn"
          | "ko"
          | "ky"
          | "lb"
          | "lt"
          | "lv"
          | "mk"
          | "ml"
          | "mn"
          | "mr"
          | "ms"
          | "my"
          | "nb"
          | "ne"
          | "nl"
          | "nn"
          | "os"
          | "pa"
          | "pl"
          | "pt"
          | "pt-br"
          | "ro"
          | "ru"
          | "sk"
          | "sl"
          | "sq"
          | "sr"
          | "sr-latn"
          | "sv"
          | "sw"
          | "ta"
          | "te"
          | "tg"
          | "th"
          | "tk"
          | "tr"
          | "tt"
          | "udm"
          | "ug"
          | "uk"
          | "ur"
          | "uz"
          | "vi"
          | "zh-hans"
          | "zh-hant";
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, any>({
        path: `/api/v1/docs/schema/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersBooksRetrieve
     * @request GET:/api/v1/users/{id}/books/
     * @secure
     */
    usersBooksRetrieve: (
      id: number,
      query?: {
        page?: number;
        page_size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadingListResponse, any>({
        path: `/api/v1/users/${id}/books/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersMeRetrieve
     * @request GET:/api/v1/users/me/
     * @secure
     */
    usersMeRetrieve: (params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/v1/users/me/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersMeUpdate
     * @request PUT:/api/v1/users/me/
     * @secure
     */
    usersMeUpdate: (data: UserRequest, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/v1/users/me/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersMePartialUpdate
     * @request PATCH:/api/v1/users/me/
     * @secure
     */
    usersMePartialUpdate: (
      data: PatchedUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<User, any>({
        path: `/api/v1/users/me/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersMeDestroy
     * @request DELETE:/api/v1/users/me/
     * @secure
     */
    usersMeDestroy: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/users/me/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/api/v1/users/register/
     * @secure
     */
    usersRegisterCreate: (
      data: UserRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<UserRegister, any>({
        path: `/api/v1/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
