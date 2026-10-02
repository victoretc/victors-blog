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

import {
  AuthCodeCreateData,
  AuthCodeVerifyCreateData,
  AuthLogoutCreateData,
  AuthTokenCreateData,
  AuthTokenRefreshCreateData,
  BookReview,
  Club,
  ClubsCreateData,
  ClubsDestroyData,
  ClubsListData,
  ClubsMembersMeCreateData,
  ClubsMembersMeDestroyData,
  ClubsPartialUpdateData,
  ClubsRetrieveData,
  ClubsReviewsCreateData,
  ClubsReviewsDestroyData,
  ClubsReviewsListData,
  ClubsReviewsPartialUpdateData,
  ClubsReviewsRetrieveData,
  ClubsReviewsUpdateData,
  ClubsUpdateData,
  DocsSchemaRetrieveData,
  PatchedBookReview,
  PatchedClub,
  PatchedUser,
  RequestCode,
  TokenBlacklist,
  TokenObtainPairWithProperMessage,
  TokenRefresh,
  User,
  UserRegister,
  UsersMeDestroyData,
  UsersMePartialUpdateData,
  UsersMeRetrieveData,
  UsersMeUpdateData,
  UsersRegisterCreateData,
  VerifyCode,
} from "./data-contracts";

export namespace Api {
  /**
   * No description
   * @tags auth
   * @name AuthCodeCreate
   * @request POST:/api/v1/auth/code/
   * @secure
   */
  export namespace AuthCodeCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RequestCode;
    export type RequestHeaders = {};
    export type ResponseBody = AuthCodeCreateData;
  }

  /**
   * No description
   * @tags auth
   * @name AuthCodeVerifyCreate
   * @request POST:/api/v1/auth/code/verify/
   * @secure
   */
  export namespace AuthCodeVerifyCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VerifyCode;
    export type RequestHeaders = {};
    export type ResponseBody = AuthCodeVerifyCreateData;
  }

  /**
   * @description Takes a token and blacklists it. Must be used with the `rest_framework_simplejwt.token_blacklist` app installed.
   * @tags auth
   * @name AuthLogoutCreate
   * @request POST:/api/v1/auth/logout/
   */
  export namespace AuthLogoutCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = TokenBlacklist;
    export type RequestHeaders = {};
    export type ResponseBody = AuthLogoutCreateData;
  }

  /**
   * @description Takes a set of user credentials and returns an access and refresh JSON web token pair to prove the authentication of those credentials.
   * @tags auth
   * @name AuthTokenCreate
   * @request POST:/api/v1/auth/token/
   */
  export namespace AuthTokenCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = TokenObtainPairWithProperMessage;
    export type RequestHeaders = {};
    export type ResponseBody = AuthTokenCreateData;
  }

  /**
   * @description Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
   * @tags auth
   * @name AuthTokenRefreshCreate
   * @request POST:/api/v1/auth/token/refresh/
   */
  export namespace AuthTokenRefreshCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = TokenRefresh;
    export type RequestHeaders = {};
    export type ResponseBody = AuthTokenRefreshCreateData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsCreate
   * @request POST:/api/v1/clubs/
   * @secure
   */
  export namespace ClubsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Club;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsCreateData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsDestroy
   * @request DELETE:/api/v1/clubs/{id}/
   * @secure
   */
  export namespace ClubsDestroy {
    export type RequestParams = {
      /** A unique integer value identifying this Book Club. */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsDestroyData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsList
   * @request GET:/api/v1/clubs/
   * @secure
   */
  export namespace ClubsList {
    export type RequestParams = {};
    export type RequestQuery = {
      membership?: string;
      /** A page number within the paginated result set. */
      page?: number;
      /** Number of results to return per page. */
      page_size?: number;
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsListData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsMembersMeCreate
   * @request POST:/api/v1/clubs/{id}/members/me/
   * @secure
   */
  export namespace ClubsMembersMeCreate {
    export type RequestParams = {
      /** A unique integer value identifying this Book Club. */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsMembersMeCreateData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsMembersMeDestroy
   * @request DELETE:/api/v1/clubs/{id}/members/me/
   * @secure
   */
  export namespace ClubsMembersMeDestroy {
    export type RequestParams = {
      /** A unique integer value identifying this Book Club. */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsMembersMeDestroyData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsPartialUpdate
   * @request PATCH:/api/v1/clubs/{id}/
   * @secure
   */
  export namespace ClubsPartialUpdate {
    export type RequestParams = {
      /** A unique integer value identifying this Book Club. */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = PatchedClub;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsPartialUpdateData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsRetrieve
   * @request GET:/api/v1/clubs/{id}/
   * @secure
   */
  export namespace ClubsRetrieve {
    export type RequestParams = {
      /** A unique integer value identifying this Book Club. */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsRetrieveData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsReviewsCreate
   * @request POST:/api/v1/clubs/reviews/
   * @secure
   */
  export namespace ClubsReviewsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BookReview;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsReviewsCreateData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsReviewsDestroy
   * @request DELETE:/api/v1/clubs/reviews/{id}/
   * @secure
   */
  export namespace ClubsReviewsDestroy {
    export type RequestParams = {
      /** A unique integer value identifying this Book Review. */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsReviewsDestroyData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsReviewsList
   * @request GET:/api/v1/clubs/reviews/
   * @secure
   */
  export namespace ClubsReviewsList {
    export type RequestParams = {};
    export type RequestQuery = {
      club?: number;
      /** A page number within the paginated result set. */
      page?: number;
      /** Number of results to return per page. */
      page_size?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsReviewsListData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsReviewsPartialUpdate
   * @request PATCH:/api/v1/clubs/reviews/{id}/
   * @secure
   */
  export namespace ClubsReviewsPartialUpdate {
    export type RequestParams = {
      /** A unique integer value identifying this Book Review. */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = PatchedBookReview;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsReviewsPartialUpdateData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsReviewsRetrieve
   * @request GET:/api/v1/clubs/reviews/{id}/
   * @secure
   */
  export namespace ClubsReviewsRetrieve {
    export type RequestParams = {
      /** A unique integer value identifying this Book Review. */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsReviewsRetrieveData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsReviewsUpdate
   * @request PUT:/api/v1/clubs/reviews/{id}/
   * @secure
   */
  export namespace ClubsReviewsUpdate {
    export type RequestParams = {
      /** A unique integer value identifying this Book Review. */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = BookReview;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsReviewsUpdateData;
  }

  /**
   * No description
   * @tags clubs
   * @name ClubsUpdate
   * @request PUT:/api/v1/clubs/{id}/
   * @secure
   */
  export namespace ClubsUpdate {
    export type RequestParams = {
      /** A unique integer value identifying this Book Club. */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = Club;
    export type RequestHeaders = {};
    export type ResponseBody = ClubsUpdateData;
  }

  /**
   * @description OpenApi3 schema for this API. Format can be selected via content negotiation. - YAML: application/vnd.oai.openapi - JSON: application/vnd.oai.openapi+json
   * @tags docs
   * @name DocsSchemaRetrieve
   * @request GET:/api/v1/docs/schema/
   * @secure
   */
  export namespace DocsSchemaRetrieve {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DocsSchemaRetrieveData;
  }

  /**
   * No description
   * @tags users
   * @name UsersMeDestroy
   * @request DELETE:/api/v1/users/me/
   * @secure
   */
  export namespace UsersMeDestroy {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsersMeDestroyData;
  }

  /**
   * No description
   * @tags users
   * @name UsersMePartialUpdate
   * @request PATCH:/api/v1/users/me/
   * @secure
   */
  export namespace UsersMePartialUpdate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PatchedUser;
    export type RequestHeaders = {};
    export type ResponseBody = UsersMePartialUpdateData;
  }

  /**
   * No description
   * @tags users
   * @name UsersMeRetrieve
   * @request GET:/api/v1/users/me/
   * @secure
   */
  export namespace UsersMeRetrieve {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsersMeRetrieveData;
  }

  /**
   * No description
   * @tags users
   * @name UsersMeUpdate
   * @request PUT:/api/v1/users/me/
   * @secure
   */
  export namespace UsersMeUpdate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = User;
    export type RequestHeaders = {};
    export type ResponseBody = UsersMeUpdateData;
  }

  /**
   * No description
   * @tags users
   * @name UsersRegisterCreate
   * @request POST:/api/v1/users/register/
   * @secure
   */
  export namespace UsersRegisterCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserRegister;
    export type RequestHeaders = {};
    export type ResponseBody = UsersRegisterCreateData;
  }
}
