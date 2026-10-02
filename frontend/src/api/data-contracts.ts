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

export type AuthCodeCreateData = RequestCode;

export type AuthCodeVerifyCreateData = VerifyCode;

export type AuthLogoutCreateData = TokenBlacklist;

export type AuthTokenCreateData = TokenObtainPairWithProperMessage;

export type AuthTokenRefreshCreateData = TokenRefresh;

export interface BookReview {
  /**
   * @min 1
   * @max 5
   */
  assessment: number;
  club: number;
  /**
   * Дата создания
   * @format date-time
   */
  created: string;
  id: number;
  /**
   * Дата изменения
   * @format date-time
   */
  modified: string | null;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  readPages: number;
  /** Book Review */
  review: string;
  user: User;
}

export interface Club {
  /** @maxLength 255 */
  bookAuthors: string;
  /** @maxLength 255 */
  bookTitle: string;
  /**
   * Дата создания
   * @format date-time
   */
  created: string;
  /** Book Description */
  description: string;
  id: number;
  members: Member[];
  /**
   * Дата изменения
   * @format date-time
   */
  modified: string | null;
  owner: number;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  publicationYear: number;
  reviews: BookReview[];
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
}

export type ClubsCreateData = Club;

export type ClubsDestroyData = any;

export interface ClubsDestroyParams {
  /** A unique integer value identifying this Book Club. */
  id: number;
}

export type ClubsListData = PaginatedClubList;

export interface ClubsListParams {
  membership?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** Number of results to return per page. */
  page_size?: number;
  search?: string;
}

export type ClubsMembersMeCreateData = any;

export interface ClubsMembersMeCreateParams {
  /** A unique integer value identifying this Book Club. */
  id: number;
}

export type ClubsMembersMeDestroyData = any;

export interface ClubsMembersMeDestroyParams {
  /** A unique integer value identifying this Book Club. */
  id: number;
}

export type ClubsPartialUpdateData = Club;

export interface ClubsPartialUpdateParams {
  /** A unique integer value identifying this Book Club. */
  id: number;
}

export type ClubsRetrieveData = Club;

export interface ClubsRetrieveParams {
  /** A unique integer value identifying this Book Club. */
  id: number;
}

export type ClubsReviewsCreateData = BookReview;

export type ClubsReviewsDestroyData = any;

export interface ClubsReviewsDestroyParams {
  /** A unique integer value identifying this Book Review. */
  id: number;
}

export type ClubsReviewsListData = PaginatedBookReviewList;

export interface ClubsReviewsListParams {
  club?: number;
  /** A page number within the paginated result set. */
  page?: number;
  /** Number of results to return per page. */
  page_size?: number;
}

export type ClubsReviewsPartialUpdateData = BookReview;

export interface ClubsReviewsPartialUpdateParams {
  /** A unique integer value identifying this Book Review. */
  id: number;
}

export type ClubsReviewsRetrieveData = BookReview;

export interface ClubsReviewsRetrieveParams {
  /** A unique integer value identifying this Book Review. */
  id: number;
}

export type ClubsReviewsUpdateData = BookReview;

export interface ClubsReviewsUpdateParams {
  /** A unique integer value identifying this Book Review. */
  id: number;
}

export type ClubsUpdateData = Club;

export interface ClubsUpdateParams {
  /** A unique integer value identifying this Book Club. */
  id: number;
}

export type DocsSchemaRetrieveData = Record<string, any>;

export interface DocsSchemaRetrieveParams {
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
}

export interface Member {
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
  /** @maxLength 150 */
  firstName?: string;
  id: number;
  /** @maxLength 150 */
  lastName?: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
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

export interface PatchedBookReview {
  /**
   * @min 1
   * @max 5
   */
  assessment?: number;
  club?: number;
  /**
   * Дата создания
   * @format date-time
   */
  created?: string;
  id?: number;
  /**
   * Дата изменения
   * @format date-time
   */
  modified?: string | null;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  readPages?: number;
  /** Book Review */
  review?: string;
  user?: User;
}

export interface PatchedClub {
  /** @maxLength 255 */
  bookAuthors?: string;
  /** @maxLength 255 */
  bookTitle?: string;
  /**
   * Дата создания
   * @format date-time
   */
  created?: string;
  /** Book Description */
  description?: string;
  id?: number;
  members?: Member[];
  /**
   * Дата изменения
   * @format date-time
   */
  modified?: string | null;
  owner?: number;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  publicationYear?: number;
  reviews?: BookReview[];
  /**
   * Link on Telegram chat
   * @format uri
   * @maxLength 200
   */
  telegramChatLink?: string;
}

export interface PatchedUser {
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
  /** @maxLength 150 */
  firstName?: string;
  id?: number;
  /** @maxLength 150 */
  lastName?: string;
  remoteAddr?: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username?: string;
}

export interface RequestCode {
  /** @format email */
  email: string;
}

export interface TokenBlacklist {
  refresh: string;
}

export interface TokenObtainPairWithProperMessage {
  password: string;
  username: string;
}

export interface TokenRefresh {
  access: string;
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
  /** @maxLength 128 */
  password: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

export type UsersMeDestroyData = any;

export type UsersMePartialUpdateData = User;

export type UsersMeRetrieveData = User;

export type UsersMeUpdateData = User;

export type UsersRegisterCreateData = UserRegister;

export interface VerifyCode {
  /**
   * @minLength 4
   * @maxLength 4
   */
  code: string;
  /** @format email */
  email: string;
}
