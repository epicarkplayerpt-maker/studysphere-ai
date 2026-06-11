
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Binder
 * 
 */
export type Binder = $Result.DefaultSelection<Prisma.$BinderPayload>
/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model StudyHistory
 * 
 */
export type StudyHistory = $Result.DefaultSelection<Prisma.$StudyHistoryPayload>
/**
 * Model Flashcard
 * 
 */
export type Flashcard = $Result.DefaultSelection<Prisma.$FlashcardPayload>
/**
 * Model DocumentChunk
 * 
 */
export type DocumentChunk = $Result.DefaultSelection<Prisma.$DocumentChunkPayload>
/**
 * Model TokenUsage
 * 
 */
export type TokenUsage = $Result.DefaultSelection<Prisma.$TokenUsagePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs>;

  /**
   * `prisma.binder`: Exposes CRUD operations for the **Binder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Binders
    * const binders = await prisma.binder.findMany()
    * ```
    */
  get binder(): Prisma.BinderDelegate<ExtArgs>;

  /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs>;

  /**
   * `prisma.studyHistory`: Exposes CRUD operations for the **StudyHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudyHistories
    * const studyHistories = await prisma.studyHistory.findMany()
    * ```
    */
  get studyHistory(): Prisma.StudyHistoryDelegate<ExtArgs>;

  /**
   * `prisma.flashcard`: Exposes CRUD operations for the **Flashcard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Flashcards
    * const flashcards = await prisma.flashcard.findMany()
    * ```
    */
  get flashcard(): Prisma.FlashcardDelegate<ExtArgs>;

  /**
   * `prisma.documentChunk`: Exposes CRUD operations for the **DocumentChunk** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DocumentChunks
    * const documentChunks = await prisma.documentChunk.findMany()
    * ```
    */
  get documentChunk(): Prisma.DocumentChunkDelegate<ExtArgs>;

  /**
   * `prisma.tokenUsage`: Exposes CRUD operations for the **TokenUsage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TokenUsages
    * const tokenUsages = await prisma.tokenUsage.findMany()
    * ```
    */
  get tokenUsage(): Prisma.TokenUsageDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Session: 'Session',
    Binder: 'Binder',
    Document: 'Document',
    StudyHistory: 'StudyHistory',
    Flashcard: 'Flashcard',
    DocumentChunk: 'DocumentChunk',
    TokenUsage: 'TokenUsage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "session" | "binder" | "document" | "studyHistory" | "flashcard" | "documentChunk" | "tokenUsage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Binder: {
        payload: Prisma.$BinderPayload<ExtArgs>
        fields: Prisma.BinderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BinderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BinderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BinderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BinderPayload>
          }
          findFirst: {
            args: Prisma.BinderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BinderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BinderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BinderPayload>
          }
          findMany: {
            args: Prisma.BinderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BinderPayload>[]
          }
          create: {
            args: Prisma.BinderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BinderPayload>
          }
          createMany: {
            args: Prisma.BinderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BinderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BinderPayload>[]
          }
          delete: {
            args: Prisma.BinderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BinderPayload>
          }
          update: {
            args: Prisma.BinderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BinderPayload>
          }
          deleteMany: {
            args: Prisma.BinderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BinderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BinderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BinderPayload>
          }
          aggregate: {
            args: Prisma.BinderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBinder>
          }
          groupBy: {
            args: Prisma.BinderGroupByArgs<ExtArgs>
            result: $Utils.Optional<BinderGroupByOutputType>[]
          }
          count: {
            args: Prisma.BinderCountArgs<ExtArgs>
            result: $Utils.Optional<BinderCountAggregateOutputType> | number
          }
        }
      }
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      StudyHistory: {
        payload: Prisma.$StudyHistoryPayload<ExtArgs>
        fields: Prisma.StudyHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudyHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudyHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyHistoryPayload>
          }
          findFirst: {
            args: Prisma.StudyHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudyHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyHistoryPayload>
          }
          findMany: {
            args: Prisma.StudyHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyHistoryPayload>[]
          }
          create: {
            args: Prisma.StudyHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyHistoryPayload>
          }
          createMany: {
            args: Prisma.StudyHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudyHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyHistoryPayload>[]
          }
          delete: {
            args: Prisma.StudyHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyHistoryPayload>
          }
          update: {
            args: Prisma.StudyHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyHistoryPayload>
          }
          deleteMany: {
            args: Prisma.StudyHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudyHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StudyHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyHistoryPayload>
          }
          aggregate: {
            args: Prisma.StudyHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudyHistory>
          }
          groupBy: {
            args: Prisma.StudyHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudyHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudyHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<StudyHistoryCountAggregateOutputType> | number
          }
        }
      }
      Flashcard: {
        payload: Prisma.$FlashcardPayload<ExtArgs>
        fields: Prisma.FlashcardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlashcardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlashcardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          findFirst: {
            args: Prisma.FlashcardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlashcardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          findMany: {
            args: Prisma.FlashcardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>[]
          }
          create: {
            args: Prisma.FlashcardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          createMany: {
            args: Prisma.FlashcardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FlashcardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>[]
          }
          delete: {
            args: Prisma.FlashcardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          update: {
            args: Prisma.FlashcardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          deleteMany: {
            args: Prisma.FlashcardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlashcardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FlashcardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          aggregate: {
            args: Prisma.FlashcardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlashcard>
          }
          groupBy: {
            args: Prisma.FlashcardGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlashcardGroupByOutputType>[]
          }
          count: {
            args: Prisma.FlashcardCountArgs<ExtArgs>
            result: $Utils.Optional<FlashcardCountAggregateOutputType> | number
          }
        }
      }
      DocumentChunk: {
        payload: Prisma.$DocumentChunkPayload<ExtArgs>
        fields: Prisma.DocumentChunkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentChunkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentChunkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentChunkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentChunkPayload>
          }
          findFirst: {
            args: Prisma.DocumentChunkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentChunkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentChunkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentChunkPayload>
          }
          findMany: {
            args: Prisma.DocumentChunkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentChunkPayload>[]
          }
          create: {
            args: Prisma.DocumentChunkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentChunkPayload>
          }
          createMany: {
            args: Prisma.DocumentChunkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentChunkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentChunkPayload>[]
          }
          delete: {
            args: Prisma.DocumentChunkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentChunkPayload>
          }
          update: {
            args: Prisma.DocumentChunkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentChunkPayload>
          }
          deleteMany: {
            args: Prisma.DocumentChunkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentChunkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DocumentChunkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentChunkPayload>
          }
          aggregate: {
            args: Prisma.DocumentChunkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocumentChunk>
          }
          groupBy: {
            args: Prisma.DocumentChunkGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentChunkGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentChunkCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentChunkCountAggregateOutputType> | number
          }
        }
      }
      TokenUsage: {
        payload: Prisma.$TokenUsagePayload<ExtArgs>
        fields: Prisma.TokenUsageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TokenUsageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenUsagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TokenUsageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenUsagePayload>
          }
          findFirst: {
            args: Prisma.TokenUsageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenUsagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TokenUsageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenUsagePayload>
          }
          findMany: {
            args: Prisma.TokenUsageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenUsagePayload>[]
          }
          create: {
            args: Prisma.TokenUsageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenUsagePayload>
          }
          createMany: {
            args: Prisma.TokenUsageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TokenUsageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenUsagePayload>[]
          }
          delete: {
            args: Prisma.TokenUsageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenUsagePayload>
          }
          update: {
            args: Prisma.TokenUsageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenUsagePayload>
          }
          deleteMany: {
            args: Prisma.TokenUsageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TokenUsageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TokenUsageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenUsagePayload>
          }
          aggregate: {
            args: Prisma.TokenUsageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTokenUsage>
          }
          groupBy: {
            args: Prisma.TokenUsageGroupByArgs<ExtArgs>
            result: $Utils.Optional<TokenUsageGroupByOutputType>[]
          }
          count: {
            args: Prisma.TokenUsageCountArgs<ExtArgs>
            result: $Utils.Optional<TokenUsageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    binders: number
    studyHistory: number
    flashcards: number
    tokenUsages: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    binders?: boolean | UserCountOutputTypeCountBindersArgs
    studyHistory?: boolean | UserCountOutputTypeCountStudyHistoryArgs
    flashcards?: boolean | UserCountOutputTypeCountFlashcardsArgs
    tokenUsages?: boolean | UserCountOutputTypeCountTokenUsagesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBindersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BinderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountStudyHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudyHistoryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFlashcardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTokenUsagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenUsageWhereInput
  }


  /**
   * Count Type BinderCountOutputType
   */

  export type BinderCountOutputType = {
    documents: number
  }

  export type BinderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | BinderCountOutputTypeCountDocumentsArgs
  }

  // Custom InputTypes
  /**
   * BinderCountOutputType without action
   */
  export type BinderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BinderCountOutputType
     */
    select?: BinderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BinderCountOutputType without action
   */
  export type BinderCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }


  /**
   * Count Type DocumentCountOutputType
   */

  export type DocumentCountOutputType = {
    chunks: number
  }

  export type DocumentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chunks?: boolean | DocumentCountOutputTypeCountChunksArgs
  }

  // Custom InputTypes
  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentCountOutputType
     */
    select?: DocumentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountChunksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentChunkWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    customInstructions: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    customInstructions: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    customInstructions: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    customInstructions?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    customInstructions?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    customInstructions?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    customInstructions: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    customInstructions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    binders?: boolean | User$bindersArgs<ExtArgs>
    studyHistory?: boolean | User$studyHistoryArgs<ExtArgs>
    flashcards?: boolean | User$flashcardsArgs<ExtArgs>
    tokenUsages?: boolean | User$tokenUsagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    customInstructions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    customInstructions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    binders?: boolean | User$bindersArgs<ExtArgs>
    studyHistory?: boolean | User$studyHistoryArgs<ExtArgs>
    flashcards?: boolean | User$flashcardsArgs<ExtArgs>
    tokenUsages?: boolean | User$tokenUsagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      binders: Prisma.$BinderPayload<ExtArgs>[]
      studyHistory: Prisma.$StudyHistoryPayload<ExtArgs>[]
      flashcards: Prisma.$FlashcardPayload<ExtArgs>[]
      tokenUsages: Prisma.$TokenUsagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      customInstructions: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany"> | Null>
    binders<T extends User$bindersArgs<ExtArgs> = {}>(args?: Subset<T, User$bindersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "findMany"> | Null>
    studyHistory<T extends User$studyHistoryArgs<ExtArgs> = {}>(args?: Subset<T, User$studyHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudyHistoryPayload<ExtArgs>, T, "findMany"> | Null>
    flashcards<T extends User$flashcardsArgs<ExtArgs> = {}>(args?: Subset<T, User$flashcardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findMany"> | Null>
    tokenUsages<T extends User$tokenUsagesArgs<ExtArgs> = {}>(args?: Subset<T, User$tokenUsagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenUsagePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly customInstructions: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.binders
   */
  export type User$bindersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderInclude<ExtArgs> | null
    where?: BinderWhereInput
    orderBy?: BinderOrderByWithRelationInput | BinderOrderByWithRelationInput[]
    cursor?: BinderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BinderScalarFieldEnum | BinderScalarFieldEnum[]
  }

  /**
   * User.studyHistory
   */
  export type User$studyHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryInclude<ExtArgs> | null
    where?: StudyHistoryWhereInput
    orderBy?: StudyHistoryOrderByWithRelationInput | StudyHistoryOrderByWithRelationInput[]
    cursor?: StudyHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudyHistoryScalarFieldEnum | StudyHistoryScalarFieldEnum[]
  }

  /**
   * User.flashcards
   */
  export type User$flashcardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    where?: FlashcardWhereInput
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    cursor?: FlashcardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * User.tokenUsages
   */
  export type User$tokenUsagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageInclude<ExtArgs> | null
    where?: TokenUsageWhereInput
    orderBy?: TokenUsageOrderByWithRelationInput | TokenUsageOrderByWithRelationInput[]
    cursor?: TokenUsageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TokenUsageScalarFieldEnum | TokenUsageScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionAvgAggregateOutputType = {
    activeSeconds: number | null
  }

  export type SessionSumAggregateOutputType = {
    activeSeconds: number | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    expiresAt: Date | null
    createdAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    lastActiveAt: Date | null
    activeSeconds: number | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    expiresAt: Date | null
    createdAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    lastActiveAt: Date | null
    activeSeconds: number | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    userId: number
    token: number
    expiresAt: number
    createdAt: number
    ipAddress: number
    userAgent: number
    lastActiveAt: number
    activeSeconds: number
    _all: number
  }


  export type SessionAvgAggregateInputType = {
    activeSeconds?: true
  }

  export type SessionSumAggregateInputType = {
    activeSeconds?: true
  }

  export type SessionMinAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
    ipAddress?: true
    userAgent?: true
    lastActiveAt?: true
    activeSeconds?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
    ipAddress?: true
    userAgent?: true
    lastActiveAt?: true
    activeSeconds?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
    ipAddress?: true
    userAgent?: true
    lastActiveAt?: true
    activeSeconds?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _avg?: SessionAvgAggregateInputType
    _sum?: SessionSumAggregateInputType
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    userId: string
    token: string
    expiresAt: Date
    createdAt: Date
    ipAddress: string | null
    userAgent: string | null
    lastActiveAt: Date
    activeSeconds: number
    _count: SessionCountAggregateOutputType | null
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    lastActiveAt?: boolean
    activeSeconds?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    lastActiveAt?: boolean
    activeSeconds?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    lastActiveAt?: boolean
    activeSeconds?: boolean
  }

  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      token: string
      expiresAt: Date
      createdAt: Date
      ipAddress: string | null
      userAgent: string | null
      lastActiveAt: Date
      activeSeconds: number
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */ 
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly token: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly lastActiveAt: FieldRef<"Session", 'DateTime'>
    readonly activeSeconds: FieldRef<"Session", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Binder
   */

  export type AggregateBinder = {
    _count: BinderCountAggregateOutputType | null
    _min: BinderMinAggregateOutputType | null
    _max: BinderMaxAggregateOutputType | null
  }

  export type BinderMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BinderMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BinderCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BinderMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BinderMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BinderCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BinderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Binder to aggregate.
     */
    where?: BinderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Binders to fetch.
     */
    orderBy?: BinderOrderByWithRelationInput | BinderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BinderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Binders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Binders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Binders
    **/
    _count?: true | BinderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BinderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BinderMaxAggregateInputType
  }

  export type GetBinderAggregateType<T extends BinderAggregateArgs> = {
        [P in keyof T & keyof AggregateBinder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBinder[P]>
      : GetScalarType<T[P], AggregateBinder[P]>
  }




  export type BinderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BinderWhereInput
    orderBy?: BinderOrderByWithAggregationInput | BinderOrderByWithAggregationInput[]
    by: BinderScalarFieldEnum[] | BinderScalarFieldEnum
    having?: BinderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BinderCountAggregateInputType | true
    _min?: BinderMinAggregateInputType
    _max?: BinderMaxAggregateInputType
  }

  export type BinderGroupByOutputType = {
    id: string
    userId: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: BinderCountAggregateOutputType | null
    _min: BinderMinAggregateOutputType | null
    _max: BinderMaxAggregateOutputType | null
  }

  type GetBinderGroupByPayload<T extends BinderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BinderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BinderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BinderGroupByOutputType[P]>
            : GetScalarType<T[P], BinderGroupByOutputType[P]>
        }
      >
    >


  export type BinderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    documents?: boolean | Binder$documentsArgs<ExtArgs>
    _count?: boolean | BinderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["binder"]>

  export type BinderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["binder"]>

  export type BinderSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BinderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    documents?: boolean | Binder$documentsArgs<ExtArgs>
    _count?: boolean | BinderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BinderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BinderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Binder"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      documents: Prisma.$DocumentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["binder"]>
    composites: {}
  }

  type BinderGetPayload<S extends boolean | null | undefined | BinderDefaultArgs> = $Result.GetResult<Prisma.$BinderPayload, S>

  type BinderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BinderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BinderCountAggregateInputType | true
    }

  export interface BinderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Binder'], meta: { name: 'Binder' } }
    /**
     * Find zero or one Binder that matches the filter.
     * @param {BinderFindUniqueArgs} args - Arguments to find a Binder
     * @example
     * // Get one Binder
     * const binder = await prisma.binder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BinderFindUniqueArgs>(args: SelectSubset<T, BinderFindUniqueArgs<ExtArgs>>): Prisma__BinderClient<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Binder that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BinderFindUniqueOrThrowArgs} args - Arguments to find a Binder
     * @example
     * // Get one Binder
     * const binder = await prisma.binder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BinderFindUniqueOrThrowArgs>(args: SelectSubset<T, BinderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BinderClient<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Binder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BinderFindFirstArgs} args - Arguments to find a Binder
     * @example
     * // Get one Binder
     * const binder = await prisma.binder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BinderFindFirstArgs>(args?: SelectSubset<T, BinderFindFirstArgs<ExtArgs>>): Prisma__BinderClient<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Binder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BinderFindFirstOrThrowArgs} args - Arguments to find a Binder
     * @example
     * // Get one Binder
     * const binder = await prisma.binder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BinderFindFirstOrThrowArgs>(args?: SelectSubset<T, BinderFindFirstOrThrowArgs<ExtArgs>>): Prisma__BinderClient<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Binders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BinderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Binders
     * const binders = await prisma.binder.findMany()
     * 
     * // Get first 10 Binders
     * const binders = await prisma.binder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const binderWithIdOnly = await prisma.binder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BinderFindManyArgs>(args?: SelectSubset<T, BinderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Binder.
     * @param {BinderCreateArgs} args - Arguments to create a Binder.
     * @example
     * // Create one Binder
     * const Binder = await prisma.binder.create({
     *   data: {
     *     // ... data to create a Binder
     *   }
     * })
     * 
     */
    create<T extends BinderCreateArgs>(args: SelectSubset<T, BinderCreateArgs<ExtArgs>>): Prisma__BinderClient<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Binders.
     * @param {BinderCreateManyArgs} args - Arguments to create many Binders.
     * @example
     * // Create many Binders
     * const binder = await prisma.binder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BinderCreateManyArgs>(args?: SelectSubset<T, BinderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Binders and returns the data saved in the database.
     * @param {BinderCreateManyAndReturnArgs} args - Arguments to create many Binders.
     * @example
     * // Create many Binders
     * const binder = await prisma.binder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Binders and only return the `id`
     * const binderWithIdOnly = await prisma.binder.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BinderCreateManyAndReturnArgs>(args?: SelectSubset<T, BinderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Binder.
     * @param {BinderDeleteArgs} args - Arguments to delete one Binder.
     * @example
     * // Delete one Binder
     * const Binder = await prisma.binder.delete({
     *   where: {
     *     // ... filter to delete one Binder
     *   }
     * })
     * 
     */
    delete<T extends BinderDeleteArgs>(args: SelectSubset<T, BinderDeleteArgs<ExtArgs>>): Prisma__BinderClient<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Binder.
     * @param {BinderUpdateArgs} args - Arguments to update one Binder.
     * @example
     * // Update one Binder
     * const binder = await prisma.binder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BinderUpdateArgs>(args: SelectSubset<T, BinderUpdateArgs<ExtArgs>>): Prisma__BinderClient<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Binders.
     * @param {BinderDeleteManyArgs} args - Arguments to filter Binders to delete.
     * @example
     * // Delete a few Binders
     * const { count } = await prisma.binder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BinderDeleteManyArgs>(args?: SelectSubset<T, BinderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Binders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BinderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Binders
     * const binder = await prisma.binder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BinderUpdateManyArgs>(args: SelectSubset<T, BinderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Binder.
     * @param {BinderUpsertArgs} args - Arguments to update or create a Binder.
     * @example
     * // Update or create a Binder
     * const binder = await prisma.binder.upsert({
     *   create: {
     *     // ... data to create a Binder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Binder we want to update
     *   }
     * })
     */
    upsert<T extends BinderUpsertArgs>(args: SelectSubset<T, BinderUpsertArgs<ExtArgs>>): Prisma__BinderClient<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Binders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BinderCountArgs} args - Arguments to filter Binders to count.
     * @example
     * // Count the number of Binders
     * const count = await prisma.binder.count({
     *   where: {
     *     // ... the filter for the Binders we want to count
     *   }
     * })
    **/
    count<T extends BinderCountArgs>(
      args?: Subset<T, BinderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BinderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Binder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BinderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BinderAggregateArgs>(args: Subset<T, BinderAggregateArgs>): Prisma.PrismaPromise<GetBinderAggregateType<T>>

    /**
     * Group by Binder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BinderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BinderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BinderGroupByArgs['orderBy'] }
        : { orderBy?: BinderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BinderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBinderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Binder model
   */
  readonly fields: BinderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Binder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BinderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    documents<T extends Binder$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Binder$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Binder model
   */ 
  interface BinderFieldRefs {
    readonly id: FieldRef<"Binder", 'String'>
    readonly userId: FieldRef<"Binder", 'String'>
    readonly name: FieldRef<"Binder", 'String'>
    readonly description: FieldRef<"Binder", 'String'>
    readonly createdAt: FieldRef<"Binder", 'DateTime'>
    readonly updatedAt: FieldRef<"Binder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Binder findUnique
   */
  export type BinderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderInclude<ExtArgs> | null
    /**
     * Filter, which Binder to fetch.
     */
    where: BinderWhereUniqueInput
  }

  /**
   * Binder findUniqueOrThrow
   */
  export type BinderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderInclude<ExtArgs> | null
    /**
     * Filter, which Binder to fetch.
     */
    where: BinderWhereUniqueInput
  }

  /**
   * Binder findFirst
   */
  export type BinderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderInclude<ExtArgs> | null
    /**
     * Filter, which Binder to fetch.
     */
    where?: BinderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Binders to fetch.
     */
    orderBy?: BinderOrderByWithRelationInput | BinderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Binders.
     */
    cursor?: BinderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Binders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Binders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Binders.
     */
    distinct?: BinderScalarFieldEnum | BinderScalarFieldEnum[]
  }

  /**
   * Binder findFirstOrThrow
   */
  export type BinderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderInclude<ExtArgs> | null
    /**
     * Filter, which Binder to fetch.
     */
    where?: BinderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Binders to fetch.
     */
    orderBy?: BinderOrderByWithRelationInput | BinderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Binders.
     */
    cursor?: BinderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Binders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Binders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Binders.
     */
    distinct?: BinderScalarFieldEnum | BinderScalarFieldEnum[]
  }

  /**
   * Binder findMany
   */
  export type BinderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderInclude<ExtArgs> | null
    /**
     * Filter, which Binders to fetch.
     */
    where?: BinderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Binders to fetch.
     */
    orderBy?: BinderOrderByWithRelationInput | BinderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Binders.
     */
    cursor?: BinderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Binders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Binders.
     */
    skip?: number
    distinct?: BinderScalarFieldEnum | BinderScalarFieldEnum[]
  }

  /**
   * Binder create
   */
  export type BinderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderInclude<ExtArgs> | null
    /**
     * The data needed to create a Binder.
     */
    data: XOR<BinderCreateInput, BinderUncheckedCreateInput>
  }

  /**
   * Binder createMany
   */
  export type BinderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Binders.
     */
    data: BinderCreateManyInput | BinderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Binder createManyAndReturn
   */
  export type BinderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Binders.
     */
    data: BinderCreateManyInput | BinderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Binder update
   */
  export type BinderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderInclude<ExtArgs> | null
    /**
     * The data needed to update a Binder.
     */
    data: XOR<BinderUpdateInput, BinderUncheckedUpdateInput>
    /**
     * Choose, which Binder to update.
     */
    where: BinderWhereUniqueInput
  }

  /**
   * Binder updateMany
   */
  export type BinderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Binders.
     */
    data: XOR<BinderUpdateManyMutationInput, BinderUncheckedUpdateManyInput>
    /**
     * Filter which Binders to update
     */
    where?: BinderWhereInput
  }

  /**
   * Binder upsert
   */
  export type BinderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderInclude<ExtArgs> | null
    /**
     * The filter to search for the Binder to update in case it exists.
     */
    where: BinderWhereUniqueInput
    /**
     * In case the Binder found by the `where` argument doesn't exist, create a new Binder with this data.
     */
    create: XOR<BinderCreateInput, BinderUncheckedCreateInput>
    /**
     * In case the Binder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BinderUpdateInput, BinderUncheckedUpdateInput>
  }

  /**
   * Binder delete
   */
  export type BinderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderInclude<ExtArgs> | null
    /**
     * Filter which Binder to delete.
     */
    where: BinderWhereUniqueInput
  }

  /**
   * Binder deleteMany
   */
  export type BinderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Binders to delete
     */
    where?: BinderWhereInput
  }

  /**
   * Binder.documents
   */
  export type Binder$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Binder without action
   */
  export type BinderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Binder
     */
    select?: BinderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BinderInclude<ExtArgs> | null
  }


  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentMinAggregateOutputType = {
    id: string | null
    binderId: string | null
    name: string | null
    fileType: string | null
    content: string | null
    base64: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: string | null
    binderId: string | null
    name: string | null
    fileType: string | null
    content: string | null
    base64: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    binderId: number
    name: number
    fileType: number
    content: number
    base64: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentMinAggregateInputType = {
    id?: true
    binderId?: true
    name?: true
    fileType?: true
    content?: true
    base64?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    binderId?: true
    name?: true
    fileType?: true
    content?: true
    base64?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    binderId?: true
    name?: true
    fileType?: true
    content?: true
    base64?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: string
    binderId: string
    name: string
    fileType: string
    content: string
    base64: string | null
    createdAt: Date
    updatedAt: Date
    _count: DocumentCountAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    binderId?: boolean
    name?: boolean
    fileType?: boolean
    content?: boolean
    base64?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    binder?: boolean | BinderDefaultArgs<ExtArgs>
    chunks?: boolean | Document$chunksArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    binderId?: boolean
    name?: boolean
    fileType?: boolean
    content?: boolean
    base64?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    binder?: boolean | BinderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    binderId?: boolean
    name?: boolean
    fileType?: boolean
    content?: boolean
    base64?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    binder?: boolean | BinderDefaultArgs<ExtArgs>
    chunks?: boolean | Document$chunksArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    binder?: boolean | BinderDefaultArgs<ExtArgs>
  }

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      binder: Prisma.$BinderPayload<ExtArgs>
      chunks: Prisma.$DocumentChunkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      binderId: string
      name: string
      fileType: string
      content: string
      base64: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    binder<T extends BinderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BinderDefaultArgs<ExtArgs>>): Prisma__BinderClient<$Result.GetResult<Prisma.$BinderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    chunks<T extends Document$chunksArgs<ExtArgs> = {}>(args?: Subset<T, Document$chunksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentChunkPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Document model
   */ 
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'String'>
    readonly binderId: FieldRef<"Document", 'String'>
    readonly name: FieldRef<"Document", 'String'>
    readonly fileType: FieldRef<"Document", 'String'>
    readonly content: FieldRef<"Document", 'String'>
    readonly base64: FieldRef<"Document", 'String'>
    readonly createdAt: FieldRef<"Document", 'DateTime'>
    readonly updatedAt: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
  }

  /**
   * Document.chunks
   */
  export type Document$chunksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkInclude<ExtArgs> | null
    where?: DocumentChunkWhereInput
    orderBy?: DocumentChunkOrderByWithRelationInput | DocumentChunkOrderByWithRelationInput[]
    cursor?: DocumentChunkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentChunkScalarFieldEnum | DocumentChunkScalarFieldEnum[]
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Model StudyHistory
   */

  export type AggregateStudyHistory = {
    _count: StudyHistoryCountAggregateOutputType | null
    _min: StudyHistoryMinAggregateOutputType | null
    _max: StudyHistoryMaxAggregateOutputType | null
  }

  export type StudyHistoryMinAggregateOutputType = {
    id: string | null
    userId: string | null
    query: string | null
    response: string | null
    createdAt: Date | null
  }

  export type StudyHistoryMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    query: string | null
    response: string | null
    createdAt: Date | null
  }

  export type StudyHistoryCountAggregateOutputType = {
    id: number
    userId: number
    query: number
    response: number
    createdAt: number
    _all: number
  }


  export type StudyHistoryMinAggregateInputType = {
    id?: true
    userId?: true
    query?: true
    response?: true
    createdAt?: true
  }

  export type StudyHistoryMaxAggregateInputType = {
    id?: true
    userId?: true
    query?: true
    response?: true
    createdAt?: true
  }

  export type StudyHistoryCountAggregateInputType = {
    id?: true
    userId?: true
    query?: true
    response?: true
    createdAt?: true
    _all?: true
  }

  export type StudyHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudyHistory to aggregate.
     */
    where?: StudyHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudyHistories to fetch.
     */
    orderBy?: StudyHistoryOrderByWithRelationInput | StudyHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudyHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudyHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudyHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudyHistories
    **/
    _count?: true | StudyHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudyHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudyHistoryMaxAggregateInputType
  }

  export type GetStudyHistoryAggregateType<T extends StudyHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateStudyHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudyHistory[P]>
      : GetScalarType<T[P], AggregateStudyHistory[P]>
  }




  export type StudyHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudyHistoryWhereInput
    orderBy?: StudyHistoryOrderByWithAggregationInput | StudyHistoryOrderByWithAggregationInput[]
    by: StudyHistoryScalarFieldEnum[] | StudyHistoryScalarFieldEnum
    having?: StudyHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudyHistoryCountAggregateInputType | true
    _min?: StudyHistoryMinAggregateInputType
    _max?: StudyHistoryMaxAggregateInputType
  }

  export type StudyHistoryGroupByOutputType = {
    id: string
    userId: string
    query: string
    response: string
    createdAt: Date
    _count: StudyHistoryCountAggregateOutputType | null
    _min: StudyHistoryMinAggregateOutputType | null
    _max: StudyHistoryMaxAggregateOutputType | null
  }

  type GetStudyHistoryGroupByPayload<T extends StudyHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudyHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudyHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudyHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], StudyHistoryGroupByOutputType[P]>
        }
      >
    >


  export type StudyHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    query?: boolean
    response?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studyHistory"]>

  export type StudyHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    query?: boolean
    response?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studyHistory"]>

  export type StudyHistorySelectScalar = {
    id?: boolean
    userId?: boolean
    query?: boolean
    response?: boolean
    createdAt?: boolean
  }

  export type StudyHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type StudyHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $StudyHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudyHistory"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      query: string
      response: string
      createdAt: Date
    }, ExtArgs["result"]["studyHistory"]>
    composites: {}
  }

  type StudyHistoryGetPayload<S extends boolean | null | undefined | StudyHistoryDefaultArgs> = $Result.GetResult<Prisma.$StudyHistoryPayload, S>

  type StudyHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StudyHistoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StudyHistoryCountAggregateInputType | true
    }

  export interface StudyHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudyHistory'], meta: { name: 'StudyHistory' } }
    /**
     * Find zero or one StudyHistory that matches the filter.
     * @param {StudyHistoryFindUniqueArgs} args - Arguments to find a StudyHistory
     * @example
     * // Get one StudyHistory
     * const studyHistory = await prisma.studyHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudyHistoryFindUniqueArgs>(args: SelectSubset<T, StudyHistoryFindUniqueArgs<ExtArgs>>): Prisma__StudyHistoryClient<$Result.GetResult<Prisma.$StudyHistoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StudyHistory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StudyHistoryFindUniqueOrThrowArgs} args - Arguments to find a StudyHistory
     * @example
     * // Get one StudyHistory
     * const studyHistory = await prisma.studyHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudyHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, StudyHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudyHistoryClient<$Result.GetResult<Prisma.$StudyHistoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StudyHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyHistoryFindFirstArgs} args - Arguments to find a StudyHistory
     * @example
     * // Get one StudyHistory
     * const studyHistory = await prisma.studyHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudyHistoryFindFirstArgs>(args?: SelectSubset<T, StudyHistoryFindFirstArgs<ExtArgs>>): Prisma__StudyHistoryClient<$Result.GetResult<Prisma.$StudyHistoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StudyHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyHistoryFindFirstOrThrowArgs} args - Arguments to find a StudyHistory
     * @example
     * // Get one StudyHistory
     * const studyHistory = await prisma.studyHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudyHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, StudyHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudyHistoryClient<$Result.GetResult<Prisma.$StudyHistoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StudyHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudyHistories
     * const studyHistories = await prisma.studyHistory.findMany()
     * 
     * // Get first 10 StudyHistories
     * const studyHistories = await prisma.studyHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studyHistoryWithIdOnly = await prisma.studyHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudyHistoryFindManyArgs>(args?: SelectSubset<T, StudyHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudyHistoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StudyHistory.
     * @param {StudyHistoryCreateArgs} args - Arguments to create a StudyHistory.
     * @example
     * // Create one StudyHistory
     * const StudyHistory = await prisma.studyHistory.create({
     *   data: {
     *     // ... data to create a StudyHistory
     *   }
     * })
     * 
     */
    create<T extends StudyHistoryCreateArgs>(args: SelectSubset<T, StudyHistoryCreateArgs<ExtArgs>>): Prisma__StudyHistoryClient<$Result.GetResult<Prisma.$StudyHistoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StudyHistories.
     * @param {StudyHistoryCreateManyArgs} args - Arguments to create many StudyHistories.
     * @example
     * // Create many StudyHistories
     * const studyHistory = await prisma.studyHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudyHistoryCreateManyArgs>(args?: SelectSubset<T, StudyHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudyHistories and returns the data saved in the database.
     * @param {StudyHistoryCreateManyAndReturnArgs} args - Arguments to create many StudyHistories.
     * @example
     * // Create many StudyHistories
     * const studyHistory = await prisma.studyHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudyHistories and only return the `id`
     * const studyHistoryWithIdOnly = await prisma.studyHistory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudyHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, StudyHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudyHistoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StudyHistory.
     * @param {StudyHistoryDeleteArgs} args - Arguments to delete one StudyHistory.
     * @example
     * // Delete one StudyHistory
     * const StudyHistory = await prisma.studyHistory.delete({
     *   where: {
     *     // ... filter to delete one StudyHistory
     *   }
     * })
     * 
     */
    delete<T extends StudyHistoryDeleteArgs>(args: SelectSubset<T, StudyHistoryDeleteArgs<ExtArgs>>): Prisma__StudyHistoryClient<$Result.GetResult<Prisma.$StudyHistoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StudyHistory.
     * @param {StudyHistoryUpdateArgs} args - Arguments to update one StudyHistory.
     * @example
     * // Update one StudyHistory
     * const studyHistory = await prisma.studyHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudyHistoryUpdateArgs>(args: SelectSubset<T, StudyHistoryUpdateArgs<ExtArgs>>): Prisma__StudyHistoryClient<$Result.GetResult<Prisma.$StudyHistoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StudyHistories.
     * @param {StudyHistoryDeleteManyArgs} args - Arguments to filter StudyHistories to delete.
     * @example
     * // Delete a few StudyHistories
     * const { count } = await prisma.studyHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudyHistoryDeleteManyArgs>(args?: SelectSubset<T, StudyHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudyHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudyHistories
     * const studyHistory = await prisma.studyHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudyHistoryUpdateManyArgs>(args: SelectSubset<T, StudyHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StudyHistory.
     * @param {StudyHistoryUpsertArgs} args - Arguments to update or create a StudyHistory.
     * @example
     * // Update or create a StudyHistory
     * const studyHistory = await prisma.studyHistory.upsert({
     *   create: {
     *     // ... data to create a StudyHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudyHistory we want to update
     *   }
     * })
     */
    upsert<T extends StudyHistoryUpsertArgs>(args: SelectSubset<T, StudyHistoryUpsertArgs<ExtArgs>>): Prisma__StudyHistoryClient<$Result.GetResult<Prisma.$StudyHistoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StudyHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyHistoryCountArgs} args - Arguments to filter StudyHistories to count.
     * @example
     * // Count the number of StudyHistories
     * const count = await prisma.studyHistory.count({
     *   where: {
     *     // ... the filter for the StudyHistories we want to count
     *   }
     * })
    **/
    count<T extends StudyHistoryCountArgs>(
      args?: Subset<T, StudyHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudyHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudyHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudyHistoryAggregateArgs>(args: Subset<T, StudyHistoryAggregateArgs>): Prisma.PrismaPromise<GetStudyHistoryAggregateType<T>>

    /**
     * Group by StudyHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudyHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudyHistoryGroupByArgs['orderBy'] }
        : { orderBy?: StudyHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudyHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudyHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudyHistory model
   */
  readonly fields: StudyHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudyHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudyHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StudyHistory model
   */ 
  interface StudyHistoryFieldRefs {
    readonly id: FieldRef<"StudyHistory", 'String'>
    readonly userId: FieldRef<"StudyHistory", 'String'>
    readonly query: FieldRef<"StudyHistory", 'String'>
    readonly response: FieldRef<"StudyHistory", 'String'>
    readonly createdAt: FieldRef<"StudyHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StudyHistory findUnique
   */
  export type StudyHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryInclude<ExtArgs> | null
    /**
     * Filter, which StudyHistory to fetch.
     */
    where: StudyHistoryWhereUniqueInput
  }

  /**
   * StudyHistory findUniqueOrThrow
   */
  export type StudyHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryInclude<ExtArgs> | null
    /**
     * Filter, which StudyHistory to fetch.
     */
    where: StudyHistoryWhereUniqueInput
  }

  /**
   * StudyHistory findFirst
   */
  export type StudyHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryInclude<ExtArgs> | null
    /**
     * Filter, which StudyHistory to fetch.
     */
    where?: StudyHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudyHistories to fetch.
     */
    orderBy?: StudyHistoryOrderByWithRelationInput | StudyHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudyHistories.
     */
    cursor?: StudyHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudyHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudyHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudyHistories.
     */
    distinct?: StudyHistoryScalarFieldEnum | StudyHistoryScalarFieldEnum[]
  }

  /**
   * StudyHistory findFirstOrThrow
   */
  export type StudyHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryInclude<ExtArgs> | null
    /**
     * Filter, which StudyHistory to fetch.
     */
    where?: StudyHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudyHistories to fetch.
     */
    orderBy?: StudyHistoryOrderByWithRelationInput | StudyHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudyHistories.
     */
    cursor?: StudyHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudyHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudyHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudyHistories.
     */
    distinct?: StudyHistoryScalarFieldEnum | StudyHistoryScalarFieldEnum[]
  }

  /**
   * StudyHistory findMany
   */
  export type StudyHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryInclude<ExtArgs> | null
    /**
     * Filter, which StudyHistories to fetch.
     */
    where?: StudyHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudyHistories to fetch.
     */
    orderBy?: StudyHistoryOrderByWithRelationInput | StudyHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudyHistories.
     */
    cursor?: StudyHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudyHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudyHistories.
     */
    skip?: number
    distinct?: StudyHistoryScalarFieldEnum | StudyHistoryScalarFieldEnum[]
  }

  /**
   * StudyHistory create
   */
  export type StudyHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a StudyHistory.
     */
    data: XOR<StudyHistoryCreateInput, StudyHistoryUncheckedCreateInput>
  }

  /**
   * StudyHistory createMany
   */
  export type StudyHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudyHistories.
     */
    data: StudyHistoryCreateManyInput | StudyHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StudyHistory createManyAndReturn
   */
  export type StudyHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StudyHistories.
     */
    data: StudyHistoryCreateManyInput | StudyHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudyHistory update
   */
  export type StudyHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a StudyHistory.
     */
    data: XOR<StudyHistoryUpdateInput, StudyHistoryUncheckedUpdateInput>
    /**
     * Choose, which StudyHistory to update.
     */
    where: StudyHistoryWhereUniqueInput
  }

  /**
   * StudyHistory updateMany
   */
  export type StudyHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudyHistories.
     */
    data: XOR<StudyHistoryUpdateManyMutationInput, StudyHistoryUncheckedUpdateManyInput>
    /**
     * Filter which StudyHistories to update
     */
    where?: StudyHistoryWhereInput
  }

  /**
   * StudyHistory upsert
   */
  export type StudyHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the StudyHistory to update in case it exists.
     */
    where: StudyHistoryWhereUniqueInput
    /**
     * In case the StudyHistory found by the `where` argument doesn't exist, create a new StudyHistory with this data.
     */
    create: XOR<StudyHistoryCreateInput, StudyHistoryUncheckedCreateInput>
    /**
     * In case the StudyHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudyHistoryUpdateInput, StudyHistoryUncheckedUpdateInput>
  }

  /**
   * StudyHistory delete
   */
  export type StudyHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryInclude<ExtArgs> | null
    /**
     * Filter which StudyHistory to delete.
     */
    where: StudyHistoryWhereUniqueInput
  }

  /**
   * StudyHistory deleteMany
   */
  export type StudyHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudyHistories to delete
     */
    where?: StudyHistoryWhereInput
  }

  /**
   * StudyHistory without action
   */
  export type StudyHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyHistory
     */
    select?: StudyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyHistoryInclude<ExtArgs> | null
  }


  /**
   * Model Flashcard
   */

  export type AggregateFlashcard = {
    _count: FlashcardCountAggregateOutputType | null
    _avg: FlashcardAvgAggregateOutputType | null
    _sum: FlashcardSumAggregateOutputType | null
    _min: FlashcardMinAggregateOutputType | null
    _max: FlashcardMaxAggregateOutputType | null
  }

  export type FlashcardAvgAggregateOutputType = {
    interval: number | null
    easeFactor: number | null
    reps: number | null
  }

  export type FlashcardSumAggregateOutputType = {
    interval: number | null
    easeFactor: number | null
    reps: number | null
  }

  export type FlashcardMinAggregateOutputType = {
    id: string | null
    userId: string | null
    front: string | null
    back: string | null
    interval: number | null
    easeFactor: number | null
    reps: number | null
    nextReview: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FlashcardMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    front: string | null
    back: string | null
    interval: number | null
    easeFactor: number | null
    reps: number | null
    nextReview: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FlashcardCountAggregateOutputType = {
    id: number
    userId: number
    front: number
    back: number
    interval: number
    easeFactor: number
    reps: number
    nextReview: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FlashcardAvgAggregateInputType = {
    interval?: true
    easeFactor?: true
    reps?: true
  }

  export type FlashcardSumAggregateInputType = {
    interval?: true
    easeFactor?: true
    reps?: true
  }

  export type FlashcardMinAggregateInputType = {
    id?: true
    userId?: true
    front?: true
    back?: true
    interval?: true
    easeFactor?: true
    reps?: true
    nextReview?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FlashcardMaxAggregateInputType = {
    id?: true
    userId?: true
    front?: true
    back?: true
    interval?: true
    easeFactor?: true
    reps?: true
    nextReview?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FlashcardCountAggregateInputType = {
    id?: true
    userId?: true
    front?: true
    back?: true
    interval?: true
    easeFactor?: true
    reps?: true
    nextReview?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FlashcardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flashcard to aggregate.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Flashcards
    **/
    _count?: true | FlashcardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FlashcardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FlashcardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlashcardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlashcardMaxAggregateInputType
  }

  export type GetFlashcardAggregateType<T extends FlashcardAggregateArgs> = {
        [P in keyof T & keyof AggregateFlashcard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlashcard[P]>
      : GetScalarType<T[P], AggregateFlashcard[P]>
  }




  export type FlashcardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardWhereInput
    orderBy?: FlashcardOrderByWithAggregationInput | FlashcardOrderByWithAggregationInput[]
    by: FlashcardScalarFieldEnum[] | FlashcardScalarFieldEnum
    having?: FlashcardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlashcardCountAggregateInputType | true
    _avg?: FlashcardAvgAggregateInputType
    _sum?: FlashcardSumAggregateInputType
    _min?: FlashcardMinAggregateInputType
    _max?: FlashcardMaxAggregateInputType
  }

  export type FlashcardGroupByOutputType = {
    id: string
    userId: string
    front: string
    back: string
    interval: number
    easeFactor: number
    reps: number
    nextReview: Date
    createdAt: Date
    updatedAt: Date
    _count: FlashcardCountAggregateOutputType | null
    _avg: FlashcardAvgAggregateOutputType | null
    _sum: FlashcardSumAggregateOutputType | null
    _min: FlashcardMinAggregateOutputType | null
    _max: FlashcardMaxAggregateOutputType | null
  }

  type GetFlashcardGroupByPayload<T extends FlashcardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlashcardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlashcardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlashcardGroupByOutputType[P]>
            : GetScalarType<T[P], FlashcardGroupByOutputType[P]>
        }
      >
    >


  export type FlashcardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    front?: boolean
    back?: boolean
    interval?: boolean
    easeFactor?: boolean
    reps?: boolean
    nextReview?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcard"]>

  export type FlashcardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    front?: boolean
    back?: boolean
    interval?: boolean
    easeFactor?: boolean
    reps?: boolean
    nextReview?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcard"]>

  export type FlashcardSelectScalar = {
    id?: boolean
    userId?: boolean
    front?: boolean
    back?: boolean
    interval?: boolean
    easeFactor?: boolean
    reps?: boolean
    nextReview?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FlashcardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FlashcardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FlashcardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Flashcard"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      front: string
      back: string
      interval: number
      easeFactor: number
      reps: number
      nextReview: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["flashcard"]>
    composites: {}
  }

  type FlashcardGetPayload<S extends boolean | null | undefined | FlashcardDefaultArgs> = $Result.GetResult<Prisma.$FlashcardPayload, S>

  type FlashcardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FlashcardFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FlashcardCountAggregateInputType | true
    }

  export interface FlashcardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Flashcard'], meta: { name: 'Flashcard' } }
    /**
     * Find zero or one Flashcard that matches the filter.
     * @param {FlashcardFindUniqueArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlashcardFindUniqueArgs>(args: SelectSubset<T, FlashcardFindUniqueArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Flashcard that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FlashcardFindUniqueOrThrowArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlashcardFindUniqueOrThrowArgs>(args: SelectSubset<T, FlashcardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Flashcard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindFirstArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlashcardFindFirstArgs>(args?: SelectSubset<T, FlashcardFindFirstArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Flashcard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindFirstOrThrowArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlashcardFindFirstOrThrowArgs>(args?: SelectSubset<T, FlashcardFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Flashcards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Flashcards
     * const flashcards = await prisma.flashcard.findMany()
     * 
     * // Get first 10 Flashcards
     * const flashcards = await prisma.flashcard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const flashcardWithIdOnly = await prisma.flashcard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FlashcardFindManyArgs>(args?: SelectSubset<T, FlashcardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Flashcard.
     * @param {FlashcardCreateArgs} args - Arguments to create a Flashcard.
     * @example
     * // Create one Flashcard
     * const Flashcard = await prisma.flashcard.create({
     *   data: {
     *     // ... data to create a Flashcard
     *   }
     * })
     * 
     */
    create<T extends FlashcardCreateArgs>(args: SelectSubset<T, FlashcardCreateArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Flashcards.
     * @param {FlashcardCreateManyArgs} args - Arguments to create many Flashcards.
     * @example
     * // Create many Flashcards
     * const flashcard = await prisma.flashcard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlashcardCreateManyArgs>(args?: SelectSubset<T, FlashcardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Flashcards and returns the data saved in the database.
     * @param {FlashcardCreateManyAndReturnArgs} args - Arguments to create many Flashcards.
     * @example
     * // Create many Flashcards
     * const flashcard = await prisma.flashcard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Flashcards and only return the `id`
     * const flashcardWithIdOnly = await prisma.flashcard.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FlashcardCreateManyAndReturnArgs>(args?: SelectSubset<T, FlashcardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Flashcard.
     * @param {FlashcardDeleteArgs} args - Arguments to delete one Flashcard.
     * @example
     * // Delete one Flashcard
     * const Flashcard = await prisma.flashcard.delete({
     *   where: {
     *     // ... filter to delete one Flashcard
     *   }
     * })
     * 
     */
    delete<T extends FlashcardDeleteArgs>(args: SelectSubset<T, FlashcardDeleteArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Flashcard.
     * @param {FlashcardUpdateArgs} args - Arguments to update one Flashcard.
     * @example
     * // Update one Flashcard
     * const flashcard = await prisma.flashcard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlashcardUpdateArgs>(args: SelectSubset<T, FlashcardUpdateArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Flashcards.
     * @param {FlashcardDeleteManyArgs} args - Arguments to filter Flashcards to delete.
     * @example
     * // Delete a few Flashcards
     * const { count } = await prisma.flashcard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlashcardDeleteManyArgs>(args?: SelectSubset<T, FlashcardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Flashcards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Flashcards
     * const flashcard = await prisma.flashcard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlashcardUpdateManyArgs>(args: SelectSubset<T, FlashcardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Flashcard.
     * @param {FlashcardUpsertArgs} args - Arguments to update or create a Flashcard.
     * @example
     * // Update or create a Flashcard
     * const flashcard = await prisma.flashcard.upsert({
     *   create: {
     *     // ... data to create a Flashcard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Flashcard we want to update
     *   }
     * })
     */
    upsert<T extends FlashcardUpsertArgs>(args: SelectSubset<T, FlashcardUpsertArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Flashcards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardCountArgs} args - Arguments to filter Flashcards to count.
     * @example
     * // Count the number of Flashcards
     * const count = await prisma.flashcard.count({
     *   where: {
     *     // ... the filter for the Flashcards we want to count
     *   }
     * })
    **/
    count<T extends FlashcardCountArgs>(
      args?: Subset<T, FlashcardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlashcardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Flashcard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FlashcardAggregateArgs>(args: Subset<T, FlashcardAggregateArgs>): Prisma.PrismaPromise<GetFlashcardAggregateType<T>>

    /**
     * Group by Flashcard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FlashcardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlashcardGroupByArgs['orderBy'] }
        : { orderBy?: FlashcardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FlashcardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlashcardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Flashcard model
   */
  readonly fields: FlashcardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Flashcard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlashcardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Flashcard model
   */ 
  interface FlashcardFieldRefs {
    readonly id: FieldRef<"Flashcard", 'String'>
    readonly userId: FieldRef<"Flashcard", 'String'>
    readonly front: FieldRef<"Flashcard", 'String'>
    readonly back: FieldRef<"Flashcard", 'String'>
    readonly interval: FieldRef<"Flashcard", 'Int'>
    readonly easeFactor: FieldRef<"Flashcard", 'Float'>
    readonly reps: FieldRef<"Flashcard", 'Int'>
    readonly nextReview: FieldRef<"Flashcard", 'DateTime'>
    readonly createdAt: FieldRef<"Flashcard", 'DateTime'>
    readonly updatedAt: FieldRef<"Flashcard", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Flashcard findUnique
   */
  export type FlashcardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard findUniqueOrThrow
   */
  export type FlashcardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard findFirst
   */
  export type FlashcardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flashcards.
     */
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard findFirstOrThrow
   */
  export type FlashcardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flashcards.
     */
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard findMany
   */
  export type FlashcardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcards to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard create
   */
  export type FlashcardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The data needed to create a Flashcard.
     */
    data: XOR<FlashcardCreateInput, FlashcardUncheckedCreateInput>
  }

  /**
   * Flashcard createMany
   */
  export type FlashcardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Flashcards.
     */
    data: FlashcardCreateManyInput | FlashcardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Flashcard createManyAndReturn
   */
  export type FlashcardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Flashcards.
     */
    data: FlashcardCreateManyInput | FlashcardCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Flashcard update
   */
  export type FlashcardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The data needed to update a Flashcard.
     */
    data: XOR<FlashcardUpdateInput, FlashcardUncheckedUpdateInput>
    /**
     * Choose, which Flashcard to update.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard updateMany
   */
  export type FlashcardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Flashcards.
     */
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyInput>
    /**
     * Filter which Flashcards to update
     */
    where?: FlashcardWhereInput
  }

  /**
   * Flashcard upsert
   */
  export type FlashcardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The filter to search for the Flashcard to update in case it exists.
     */
    where: FlashcardWhereUniqueInput
    /**
     * In case the Flashcard found by the `where` argument doesn't exist, create a new Flashcard with this data.
     */
    create: XOR<FlashcardCreateInput, FlashcardUncheckedCreateInput>
    /**
     * In case the Flashcard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlashcardUpdateInput, FlashcardUncheckedUpdateInput>
  }

  /**
   * Flashcard delete
   */
  export type FlashcardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter which Flashcard to delete.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard deleteMany
   */
  export type FlashcardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flashcards to delete
     */
    where?: FlashcardWhereInput
  }

  /**
   * Flashcard without action
   */
  export type FlashcardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
  }


  /**
   * Model DocumentChunk
   */

  export type AggregateDocumentChunk = {
    _count: DocumentChunkCountAggregateOutputType | null
    _min: DocumentChunkMinAggregateOutputType | null
    _max: DocumentChunkMaxAggregateOutputType | null
  }

  export type DocumentChunkMinAggregateOutputType = {
    id: string | null
    documentId: string | null
    content: string | null
    createdAt: Date | null
  }

  export type DocumentChunkMaxAggregateOutputType = {
    id: string | null
    documentId: string | null
    content: string | null
    createdAt: Date | null
  }

  export type DocumentChunkCountAggregateOutputType = {
    id: number
    documentId: number
    content: number
    createdAt: number
    _all: number
  }


  export type DocumentChunkMinAggregateInputType = {
    id?: true
    documentId?: true
    content?: true
    createdAt?: true
  }

  export type DocumentChunkMaxAggregateInputType = {
    id?: true
    documentId?: true
    content?: true
    createdAt?: true
  }

  export type DocumentChunkCountAggregateInputType = {
    id?: true
    documentId?: true
    content?: true
    createdAt?: true
    _all?: true
  }

  export type DocumentChunkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocumentChunk to aggregate.
     */
    where?: DocumentChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentChunks to fetch.
     */
    orderBy?: DocumentChunkOrderByWithRelationInput | DocumentChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DocumentChunks
    **/
    _count?: true | DocumentChunkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentChunkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentChunkMaxAggregateInputType
  }

  export type GetDocumentChunkAggregateType<T extends DocumentChunkAggregateArgs> = {
        [P in keyof T & keyof AggregateDocumentChunk]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocumentChunk[P]>
      : GetScalarType<T[P], AggregateDocumentChunk[P]>
  }




  export type DocumentChunkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentChunkWhereInput
    orderBy?: DocumentChunkOrderByWithAggregationInput | DocumentChunkOrderByWithAggregationInput[]
    by: DocumentChunkScalarFieldEnum[] | DocumentChunkScalarFieldEnum
    having?: DocumentChunkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentChunkCountAggregateInputType | true
    _min?: DocumentChunkMinAggregateInputType
    _max?: DocumentChunkMaxAggregateInputType
  }

  export type DocumentChunkGroupByOutputType = {
    id: string
    documentId: string
    content: string
    createdAt: Date
    _count: DocumentChunkCountAggregateOutputType | null
    _min: DocumentChunkMinAggregateOutputType | null
    _max: DocumentChunkMaxAggregateOutputType | null
  }

  type GetDocumentChunkGroupByPayload<T extends DocumentChunkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentChunkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentChunkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentChunkGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentChunkGroupByOutputType[P]>
        }
      >
    >


  export type DocumentChunkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    content?: boolean
    createdAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["documentChunk"]>

  export type DocumentChunkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    content?: boolean
    createdAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["documentChunk"]>

  export type DocumentChunkSelectScalar = {
    id?: boolean
    documentId?: boolean
    content?: boolean
    createdAt?: boolean
  }

  export type DocumentChunkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type DocumentChunkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }

  export type $DocumentChunkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DocumentChunk"
    objects: {
      document: Prisma.$DocumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      documentId: string
      content: string
      createdAt: Date
    }, ExtArgs["result"]["documentChunk"]>
    composites: {}
  }

  type DocumentChunkGetPayload<S extends boolean | null | undefined | DocumentChunkDefaultArgs> = $Result.GetResult<Prisma.$DocumentChunkPayload, S>

  type DocumentChunkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DocumentChunkFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DocumentChunkCountAggregateInputType | true
    }

  export interface DocumentChunkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DocumentChunk'], meta: { name: 'DocumentChunk' } }
    /**
     * Find zero or one DocumentChunk that matches the filter.
     * @param {DocumentChunkFindUniqueArgs} args - Arguments to find a DocumentChunk
     * @example
     * // Get one DocumentChunk
     * const documentChunk = await prisma.documentChunk.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentChunkFindUniqueArgs>(args: SelectSubset<T, DocumentChunkFindUniqueArgs<ExtArgs>>): Prisma__DocumentChunkClient<$Result.GetResult<Prisma.$DocumentChunkPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DocumentChunk that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DocumentChunkFindUniqueOrThrowArgs} args - Arguments to find a DocumentChunk
     * @example
     * // Get one DocumentChunk
     * const documentChunk = await prisma.documentChunk.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentChunkFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentChunkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentChunkClient<$Result.GetResult<Prisma.$DocumentChunkPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DocumentChunk that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentChunkFindFirstArgs} args - Arguments to find a DocumentChunk
     * @example
     * // Get one DocumentChunk
     * const documentChunk = await prisma.documentChunk.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentChunkFindFirstArgs>(args?: SelectSubset<T, DocumentChunkFindFirstArgs<ExtArgs>>): Prisma__DocumentChunkClient<$Result.GetResult<Prisma.$DocumentChunkPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DocumentChunk that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentChunkFindFirstOrThrowArgs} args - Arguments to find a DocumentChunk
     * @example
     * // Get one DocumentChunk
     * const documentChunk = await prisma.documentChunk.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentChunkFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentChunkFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentChunkClient<$Result.GetResult<Prisma.$DocumentChunkPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DocumentChunks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentChunkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DocumentChunks
     * const documentChunks = await prisma.documentChunk.findMany()
     * 
     * // Get first 10 DocumentChunks
     * const documentChunks = await prisma.documentChunk.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentChunkWithIdOnly = await prisma.documentChunk.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentChunkFindManyArgs>(args?: SelectSubset<T, DocumentChunkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentChunkPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DocumentChunk.
     * @param {DocumentChunkCreateArgs} args - Arguments to create a DocumentChunk.
     * @example
     * // Create one DocumentChunk
     * const DocumentChunk = await prisma.documentChunk.create({
     *   data: {
     *     // ... data to create a DocumentChunk
     *   }
     * })
     * 
     */
    create<T extends DocumentChunkCreateArgs>(args: SelectSubset<T, DocumentChunkCreateArgs<ExtArgs>>): Prisma__DocumentChunkClient<$Result.GetResult<Prisma.$DocumentChunkPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DocumentChunks.
     * @param {DocumentChunkCreateManyArgs} args - Arguments to create many DocumentChunks.
     * @example
     * // Create many DocumentChunks
     * const documentChunk = await prisma.documentChunk.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentChunkCreateManyArgs>(args?: SelectSubset<T, DocumentChunkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DocumentChunks and returns the data saved in the database.
     * @param {DocumentChunkCreateManyAndReturnArgs} args - Arguments to create many DocumentChunks.
     * @example
     * // Create many DocumentChunks
     * const documentChunk = await prisma.documentChunk.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DocumentChunks and only return the `id`
     * const documentChunkWithIdOnly = await prisma.documentChunk.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentChunkCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentChunkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentChunkPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DocumentChunk.
     * @param {DocumentChunkDeleteArgs} args - Arguments to delete one DocumentChunk.
     * @example
     * // Delete one DocumentChunk
     * const DocumentChunk = await prisma.documentChunk.delete({
     *   where: {
     *     // ... filter to delete one DocumentChunk
     *   }
     * })
     * 
     */
    delete<T extends DocumentChunkDeleteArgs>(args: SelectSubset<T, DocumentChunkDeleteArgs<ExtArgs>>): Prisma__DocumentChunkClient<$Result.GetResult<Prisma.$DocumentChunkPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DocumentChunk.
     * @param {DocumentChunkUpdateArgs} args - Arguments to update one DocumentChunk.
     * @example
     * // Update one DocumentChunk
     * const documentChunk = await prisma.documentChunk.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentChunkUpdateArgs>(args: SelectSubset<T, DocumentChunkUpdateArgs<ExtArgs>>): Prisma__DocumentChunkClient<$Result.GetResult<Prisma.$DocumentChunkPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DocumentChunks.
     * @param {DocumentChunkDeleteManyArgs} args - Arguments to filter DocumentChunks to delete.
     * @example
     * // Delete a few DocumentChunks
     * const { count } = await prisma.documentChunk.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentChunkDeleteManyArgs>(args?: SelectSubset<T, DocumentChunkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DocumentChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentChunkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DocumentChunks
     * const documentChunk = await prisma.documentChunk.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentChunkUpdateManyArgs>(args: SelectSubset<T, DocumentChunkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DocumentChunk.
     * @param {DocumentChunkUpsertArgs} args - Arguments to update or create a DocumentChunk.
     * @example
     * // Update or create a DocumentChunk
     * const documentChunk = await prisma.documentChunk.upsert({
     *   create: {
     *     // ... data to create a DocumentChunk
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DocumentChunk we want to update
     *   }
     * })
     */
    upsert<T extends DocumentChunkUpsertArgs>(args: SelectSubset<T, DocumentChunkUpsertArgs<ExtArgs>>): Prisma__DocumentChunkClient<$Result.GetResult<Prisma.$DocumentChunkPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DocumentChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentChunkCountArgs} args - Arguments to filter DocumentChunks to count.
     * @example
     * // Count the number of DocumentChunks
     * const count = await prisma.documentChunk.count({
     *   where: {
     *     // ... the filter for the DocumentChunks we want to count
     *   }
     * })
    **/
    count<T extends DocumentChunkCountArgs>(
      args?: Subset<T, DocumentChunkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentChunkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DocumentChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentChunkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentChunkAggregateArgs>(args: Subset<T, DocumentChunkAggregateArgs>): Prisma.PrismaPromise<GetDocumentChunkAggregateType<T>>

    /**
     * Group by DocumentChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentChunkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentChunkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentChunkGroupByArgs['orderBy'] }
        : { orderBy?: DocumentChunkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentChunkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentChunkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DocumentChunk model
   */
  readonly fields: DocumentChunkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DocumentChunk.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentChunkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    document<T extends DocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocumentDefaultArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DocumentChunk model
   */ 
  interface DocumentChunkFieldRefs {
    readonly id: FieldRef<"DocumentChunk", 'String'>
    readonly documentId: FieldRef<"DocumentChunk", 'String'>
    readonly content: FieldRef<"DocumentChunk", 'String'>
    readonly createdAt: FieldRef<"DocumentChunk", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DocumentChunk findUnique
   */
  export type DocumentChunkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkInclude<ExtArgs> | null
    /**
     * Filter, which DocumentChunk to fetch.
     */
    where: DocumentChunkWhereUniqueInput
  }

  /**
   * DocumentChunk findUniqueOrThrow
   */
  export type DocumentChunkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkInclude<ExtArgs> | null
    /**
     * Filter, which DocumentChunk to fetch.
     */
    where: DocumentChunkWhereUniqueInput
  }

  /**
   * DocumentChunk findFirst
   */
  export type DocumentChunkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkInclude<ExtArgs> | null
    /**
     * Filter, which DocumentChunk to fetch.
     */
    where?: DocumentChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentChunks to fetch.
     */
    orderBy?: DocumentChunkOrderByWithRelationInput | DocumentChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocumentChunks.
     */
    cursor?: DocumentChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocumentChunks.
     */
    distinct?: DocumentChunkScalarFieldEnum | DocumentChunkScalarFieldEnum[]
  }

  /**
   * DocumentChunk findFirstOrThrow
   */
  export type DocumentChunkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkInclude<ExtArgs> | null
    /**
     * Filter, which DocumentChunk to fetch.
     */
    where?: DocumentChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentChunks to fetch.
     */
    orderBy?: DocumentChunkOrderByWithRelationInput | DocumentChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocumentChunks.
     */
    cursor?: DocumentChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocumentChunks.
     */
    distinct?: DocumentChunkScalarFieldEnum | DocumentChunkScalarFieldEnum[]
  }

  /**
   * DocumentChunk findMany
   */
  export type DocumentChunkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkInclude<ExtArgs> | null
    /**
     * Filter, which DocumentChunks to fetch.
     */
    where?: DocumentChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentChunks to fetch.
     */
    orderBy?: DocumentChunkOrderByWithRelationInput | DocumentChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DocumentChunks.
     */
    cursor?: DocumentChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentChunks.
     */
    skip?: number
    distinct?: DocumentChunkScalarFieldEnum | DocumentChunkScalarFieldEnum[]
  }

  /**
   * DocumentChunk create
   */
  export type DocumentChunkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkInclude<ExtArgs> | null
    /**
     * The data needed to create a DocumentChunk.
     */
    data: XOR<DocumentChunkCreateInput, DocumentChunkUncheckedCreateInput>
  }

  /**
   * DocumentChunk createMany
   */
  export type DocumentChunkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DocumentChunks.
     */
    data: DocumentChunkCreateManyInput | DocumentChunkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DocumentChunk createManyAndReturn
   */
  export type DocumentChunkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DocumentChunks.
     */
    data: DocumentChunkCreateManyInput | DocumentChunkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DocumentChunk update
   */
  export type DocumentChunkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkInclude<ExtArgs> | null
    /**
     * The data needed to update a DocumentChunk.
     */
    data: XOR<DocumentChunkUpdateInput, DocumentChunkUncheckedUpdateInput>
    /**
     * Choose, which DocumentChunk to update.
     */
    where: DocumentChunkWhereUniqueInput
  }

  /**
   * DocumentChunk updateMany
   */
  export type DocumentChunkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DocumentChunks.
     */
    data: XOR<DocumentChunkUpdateManyMutationInput, DocumentChunkUncheckedUpdateManyInput>
    /**
     * Filter which DocumentChunks to update
     */
    where?: DocumentChunkWhereInput
  }

  /**
   * DocumentChunk upsert
   */
  export type DocumentChunkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkInclude<ExtArgs> | null
    /**
     * The filter to search for the DocumentChunk to update in case it exists.
     */
    where: DocumentChunkWhereUniqueInput
    /**
     * In case the DocumentChunk found by the `where` argument doesn't exist, create a new DocumentChunk with this data.
     */
    create: XOR<DocumentChunkCreateInput, DocumentChunkUncheckedCreateInput>
    /**
     * In case the DocumentChunk was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentChunkUpdateInput, DocumentChunkUncheckedUpdateInput>
  }

  /**
   * DocumentChunk delete
   */
  export type DocumentChunkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkInclude<ExtArgs> | null
    /**
     * Filter which DocumentChunk to delete.
     */
    where: DocumentChunkWhereUniqueInput
  }

  /**
   * DocumentChunk deleteMany
   */
  export type DocumentChunkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocumentChunks to delete
     */
    where?: DocumentChunkWhereInput
  }

  /**
   * DocumentChunk without action
   */
  export type DocumentChunkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentChunk
     */
    select?: DocumentChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentChunkInclude<ExtArgs> | null
  }


  /**
   * Model TokenUsage
   */

  export type AggregateTokenUsage = {
    _count: TokenUsageCountAggregateOutputType | null
    _avg: TokenUsageAvgAggregateOutputType | null
    _sum: TokenUsageSumAggregateOutputType | null
    _min: TokenUsageMinAggregateOutputType | null
    _max: TokenUsageMaxAggregateOutputType | null
  }

  export type TokenUsageAvgAggregateOutputType = {
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
  }

  export type TokenUsageSumAggregateOutputType = {
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
  }

  export type TokenUsageMinAggregateOutputType = {
    id: string | null
    userId: string | null
    modelName: string | null
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
    action: string | null
    createdAt: Date | null
  }

  export type TokenUsageMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    modelName: string | null
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
    action: string | null
    createdAt: Date | null
  }

  export type TokenUsageCountAggregateOutputType = {
    id: number
    userId: number
    modelName: number
    promptTokens: number
    completionTokens: number
    totalTokens: number
    action: number
    createdAt: number
    _all: number
  }


  export type TokenUsageAvgAggregateInputType = {
    promptTokens?: true
    completionTokens?: true
    totalTokens?: true
  }

  export type TokenUsageSumAggregateInputType = {
    promptTokens?: true
    completionTokens?: true
    totalTokens?: true
  }

  export type TokenUsageMinAggregateInputType = {
    id?: true
    userId?: true
    modelName?: true
    promptTokens?: true
    completionTokens?: true
    totalTokens?: true
    action?: true
    createdAt?: true
  }

  export type TokenUsageMaxAggregateInputType = {
    id?: true
    userId?: true
    modelName?: true
    promptTokens?: true
    completionTokens?: true
    totalTokens?: true
    action?: true
    createdAt?: true
  }

  export type TokenUsageCountAggregateInputType = {
    id?: true
    userId?: true
    modelName?: true
    promptTokens?: true
    completionTokens?: true
    totalTokens?: true
    action?: true
    createdAt?: true
    _all?: true
  }

  export type TokenUsageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TokenUsage to aggregate.
     */
    where?: TokenUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenUsages to fetch.
     */
    orderBy?: TokenUsageOrderByWithRelationInput | TokenUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TokenUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TokenUsages
    **/
    _count?: true | TokenUsageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TokenUsageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TokenUsageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TokenUsageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TokenUsageMaxAggregateInputType
  }

  export type GetTokenUsageAggregateType<T extends TokenUsageAggregateArgs> = {
        [P in keyof T & keyof AggregateTokenUsage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTokenUsage[P]>
      : GetScalarType<T[P], AggregateTokenUsage[P]>
  }




  export type TokenUsageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenUsageWhereInput
    orderBy?: TokenUsageOrderByWithAggregationInput | TokenUsageOrderByWithAggregationInput[]
    by: TokenUsageScalarFieldEnum[] | TokenUsageScalarFieldEnum
    having?: TokenUsageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TokenUsageCountAggregateInputType | true
    _avg?: TokenUsageAvgAggregateInputType
    _sum?: TokenUsageSumAggregateInputType
    _min?: TokenUsageMinAggregateInputType
    _max?: TokenUsageMaxAggregateInputType
  }

  export type TokenUsageGroupByOutputType = {
    id: string
    userId: string
    modelName: string
    promptTokens: number
    completionTokens: number
    totalTokens: number
    action: string
    createdAt: Date
    _count: TokenUsageCountAggregateOutputType | null
    _avg: TokenUsageAvgAggregateOutputType | null
    _sum: TokenUsageSumAggregateOutputType | null
    _min: TokenUsageMinAggregateOutputType | null
    _max: TokenUsageMaxAggregateOutputType | null
  }

  type GetTokenUsageGroupByPayload<T extends TokenUsageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TokenUsageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TokenUsageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TokenUsageGroupByOutputType[P]>
            : GetScalarType<T[P], TokenUsageGroupByOutputType[P]>
        }
      >
    >


  export type TokenUsageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    modelName?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    totalTokens?: boolean
    action?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tokenUsage"]>

  export type TokenUsageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    modelName?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    totalTokens?: boolean
    action?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tokenUsage"]>

  export type TokenUsageSelectScalar = {
    id?: boolean
    userId?: boolean
    modelName?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    totalTokens?: boolean
    action?: boolean
    createdAt?: boolean
  }

  export type TokenUsageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TokenUsageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TokenUsagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TokenUsage"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      modelName: string
      promptTokens: number
      completionTokens: number
      totalTokens: number
      action: string
      createdAt: Date
    }, ExtArgs["result"]["tokenUsage"]>
    composites: {}
  }

  type TokenUsageGetPayload<S extends boolean | null | undefined | TokenUsageDefaultArgs> = $Result.GetResult<Prisma.$TokenUsagePayload, S>

  type TokenUsageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TokenUsageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TokenUsageCountAggregateInputType | true
    }

  export interface TokenUsageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TokenUsage'], meta: { name: 'TokenUsage' } }
    /**
     * Find zero or one TokenUsage that matches the filter.
     * @param {TokenUsageFindUniqueArgs} args - Arguments to find a TokenUsage
     * @example
     * // Get one TokenUsage
     * const tokenUsage = await prisma.tokenUsage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TokenUsageFindUniqueArgs>(args: SelectSubset<T, TokenUsageFindUniqueArgs<ExtArgs>>): Prisma__TokenUsageClient<$Result.GetResult<Prisma.$TokenUsagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TokenUsage that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TokenUsageFindUniqueOrThrowArgs} args - Arguments to find a TokenUsage
     * @example
     * // Get one TokenUsage
     * const tokenUsage = await prisma.tokenUsage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TokenUsageFindUniqueOrThrowArgs>(args: SelectSubset<T, TokenUsageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TokenUsageClient<$Result.GetResult<Prisma.$TokenUsagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TokenUsage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUsageFindFirstArgs} args - Arguments to find a TokenUsage
     * @example
     * // Get one TokenUsage
     * const tokenUsage = await prisma.tokenUsage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TokenUsageFindFirstArgs>(args?: SelectSubset<T, TokenUsageFindFirstArgs<ExtArgs>>): Prisma__TokenUsageClient<$Result.GetResult<Prisma.$TokenUsagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TokenUsage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUsageFindFirstOrThrowArgs} args - Arguments to find a TokenUsage
     * @example
     * // Get one TokenUsage
     * const tokenUsage = await prisma.tokenUsage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TokenUsageFindFirstOrThrowArgs>(args?: SelectSubset<T, TokenUsageFindFirstOrThrowArgs<ExtArgs>>): Prisma__TokenUsageClient<$Result.GetResult<Prisma.$TokenUsagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TokenUsages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUsageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TokenUsages
     * const tokenUsages = await prisma.tokenUsage.findMany()
     * 
     * // Get first 10 TokenUsages
     * const tokenUsages = await prisma.tokenUsage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tokenUsageWithIdOnly = await prisma.tokenUsage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TokenUsageFindManyArgs>(args?: SelectSubset<T, TokenUsageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenUsagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TokenUsage.
     * @param {TokenUsageCreateArgs} args - Arguments to create a TokenUsage.
     * @example
     * // Create one TokenUsage
     * const TokenUsage = await prisma.tokenUsage.create({
     *   data: {
     *     // ... data to create a TokenUsage
     *   }
     * })
     * 
     */
    create<T extends TokenUsageCreateArgs>(args: SelectSubset<T, TokenUsageCreateArgs<ExtArgs>>): Prisma__TokenUsageClient<$Result.GetResult<Prisma.$TokenUsagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TokenUsages.
     * @param {TokenUsageCreateManyArgs} args - Arguments to create many TokenUsages.
     * @example
     * // Create many TokenUsages
     * const tokenUsage = await prisma.tokenUsage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TokenUsageCreateManyArgs>(args?: SelectSubset<T, TokenUsageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TokenUsages and returns the data saved in the database.
     * @param {TokenUsageCreateManyAndReturnArgs} args - Arguments to create many TokenUsages.
     * @example
     * // Create many TokenUsages
     * const tokenUsage = await prisma.tokenUsage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TokenUsages and only return the `id`
     * const tokenUsageWithIdOnly = await prisma.tokenUsage.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TokenUsageCreateManyAndReturnArgs>(args?: SelectSubset<T, TokenUsageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenUsagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TokenUsage.
     * @param {TokenUsageDeleteArgs} args - Arguments to delete one TokenUsage.
     * @example
     * // Delete one TokenUsage
     * const TokenUsage = await prisma.tokenUsage.delete({
     *   where: {
     *     // ... filter to delete one TokenUsage
     *   }
     * })
     * 
     */
    delete<T extends TokenUsageDeleteArgs>(args: SelectSubset<T, TokenUsageDeleteArgs<ExtArgs>>): Prisma__TokenUsageClient<$Result.GetResult<Prisma.$TokenUsagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TokenUsage.
     * @param {TokenUsageUpdateArgs} args - Arguments to update one TokenUsage.
     * @example
     * // Update one TokenUsage
     * const tokenUsage = await prisma.tokenUsage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TokenUsageUpdateArgs>(args: SelectSubset<T, TokenUsageUpdateArgs<ExtArgs>>): Prisma__TokenUsageClient<$Result.GetResult<Prisma.$TokenUsagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TokenUsages.
     * @param {TokenUsageDeleteManyArgs} args - Arguments to filter TokenUsages to delete.
     * @example
     * // Delete a few TokenUsages
     * const { count } = await prisma.tokenUsage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TokenUsageDeleteManyArgs>(args?: SelectSubset<T, TokenUsageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TokenUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUsageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TokenUsages
     * const tokenUsage = await prisma.tokenUsage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TokenUsageUpdateManyArgs>(args: SelectSubset<T, TokenUsageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TokenUsage.
     * @param {TokenUsageUpsertArgs} args - Arguments to update or create a TokenUsage.
     * @example
     * // Update or create a TokenUsage
     * const tokenUsage = await prisma.tokenUsage.upsert({
     *   create: {
     *     // ... data to create a TokenUsage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TokenUsage we want to update
     *   }
     * })
     */
    upsert<T extends TokenUsageUpsertArgs>(args: SelectSubset<T, TokenUsageUpsertArgs<ExtArgs>>): Prisma__TokenUsageClient<$Result.GetResult<Prisma.$TokenUsagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TokenUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUsageCountArgs} args - Arguments to filter TokenUsages to count.
     * @example
     * // Count the number of TokenUsages
     * const count = await prisma.tokenUsage.count({
     *   where: {
     *     // ... the filter for the TokenUsages we want to count
     *   }
     * })
    **/
    count<T extends TokenUsageCountArgs>(
      args?: Subset<T, TokenUsageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TokenUsageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TokenUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUsageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TokenUsageAggregateArgs>(args: Subset<T, TokenUsageAggregateArgs>): Prisma.PrismaPromise<GetTokenUsageAggregateType<T>>

    /**
     * Group by TokenUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUsageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TokenUsageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TokenUsageGroupByArgs['orderBy'] }
        : { orderBy?: TokenUsageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TokenUsageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTokenUsageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TokenUsage model
   */
  readonly fields: TokenUsageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TokenUsage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TokenUsageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TokenUsage model
   */ 
  interface TokenUsageFieldRefs {
    readonly id: FieldRef<"TokenUsage", 'String'>
    readonly userId: FieldRef<"TokenUsage", 'String'>
    readonly modelName: FieldRef<"TokenUsage", 'String'>
    readonly promptTokens: FieldRef<"TokenUsage", 'Int'>
    readonly completionTokens: FieldRef<"TokenUsage", 'Int'>
    readonly totalTokens: FieldRef<"TokenUsage", 'Int'>
    readonly action: FieldRef<"TokenUsage", 'String'>
    readonly createdAt: FieldRef<"TokenUsage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TokenUsage findUnique
   */
  export type TokenUsageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageInclude<ExtArgs> | null
    /**
     * Filter, which TokenUsage to fetch.
     */
    where: TokenUsageWhereUniqueInput
  }

  /**
   * TokenUsage findUniqueOrThrow
   */
  export type TokenUsageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageInclude<ExtArgs> | null
    /**
     * Filter, which TokenUsage to fetch.
     */
    where: TokenUsageWhereUniqueInput
  }

  /**
   * TokenUsage findFirst
   */
  export type TokenUsageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageInclude<ExtArgs> | null
    /**
     * Filter, which TokenUsage to fetch.
     */
    where?: TokenUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenUsages to fetch.
     */
    orderBy?: TokenUsageOrderByWithRelationInput | TokenUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TokenUsages.
     */
    cursor?: TokenUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TokenUsages.
     */
    distinct?: TokenUsageScalarFieldEnum | TokenUsageScalarFieldEnum[]
  }

  /**
   * TokenUsage findFirstOrThrow
   */
  export type TokenUsageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageInclude<ExtArgs> | null
    /**
     * Filter, which TokenUsage to fetch.
     */
    where?: TokenUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenUsages to fetch.
     */
    orderBy?: TokenUsageOrderByWithRelationInput | TokenUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TokenUsages.
     */
    cursor?: TokenUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TokenUsages.
     */
    distinct?: TokenUsageScalarFieldEnum | TokenUsageScalarFieldEnum[]
  }

  /**
   * TokenUsage findMany
   */
  export type TokenUsageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageInclude<ExtArgs> | null
    /**
     * Filter, which TokenUsages to fetch.
     */
    where?: TokenUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenUsages to fetch.
     */
    orderBy?: TokenUsageOrderByWithRelationInput | TokenUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TokenUsages.
     */
    cursor?: TokenUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenUsages.
     */
    skip?: number
    distinct?: TokenUsageScalarFieldEnum | TokenUsageScalarFieldEnum[]
  }

  /**
   * TokenUsage create
   */
  export type TokenUsageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageInclude<ExtArgs> | null
    /**
     * The data needed to create a TokenUsage.
     */
    data: XOR<TokenUsageCreateInput, TokenUsageUncheckedCreateInput>
  }

  /**
   * TokenUsage createMany
   */
  export type TokenUsageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TokenUsages.
     */
    data: TokenUsageCreateManyInput | TokenUsageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TokenUsage createManyAndReturn
   */
  export type TokenUsageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TokenUsages.
     */
    data: TokenUsageCreateManyInput | TokenUsageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TokenUsage update
   */
  export type TokenUsageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageInclude<ExtArgs> | null
    /**
     * The data needed to update a TokenUsage.
     */
    data: XOR<TokenUsageUpdateInput, TokenUsageUncheckedUpdateInput>
    /**
     * Choose, which TokenUsage to update.
     */
    where: TokenUsageWhereUniqueInput
  }

  /**
   * TokenUsage updateMany
   */
  export type TokenUsageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TokenUsages.
     */
    data: XOR<TokenUsageUpdateManyMutationInput, TokenUsageUncheckedUpdateManyInput>
    /**
     * Filter which TokenUsages to update
     */
    where?: TokenUsageWhereInput
  }

  /**
   * TokenUsage upsert
   */
  export type TokenUsageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageInclude<ExtArgs> | null
    /**
     * The filter to search for the TokenUsage to update in case it exists.
     */
    where: TokenUsageWhereUniqueInput
    /**
     * In case the TokenUsage found by the `where` argument doesn't exist, create a new TokenUsage with this data.
     */
    create: XOR<TokenUsageCreateInput, TokenUsageUncheckedCreateInput>
    /**
     * In case the TokenUsage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TokenUsageUpdateInput, TokenUsageUncheckedUpdateInput>
  }

  /**
   * TokenUsage delete
   */
  export type TokenUsageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageInclude<ExtArgs> | null
    /**
     * Filter which TokenUsage to delete.
     */
    where: TokenUsageWhereUniqueInput
  }

  /**
   * TokenUsage deleteMany
   */
  export type TokenUsageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TokenUsages to delete
     */
    where?: TokenUsageWhereInput
  }

  /**
   * TokenUsage without action
   */
  export type TokenUsageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenUsage
     */
    select?: TokenUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenUsageInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    customInstructions: 'customInstructions',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    token: 'token',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    lastActiveAt: 'lastActiveAt',
    activeSeconds: 'activeSeconds'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const BinderScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BinderScalarFieldEnum = (typeof BinderScalarFieldEnum)[keyof typeof BinderScalarFieldEnum]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    binderId: 'binderId',
    name: 'name',
    fileType: 'fileType',
    content: 'content',
    base64: 'base64',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const StudyHistoryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    query: 'query',
    response: 'response',
    createdAt: 'createdAt'
  };

  export type StudyHistoryScalarFieldEnum = (typeof StudyHistoryScalarFieldEnum)[keyof typeof StudyHistoryScalarFieldEnum]


  export const FlashcardScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    front: 'front',
    back: 'back',
    interval: 'interval',
    easeFactor: 'easeFactor',
    reps: 'reps',
    nextReview: 'nextReview',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FlashcardScalarFieldEnum = (typeof FlashcardScalarFieldEnum)[keyof typeof FlashcardScalarFieldEnum]


  export const DocumentChunkScalarFieldEnum: {
    id: 'id',
    documentId: 'documentId',
    content: 'content',
    createdAt: 'createdAt'
  };

  export type DocumentChunkScalarFieldEnum = (typeof DocumentChunkScalarFieldEnum)[keyof typeof DocumentChunkScalarFieldEnum]


  export const TokenUsageScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    modelName: 'modelName',
    promptTokens: 'promptTokens',
    completionTokens: 'completionTokens',
    totalTokens: 'totalTokens',
    action: 'action',
    createdAt: 'createdAt'
  };

  export type TokenUsageScalarFieldEnum = (typeof TokenUsageScalarFieldEnum)[keyof typeof TokenUsageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    customInstructions?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    binders?: BinderListRelationFilter
    studyHistory?: StudyHistoryListRelationFilter
    flashcards?: FlashcardListRelationFilter
    tokenUsages?: TokenUsageListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    customInstructions?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    binders?: BinderOrderByRelationAggregateInput
    studyHistory?: StudyHistoryOrderByRelationAggregateInput
    flashcards?: FlashcardOrderByRelationAggregateInput
    tokenUsages?: TokenUsageOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    customInstructions?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    binders?: BinderListRelationFilter
    studyHistory?: StudyHistoryListRelationFilter
    flashcards?: FlashcardListRelationFilter
    tokenUsages?: TokenUsageListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    customInstructions?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    customInstructions?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    token?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    lastActiveAt?: DateTimeFilter<"Session"> | Date | string
    activeSeconds?: IntFilter<"Session"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    lastActiveAt?: SortOrder
    activeSeconds?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    lastActiveAt?: DateTimeFilter<"Session"> | Date | string
    activeSeconds?: IntFilter<"Session"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    lastActiveAt?: SortOrder
    activeSeconds?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _avg?: SessionAvgOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
    _sum?: SessionSumOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    token?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    lastActiveAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    activeSeconds?: IntWithAggregatesFilter<"Session"> | number
  }

  export type BinderWhereInput = {
    AND?: BinderWhereInput | BinderWhereInput[]
    OR?: BinderWhereInput[]
    NOT?: BinderWhereInput | BinderWhereInput[]
    id?: StringFilter<"Binder"> | string
    userId?: StringFilter<"Binder"> | string
    name?: StringFilter<"Binder"> | string
    description?: StringNullableFilter<"Binder"> | string | null
    createdAt?: DateTimeFilter<"Binder"> | Date | string
    updatedAt?: DateTimeFilter<"Binder"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    documents?: DocumentListRelationFilter
  }

  export type BinderOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    documents?: DocumentOrderByRelationAggregateInput
  }

  export type BinderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BinderWhereInput | BinderWhereInput[]
    OR?: BinderWhereInput[]
    NOT?: BinderWhereInput | BinderWhereInput[]
    userId?: StringFilter<"Binder"> | string
    name?: StringFilter<"Binder"> | string
    description?: StringNullableFilter<"Binder"> | string | null
    createdAt?: DateTimeFilter<"Binder"> | Date | string
    updatedAt?: DateTimeFilter<"Binder"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    documents?: DocumentListRelationFilter
  }, "id">

  export type BinderOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BinderCountOrderByAggregateInput
    _max?: BinderMaxOrderByAggregateInput
    _min?: BinderMinOrderByAggregateInput
  }

  export type BinderScalarWhereWithAggregatesInput = {
    AND?: BinderScalarWhereWithAggregatesInput | BinderScalarWhereWithAggregatesInput[]
    OR?: BinderScalarWhereWithAggregatesInput[]
    NOT?: BinderScalarWhereWithAggregatesInput | BinderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Binder"> | string
    userId?: StringWithAggregatesFilter<"Binder"> | string
    name?: StringWithAggregatesFilter<"Binder"> | string
    description?: StringNullableWithAggregatesFilter<"Binder"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Binder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Binder"> | Date | string
  }

  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: StringFilter<"Document"> | string
    binderId?: StringFilter<"Document"> | string
    name?: StringFilter<"Document"> | string
    fileType?: StringFilter<"Document"> | string
    content?: StringFilter<"Document"> | string
    base64?: StringNullableFilter<"Document"> | string | null
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    binder?: XOR<BinderRelationFilter, BinderWhereInput>
    chunks?: DocumentChunkListRelationFilter
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    binderId?: SortOrder
    name?: SortOrder
    fileType?: SortOrder
    content?: SortOrder
    base64?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    binder?: BinderOrderByWithRelationInput
    chunks?: DocumentChunkOrderByRelationAggregateInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    binderId?: StringFilter<"Document"> | string
    name?: StringFilter<"Document"> | string
    fileType?: StringFilter<"Document"> | string
    content?: StringFilter<"Document"> | string
    base64?: StringNullableFilter<"Document"> | string | null
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    binder?: XOR<BinderRelationFilter, BinderWhereInput>
    chunks?: DocumentChunkListRelationFilter
  }, "id">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    binderId?: SortOrder
    name?: SortOrder
    fileType?: SortOrder
    content?: SortOrder
    base64?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Document"> | string
    binderId?: StringWithAggregatesFilter<"Document"> | string
    name?: StringWithAggregatesFilter<"Document"> | string
    fileType?: StringWithAggregatesFilter<"Document"> | string
    content?: StringWithAggregatesFilter<"Document"> | string
    base64?: StringNullableWithAggregatesFilter<"Document"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type StudyHistoryWhereInput = {
    AND?: StudyHistoryWhereInput | StudyHistoryWhereInput[]
    OR?: StudyHistoryWhereInput[]
    NOT?: StudyHistoryWhereInput | StudyHistoryWhereInput[]
    id?: StringFilter<"StudyHistory"> | string
    userId?: StringFilter<"StudyHistory"> | string
    query?: StringFilter<"StudyHistory"> | string
    response?: StringFilter<"StudyHistory"> | string
    createdAt?: DateTimeFilter<"StudyHistory"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type StudyHistoryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    response?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type StudyHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StudyHistoryWhereInput | StudyHistoryWhereInput[]
    OR?: StudyHistoryWhereInput[]
    NOT?: StudyHistoryWhereInput | StudyHistoryWhereInput[]
    userId?: StringFilter<"StudyHistory"> | string
    query?: StringFilter<"StudyHistory"> | string
    response?: StringFilter<"StudyHistory"> | string
    createdAt?: DateTimeFilter<"StudyHistory"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type StudyHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    response?: SortOrder
    createdAt?: SortOrder
    _count?: StudyHistoryCountOrderByAggregateInput
    _max?: StudyHistoryMaxOrderByAggregateInput
    _min?: StudyHistoryMinOrderByAggregateInput
  }

  export type StudyHistoryScalarWhereWithAggregatesInput = {
    AND?: StudyHistoryScalarWhereWithAggregatesInput | StudyHistoryScalarWhereWithAggregatesInput[]
    OR?: StudyHistoryScalarWhereWithAggregatesInput[]
    NOT?: StudyHistoryScalarWhereWithAggregatesInput | StudyHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudyHistory"> | string
    userId?: StringWithAggregatesFilter<"StudyHistory"> | string
    query?: StringWithAggregatesFilter<"StudyHistory"> | string
    response?: StringWithAggregatesFilter<"StudyHistory"> | string
    createdAt?: DateTimeWithAggregatesFilter<"StudyHistory"> | Date | string
  }

  export type FlashcardWhereInput = {
    AND?: FlashcardWhereInput | FlashcardWhereInput[]
    OR?: FlashcardWhereInput[]
    NOT?: FlashcardWhereInput | FlashcardWhereInput[]
    id?: StringFilter<"Flashcard"> | string
    userId?: StringFilter<"Flashcard"> | string
    front?: StringFilter<"Flashcard"> | string
    back?: StringFilter<"Flashcard"> | string
    interval?: IntFilter<"Flashcard"> | number
    easeFactor?: FloatFilter<"Flashcard"> | number
    reps?: IntFilter<"Flashcard"> | number
    nextReview?: DateTimeFilter<"Flashcard"> | Date | string
    createdAt?: DateTimeFilter<"Flashcard"> | Date | string
    updatedAt?: DateTimeFilter<"Flashcard"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type FlashcardOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    front?: SortOrder
    back?: SortOrder
    interval?: SortOrder
    easeFactor?: SortOrder
    reps?: SortOrder
    nextReview?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type FlashcardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FlashcardWhereInput | FlashcardWhereInput[]
    OR?: FlashcardWhereInput[]
    NOT?: FlashcardWhereInput | FlashcardWhereInput[]
    userId?: StringFilter<"Flashcard"> | string
    front?: StringFilter<"Flashcard"> | string
    back?: StringFilter<"Flashcard"> | string
    interval?: IntFilter<"Flashcard"> | number
    easeFactor?: FloatFilter<"Flashcard"> | number
    reps?: IntFilter<"Flashcard"> | number
    nextReview?: DateTimeFilter<"Flashcard"> | Date | string
    createdAt?: DateTimeFilter<"Flashcard"> | Date | string
    updatedAt?: DateTimeFilter<"Flashcard"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type FlashcardOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    front?: SortOrder
    back?: SortOrder
    interval?: SortOrder
    easeFactor?: SortOrder
    reps?: SortOrder
    nextReview?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FlashcardCountOrderByAggregateInput
    _avg?: FlashcardAvgOrderByAggregateInput
    _max?: FlashcardMaxOrderByAggregateInput
    _min?: FlashcardMinOrderByAggregateInput
    _sum?: FlashcardSumOrderByAggregateInput
  }

  export type FlashcardScalarWhereWithAggregatesInput = {
    AND?: FlashcardScalarWhereWithAggregatesInput | FlashcardScalarWhereWithAggregatesInput[]
    OR?: FlashcardScalarWhereWithAggregatesInput[]
    NOT?: FlashcardScalarWhereWithAggregatesInput | FlashcardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Flashcard"> | string
    userId?: StringWithAggregatesFilter<"Flashcard"> | string
    front?: StringWithAggregatesFilter<"Flashcard"> | string
    back?: StringWithAggregatesFilter<"Flashcard"> | string
    interval?: IntWithAggregatesFilter<"Flashcard"> | number
    easeFactor?: FloatWithAggregatesFilter<"Flashcard"> | number
    reps?: IntWithAggregatesFilter<"Flashcard"> | number
    nextReview?: DateTimeWithAggregatesFilter<"Flashcard"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Flashcard"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Flashcard"> | Date | string
  }

  export type DocumentChunkWhereInput = {
    AND?: DocumentChunkWhereInput | DocumentChunkWhereInput[]
    OR?: DocumentChunkWhereInput[]
    NOT?: DocumentChunkWhereInput | DocumentChunkWhereInput[]
    id?: StringFilter<"DocumentChunk"> | string
    documentId?: StringFilter<"DocumentChunk"> | string
    content?: StringFilter<"DocumentChunk"> | string
    createdAt?: DateTimeFilter<"DocumentChunk"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }

  export type DocumentChunkOrderByWithRelationInput = {
    id?: SortOrder
    documentId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    document?: DocumentOrderByWithRelationInput
  }

  export type DocumentChunkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DocumentChunkWhereInput | DocumentChunkWhereInput[]
    OR?: DocumentChunkWhereInput[]
    NOT?: DocumentChunkWhereInput | DocumentChunkWhereInput[]
    documentId?: StringFilter<"DocumentChunk"> | string
    content?: StringFilter<"DocumentChunk"> | string
    createdAt?: DateTimeFilter<"DocumentChunk"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }, "id">

  export type DocumentChunkOrderByWithAggregationInput = {
    id?: SortOrder
    documentId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    _count?: DocumentChunkCountOrderByAggregateInput
    _max?: DocumentChunkMaxOrderByAggregateInput
    _min?: DocumentChunkMinOrderByAggregateInput
  }

  export type DocumentChunkScalarWhereWithAggregatesInput = {
    AND?: DocumentChunkScalarWhereWithAggregatesInput | DocumentChunkScalarWhereWithAggregatesInput[]
    OR?: DocumentChunkScalarWhereWithAggregatesInput[]
    NOT?: DocumentChunkScalarWhereWithAggregatesInput | DocumentChunkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DocumentChunk"> | string
    documentId?: StringWithAggregatesFilter<"DocumentChunk"> | string
    content?: StringWithAggregatesFilter<"DocumentChunk"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DocumentChunk"> | Date | string
  }

  export type TokenUsageWhereInput = {
    AND?: TokenUsageWhereInput | TokenUsageWhereInput[]
    OR?: TokenUsageWhereInput[]
    NOT?: TokenUsageWhereInput | TokenUsageWhereInput[]
    id?: StringFilter<"TokenUsage"> | string
    userId?: StringFilter<"TokenUsage"> | string
    modelName?: StringFilter<"TokenUsage"> | string
    promptTokens?: IntFilter<"TokenUsage"> | number
    completionTokens?: IntFilter<"TokenUsage"> | number
    totalTokens?: IntFilter<"TokenUsage"> | number
    action?: StringFilter<"TokenUsage"> | string
    createdAt?: DateTimeFilter<"TokenUsage"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type TokenUsageOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    modelName?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TokenUsageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TokenUsageWhereInput | TokenUsageWhereInput[]
    OR?: TokenUsageWhereInput[]
    NOT?: TokenUsageWhereInput | TokenUsageWhereInput[]
    userId?: StringFilter<"TokenUsage"> | string
    modelName?: StringFilter<"TokenUsage"> | string
    promptTokens?: IntFilter<"TokenUsage"> | number
    completionTokens?: IntFilter<"TokenUsage"> | number
    totalTokens?: IntFilter<"TokenUsage"> | number
    action?: StringFilter<"TokenUsage"> | string
    createdAt?: DateTimeFilter<"TokenUsage"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type TokenUsageOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    modelName?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
    _count?: TokenUsageCountOrderByAggregateInput
    _avg?: TokenUsageAvgOrderByAggregateInput
    _max?: TokenUsageMaxOrderByAggregateInput
    _min?: TokenUsageMinOrderByAggregateInput
    _sum?: TokenUsageSumOrderByAggregateInput
  }

  export type TokenUsageScalarWhereWithAggregatesInput = {
    AND?: TokenUsageScalarWhereWithAggregatesInput | TokenUsageScalarWhereWithAggregatesInput[]
    OR?: TokenUsageScalarWhereWithAggregatesInput[]
    NOT?: TokenUsageScalarWhereWithAggregatesInput | TokenUsageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TokenUsage"> | string
    userId?: StringWithAggregatesFilter<"TokenUsage"> | string
    modelName?: StringWithAggregatesFilter<"TokenUsage"> | string
    promptTokens?: IntWithAggregatesFilter<"TokenUsage"> | number
    completionTokens?: IntWithAggregatesFilter<"TokenUsage"> | number
    totalTokens?: IntWithAggregatesFilter<"TokenUsage"> | number
    action?: StringWithAggregatesFilter<"TokenUsage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TokenUsage"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    binders?: BinderCreateNestedManyWithoutUserInput
    studyHistory?: StudyHistoryCreateNestedManyWithoutUserInput
    flashcards?: FlashcardCreateNestedManyWithoutUserInput
    tokenUsages?: TokenUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    binders?: BinderUncheckedCreateNestedManyWithoutUserInput
    studyHistory?: StudyHistoryUncheckedCreateNestedManyWithoutUserInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUserInput
    tokenUsages?: TokenUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    binders?: BinderUpdateManyWithoutUserNestedInput
    studyHistory?: StudyHistoryUpdateManyWithoutUserNestedInput
    flashcards?: FlashcardUpdateManyWithoutUserNestedInput
    tokenUsages?: TokenUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    binders?: BinderUncheckedUpdateManyWithoutUserNestedInput
    studyHistory?: StudyHistoryUncheckedUpdateManyWithoutUserNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUserNestedInput
    tokenUsages?: TokenUsageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    lastActiveAt?: Date | string
    activeSeconds?: number
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    userId: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    lastActiveAt?: Date | string
    activeSeconds?: number
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSeconds?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSeconds?: IntFieldUpdateOperationsInput | number
  }

  export type SessionCreateManyInput = {
    id?: string
    userId: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    lastActiveAt?: Date | string
    activeSeconds?: number
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSeconds?: IntFieldUpdateOperationsInput | number
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSeconds?: IntFieldUpdateOperationsInput | number
  }

  export type BinderCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBindersInput
    documents?: DocumentCreateNestedManyWithoutBinderInput
  }

  export type BinderUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutBinderInput
  }

  export type BinderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBindersNestedInput
    documents?: DocumentUpdateManyWithoutBinderNestedInput
  }

  export type BinderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutBinderNestedInput
  }

  export type BinderCreateManyInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BinderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BinderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateInput = {
    id?: string
    name: string
    fileType: string
    content: string
    base64?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    binder: BinderCreateNestedOneWithoutDocumentsInput
    chunks?: DocumentChunkCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: string
    binderId: string
    name: string
    fileType: string
    content: string
    base64?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    chunks?: DocumentChunkUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    base64?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    binder?: BinderUpdateOneRequiredWithoutDocumentsNestedInput
    chunks?: DocumentChunkUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    binderId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    base64?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chunks?: DocumentChunkUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentCreateManyInput = {
    id?: string
    binderId: string
    name: string
    fileType: string
    content: string
    base64?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    base64?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    binderId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    base64?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudyHistoryCreateInput = {
    id?: string
    query: string
    response: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutStudyHistoryInput
  }

  export type StudyHistoryUncheckedCreateInput = {
    id?: string
    userId: string
    query: string
    response: string
    createdAt?: Date | string
  }

  export type StudyHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudyHistoryNestedInput
  }

  export type StudyHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudyHistoryCreateManyInput = {
    id?: string
    userId: string
    query: string
    response: string
    createdAt?: Date | string
  }

  export type StudyHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudyHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlashcardCreateInput = {
    id?: string
    front: string
    back: string
    interval?: number
    easeFactor?: number
    reps?: number
    nextReview?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutFlashcardsInput
  }

  export type FlashcardUncheckedCreateInput = {
    id?: string
    userId: string
    front: string
    back: string
    interval?: number
    easeFactor?: number
    reps?: number
    nextReview?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FlashcardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    interval?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    reps?: IntFieldUpdateOperationsInput | number
    nextReview?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutFlashcardsNestedInput
  }

  export type FlashcardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    interval?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    reps?: IntFieldUpdateOperationsInput | number
    nextReview?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlashcardCreateManyInput = {
    id?: string
    userId: string
    front: string
    back: string
    interval?: number
    easeFactor?: number
    reps?: number
    nextReview?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FlashcardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    interval?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    reps?: IntFieldUpdateOperationsInput | number
    nextReview?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlashcardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    interval?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    reps?: IntFieldUpdateOperationsInput | number
    nextReview?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentChunkCreateInput = {
    id?: string
    content: string
    createdAt?: Date | string
    document: DocumentCreateNestedOneWithoutChunksInput
  }

  export type DocumentChunkUncheckedCreateInput = {
    id?: string
    documentId: string
    content: string
    createdAt?: Date | string
  }

  export type DocumentChunkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneRequiredWithoutChunksNestedInput
  }

  export type DocumentChunkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentChunkCreateManyInput = {
    id?: string
    documentId: string
    content: string
    createdAt?: Date | string
  }

  export type DocumentChunkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentChunkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUsageCreateInput = {
    id?: string
    modelName: string
    promptTokens: number
    completionTokens: number
    totalTokens: number
    action: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutTokenUsagesInput
  }

  export type TokenUsageUncheckedCreateInput = {
    id?: string
    userId: string
    modelName: string
    promptTokens: number
    completionTokens: number
    totalTokens: number
    action: string
    createdAt?: Date | string
  }

  export type TokenUsageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    totalTokens?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTokenUsagesNestedInput
  }

  export type TokenUsageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    totalTokens?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUsageCreateManyInput = {
    id?: string
    userId: string
    modelName: string
    promptTokens: number
    completionTokens: number
    totalTokens: number
    action: string
    createdAt?: Date | string
  }

  export type TokenUsageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    totalTokens?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUsageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    totalTokens?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type BinderListRelationFilter = {
    every?: BinderWhereInput
    some?: BinderWhereInput
    none?: BinderWhereInput
  }

  export type StudyHistoryListRelationFilter = {
    every?: StudyHistoryWhereInput
    some?: StudyHistoryWhereInput
    none?: StudyHistoryWhereInput
  }

  export type FlashcardListRelationFilter = {
    every?: FlashcardWhereInput
    some?: FlashcardWhereInput
    none?: FlashcardWhereInput
  }

  export type TokenUsageListRelationFilter = {
    every?: TokenUsageWhereInput
    some?: TokenUsageWhereInput
    none?: TokenUsageWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BinderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudyHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FlashcardOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TokenUsageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    customInstructions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    customInstructions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    customInstructions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    lastActiveAt?: SortOrder
    activeSeconds?: SortOrder
  }

  export type SessionAvgOrderByAggregateInput = {
    activeSeconds?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    lastActiveAt?: SortOrder
    activeSeconds?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    lastActiveAt?: SortOrder
    activeSeconds?: SortOrder
  }

  export type SessionSumOrderByAggregateInput = {
    activeSeconds?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DocumentListRelationFilter = {
    every?: DocumentWhereInput
    some?: DocumentWhereInput
    none?: DocumentWhereInput
  }

  export type DocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BinderCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BinderMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BinderMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BinderRelationFilter = {
    is?: BinderWhereInput
    isNot?: BinderWhereInput
  }

  export type DocumentChunkListRelationFilter = {
    every?: DocumentChunkWhereInput
    some?: DocumentChunkWhereInput
    none?: DocumentChunkWhereInput
  }

  export type DocumentChunkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    binderId?: SortOrder
    name?: SortOrder
    fileType?: SortOrder
    content?: SortOrder
    base64?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    binderId?: SortOrder
    name?: SortOrder
    fileType?: SortOrder
    content?: SortOrder
    base64?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    binderId?: SortOrder
    name?: SortOrder
    fileType?: SortOrder
    content?: SortOrder
    base64?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudyHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    response?: SortOrder
    createdAt?: SortOrder
  }

  export type StudyHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    response?: SortOrder
    createdAt?: SortOrder
  }

  export type StudyHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    response?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type FlashcardCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    front?: SortOrder
    back?: SortOrder
    interval?: SortOrder
    easeFactor?: SortOrder
    reps?: SortOrder
    nextReview?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FlashcardAvgOrderByAggregateInput = {
    interval?: SortOrder
    easeFactor?: SortOrder
    reps?: SortOrder
  }

  export type FlashcardMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    front?: SortOrder
    back?: SortOrder
    interval?: SortOrder
    easeFactor?: SortOrder
    reps?: SortOrder
    nextReview?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FlashcardMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    front?: SortOrder
    back?: SortOrder
    interval?: SortOrder
    easeFactor?: SortOrder
    reps?: SortOrder
    nextReview?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FlashcardSumOrderByAggregateInput = {
    interval?: SortOrder
    easeFactor?: SortOrder
    reps?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DocumentRelationFilter = {
    is?: DocumentWhereInput
    isNot?: DocumentWhereInput
  }

  export type DocumentChunkCountOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type DocumentChunkMaxOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type DocumentChunkMinOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenUsageCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    modelName?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenUsageAvgOrderByAggregateInput = {
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
  }

  export type TokenUsageMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    modelName?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenUsageMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    modelName?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenUsageSumOrderByAggregateInput = {
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type BinderCreateNestedManyWithoutUserInput = {
    create?: XOR<BinderCreateWithoutUserInput, BinderUncheckedCreateWithoutUserInput> | BinderCreateWithoutUserInput[] | BinderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BinderCreateOrConnectWithoutUserInput | BinderCreateOrConnectWithoutUserInput[]
    createMany?: BinderCreateManyUserInputEnvelope
    connect?: BinderWhereUniqueInput | BinderWhereUniqueInput[]
  }

  export type StudyHistoryCreateNestedManyWithoutUserInput = {
    create?: XOR<StudyHistoryCreateWithoutUserInput, StudyHistoryUncheckedCreateWithoutUserInput> | StudyHistoryCreateWithoutUserInput[] | StudyHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StudyHistoryCreateOrConnectWithoutUserInput | StudyHistoryCreateOrConnectWithoutUserInput[]
    createMany?: StudyHistoryCreateManyUserInputEnvelope
    connect?: StudyHistoryWhereUniqueInput | StudyHistoryWhereUniqueInput[]
  }

  export type FlashcardCreateNestedManyWithoutUserInput = {
    create?: XOR<FlashcardCreateWithoutUserInput, FlashcardUncheckedCreateWithoutUserInput> | FlashcardCreateWithoutUserInput[] | FlashcardUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutUserInput | FlashcardCreateOrConnectWithoutUserInput[]
    createMany?: FlashcardCreateManyUserInputEnvelope
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
  }

  export type TokenUsageCreateNestedManyWithoutUserInput = {
    create?: XOR<TokenUsageCreateWithoutUserInput, TokenUsageUncheckedCreateWithoutUserInput> | TokenUsageCreateWithoutUserInput[] | TokenUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenUsageCreateOrConnectWithoutUserInput | TokenUsageCreateOrConnectWithoutUserInput[]
    createMany?: TokenUsageCreateManyUserInputEnvelope
    connect?: TokenUsageWhereUniqueInput | TokenUsageWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type BinderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BinderCreateWithoutUserInput, BinderUncheckedCreateWithoutUserInput> | BinderCreateWithoutUserInput[] | BinderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BinderCreateOrConnectWithoutUserInput | BinderCreateOrConnectWithoutUserInput[]
    createMany?: BinderCreateManyUserInputEnvelope
    connect?: BinderWhereUniqueInput | BinderWhereUniqueInput[]
  }

  export type StudyHistoryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<StudyHistoryCreateWithoutUserInput, StudyHistoryUncheckedCreateWithoutUserInput> | StudyHistoryCreateWithoutUserInput[] | StudyHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StudyHistoryCreateOrConnectWithoutUserInput | StudyHistoryCreateOrConnectWithoutUserInput[]
    createMany?: StudyHistoryCreateManyUserInputEnvelope
    connect?: StudyHistoryWhereUniqueInput | StudyHistoryWhereUniqueInput[]
  }

  export type FlashcardUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FlashcardCreateWithoutUserInput, FlashcardUncheckedCreateWithoutUserInput> | FlashcardCreateWithoutUserInput[] | FlashcardUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutUserInput | FlashcardCreateOrConnectWithoutUserInput[]
    createMany?: FlashcardCreateManyUserInputEnvelope
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
  }

  export type TokenUsageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TokenUsageCreateWithoutUserInput, TokenUsageUncheckedCreateWithoutUserInput> | TokenUsageCreateWithoutUserInput[] | TokenUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenUsageCreateOrConnectWithoutUserInput | TokenUsageCreateOrConnectWithoutUserInput[]
    createMany?: TokenUsageCreateManyUserInputEnvelope
    connect?: TokenUsageWhereUniqueInput | TokenUsageWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type BinderUpdateManyWithoutUserNestedInput = {
    create?: XOR<BinderCreateWithoutUserInput, BinderUncheckedCreateWithoutUserInput> | BinderCreateWithoutUserInput[] | BinderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BinderCreateOrConnectWithoutUserInput | BinderCreateOrConnectWithoutUserInput[]
    upsert?: BinderUpsertWithWhereUniqueWithoutUserInput | BinderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BinderCreateManyUserInputEnvelope
    set?: BinderWhereUniqueInput | BinderWhereUniqueInput[]
    disconnect?: BinderWhereUniqueInput | BinderWhereUniqueInput[]
    delete?: BinderWhereUniqueInput | BinderWhereUniqueInput[]
    connect?: BinderWhereUniqueInput | BinderWhereUniqueInput[]
    update?: BinderUpdateWithWhereUniqueWithoutUserInput | BinderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BinderUpdateManyWithWhereWithoutUserInput | BinderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BinderScalarWhereInput | BinderScalarWhereInput[]
  }

  export type StudyHistoryUpdateManyWithoutUserNestedInput = {
    create?: XOR<StudyHistoryCreateWithoutUserInput, StudyHistoryUncheckedCreateWithoutUserInput> | StudyHistoryCreateWithoutUserInput[] | StudyHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StudyHistoryCreateOrConnectWithoutUserInput | StudyHistoryCreateOrConnectWithoutUserInput[]
    upsert?: StudyHistoryUpsertWithWhereUniqueWithoutUserInput | StudyHistoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: StudyHistoryCreateManyUserInputEnvelope
    set?: StudyHistoryWhereUniqueInput | StudyHistoryWhereUniqueInput[]
    disconnect?: StudyHistoryWhereUniqueInput | StudyHistoryWhereUniqueInput[]
    delete?: StudyHistoryWhereUniqueInput | StudyHistoryWhereUniqueInput[]
    connect?: StudyHistoryWhereUniqueInput | StudyHistoryWhereUniqueInput[]
    update?: StudyHistoryUpdateWithWhereUniqueWithoutUserInput | StudyHistoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: StudyHistoryUpdateManyWithWhereWithoutUserInput | StudyHistoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: StudyHistoryScalarWhereInput | StudyHistoryScalarWhereInput[]
  }

  export type FlashcardUpdateManyWithoutUserNestedInput = {
    create?: XOR<FlashcardCreateWithoutUserInput, FlashcardUncheckedCreateWithoutUserInput> | FlashcardCreateWithoutUserInput[] | FlashcardUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutUserInput | FlashcardCreateOrConnectWithoutUserInput[]
    upsert?: FlashcardUpsertWithWhereUniqueWithoutUserInput | FlashcardUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FlashcardCreateManyUserInputEnvelope
    set?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    disconnect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    delete?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    update?: FlashcardUpdateWithWhereUniqueWithoutUserInput | FlashcardUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FlashcardUpdateManyWithWhereWithoutUserInput | FlashcardUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
  }

  export type TokenUsageUpdateManyWithoutUserNestedInput = {
    create?: XOR<TokenUsageCreateWithoutUserInput, TokenUsageUncheckedCreateWithoutUserInput> | TokenUsageCreateWithoutUserInput[] | TokenUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenUsageCreateOrConnectWithoutUserInput | TokenUsageCreateOrConnectWithoutUserInput[]
    upsert?: TokenUsageUpsertWithWhereUniqueWithoutUserInput | TokenUsageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TokenUsageCreateManyUserInputEnvelope
    set?: TokenUsageWhereUniqueInput | TokenUsageWhereUniqueInput[]
    disconnect?: TokenUsageWhereUniqueInput | TokenUsageWhereUniqueInput[]
    delete?: TokenUsageWhereUniqueInput | TokenUsageWhereUniqueInput[]
    connect?: TokenUsageWhereUniqueInput | TokenUsageWhereUniqueInput[]
    update?: TokenUsageUpdateWithWhereUniqueWithoutUserInput | TokenUsageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TokenUsageUpdateManyWithWhereWithoutUserInput | TokenUsageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TokenUsageScalarWhereInput | TokenUsageScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type BinderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BinderCreateWithoutUserInput, BinderUncheckedCreateWithoutUserInput> | BinderCreateWithoutUserInput[] | BinderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BinderCreateOrConnectWithoutUserInput | BinderCreateOrConnectWithoutUserInput[]
    upsert?: BinderUpsertWithWhereUniqueWithoutUserInput | BinderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BinderCreateManyUserInputEnvelope
    set?: BinderWhereUniqueInput | BinderWhereUniqueInput[]
    disconnect?: BinderWhereUniqueInput | BinderWhereUniqueInput[]
    delete?: BinderWhereUniqueInput | BinderWhereUniqueInput[]
    connect?: BinderWhereUniqueInput | BinderWhereUniqueInput[]
    update?: BinderUpdateWithWhereUniqueWithoutUserInput | BinderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BinderUpdateManyWithWhereWithoutUserInput | BinderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BinderScalarWhereInput | BinderScalarWhereInput[]
  }

  export type StudyHistoryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<StudyHistoryCreateWithoutUserInput, StudyHistoryUncheckedCreateWithoutUserInput> | StudyHistoryCreateWithoutUserInput[] | StudyHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StudyHistoryCreateOrConnectWithoutUserInput | StudyHistoryCreateOrConnectWithoutUserInput[]
    upsert?: StudyHistoryUpsertWithWhereUniqueWithoutUserInput | StudyHistoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: StudyHistoryCreateManyUserInputEnvelope
    set?: StudyHistoryWhereUniqueInput | StudyHistoryWhereUniqueInput[]
    disconnect?: StudyHistoryWhereUniqueInput | StudyHistoryWhereUniqueInput[]
    delete?: StudyHistoryWhereUniqueInput | StudyHistoryWhereUniqueInput[]
    connect?: StudyHistoryWhereUniqueInput | StudyHistoryWhereUniqueInput[]
    update?: StudyHistoryUpdateWithWhereUniqueWithoutUserInput | StudyHistoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: StudyHistoryUpdateManyWithWhereWithoutUserInput | StudyHistoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: StudyHistoryScalarWhereInput | StudyHistoryScalarWhereInput[]
  }

  export type FlashcardUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FlashcardCreateWithoutUserInput, FlashcardUncheckedCreateWithoutUserInput> | FlashcardCreateWithoutUserInput[] | FlashcardUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutUserInput | FlashcardCreateOrConnectWithoutUserInput[]
    upsert?: FlashcardUpsertWithWhereUniqueWithoutUserInput | FlashcardUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FlashcardCreateManyUserInputEnvelope
    set?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    disconnect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    delete?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    update?: FlashcardUpdateWithWhereUniqueWithoutUserInput | FlashcardUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FlashcardUpdateManyWithWhereWithoutUserInput | FlashcardUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
  }

  export type TokenUsageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TokenUsageCreateWithoutUserInput, TokenUsageUncheckedCreateWithoutUserInput> | TokenUsageCreateWithoutUserInput[] | TokenUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenUsageCreateOrConnectWithoutUserInput | TokenUsageCreateOrConnectWithoutUserInput[]
    upsert?: TokenUsageUpsertWithWhereUniqueWithoutUserInput | TokenUsageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TokenUsageCreateManyUserInputEnvelope
    set?: TokenUsageWhereUniqueInput | TokenUsageWhereUniqueInput[]
    disconnect?: TokenUsageWhereUniqueInput | TokenUsageWhereUniqueInput[]
    delete?: TokenUsageWhereUniqueInput | TokenUsageWhereUniqueInput[]
    connect?: TokenUsageWhereUniqueInput | TokenUsageWhereUniqueInput[]
    update?: TokenUsageUpdateWithWhereUniqueWithoutUserInput | TokenUsageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TokenUsageUpdateManyWithWhereWithoutUserInput | TokenUsageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TokenUsageScalarWhereInput | TokenUsageScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutBindersInput = {
    create?: XOR<UserCreateWithoutBindersInput, UserUncheckedCreateWithoutBindersInput>
    connectOrCreate?: UserCreateOrConnectWithoutBindersInput
    connect?: UserWhereUniqueInput
  }

  export type DocumentCreateNestedManyWithoutBinderInput = {
    create?: XOR<DocumentCreateWithoutBinderInput, DocumentUncheckedCreateWithoutBinderInput> | DocumentCreateWithoutBinderInput[] | DocumentUncheckedCreateWithoutBinderInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutBinderInput | DocumentCreateOrConnectWithoutBinderInput[]
    createMany?: DocumentCreateManyBinderInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutBinderInput = {
    create?: XOR<DocumentCreateWithoutBinderInput, DocumentUncheckedCreateWithoutBinderInput> | DocumentCreateWithoutBinderInput[] | DocumentUncheckedCreateWithoutBinderInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutBinderInput | DocumentCreateOrConnectWithoutBinderInput[]
    createMany?: DocumentCreateManyBinderInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutBindersNestedInput = {
    create?: XOR<UserCreateWithoutBindersInput, UserUncheckedCreateWithoutBindersInput>
    connectOrCreate?: UserCreateOrConnectWithoutBindersInput
    upsert?: UserUpsertWithoutBindersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBindersInput, UserUpdateWithoutBindersInput>, UserUncheckedUpdateWithoutBindersInput>
  }

  export type DocumentUpdateManyWithoutBinderNestedInput = {
    create?: XOR<DocumentCreateWithoutBinderInput, DocumentUncheckedCreateWithoutBinderInput> | DocumentCreateWithoutBinderInput[] | DocumentUncheckedCreateWithoutBinderInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutBinderInput | DocumentCreateOrConnectWithoutBinderInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutBinderInput | DocumentUpsertWithWhereUniqueWithoutBinderInput[]
    createMany?: DocumentCreateManyBinderInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutBinderInput | DocumentUpdateWithWhereUniqueWithoutBinderInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutBinderInput | DocumentUpdateManyWithWhereWithoutBinderInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type DocumentUncheckedUpdateManyWithoutBinderNestedInput = {
    create?: XOR<DocumentCreateWithoutBinderInput, DocumentUncheckedCreateWithoutBinderInput> | DocumentCreateWithoutBinderInput[] | DocumentUncheckedCreateWithoutBinderInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutBinderInput | DocumentCreateOrConnectWithoutBinderInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutBinderInput | DocumentUpsertWithWhereUniqueWithoutBinderInput[]
    createMany?: DocumentCreateManyBinderInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutBinderInput | DocumentUpdateWithWhereUniqueWithoutBinderInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutBinderInput | DocumentUpdateManyWithWhereWithoutBinderInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type BinderCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<BinderCreateWithoutDocumentsInput, BinderUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: BinderCreateOrConnectWithoutDocumentsInput
    connect?: BinderWhereUniqueInput
  }

  export type DocumentChunkCreateNestedManyWithoutDocumentInput = {
    create?: XOR<DocumentChunkCreateWithoutDocumentInput, DocumentChunkUncheckedCreateWithoutDocumentInput> | DocumentChunkCreateWithoutDocumentInput[] | DocumentChunkUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: DocumentChunkCreateOrConnectWithoutDocumentInput | DocumentChunkCreateOrConnectWithoutDocumentInput[]
    createMany?: DocumentChunkCreateManyDocumentInputEnvelope
    connect?: DocumentChunkWhereUniqueInput | DocumentChunkWhereUniqueInput[]
  }

  export type DocumentChunkUncheckedCreateNestedManyWithoutDocumentInput = {
    create?: XOR<DocumentChunkCreateWithoutDocumentInput, DocumentChunkUncheckedCreateWithoutDocumentInput> | DocumentChunkCreateWithoutDocumentInput[] | DocumentChunkUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: DocumentChunkCreateOrConnectWithoutDocumentInput | DocumentChunkCreateOrConnectWithoutDocumentInput[]
    createMany?: DocumentChunkCreateManyDocumentInputEnvelope
    connect?: DocumentChunkWhereUniqueInput | DocumentChunkWhereUniqueInput[]
  }

  export type BinderUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<BinderCreateWithoutDocumentsInput, BinderUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: BinderCreateOrConnectWithoutDocumentsInput
    upsert?: BinderUpsertWithoutDocumentsInput
    connect?: BinderWhereUniqueInput
    update?: XOR<XOR<BinderUpdateToOneWithWhereWithoutDocumentsInput, BinderUpdateWithoutDocumentsInput>, BinderUncheckedUpdateWithoutDocumentsInput>
  }

  export type DocumentChunkUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<DocumentChunkCreateWithoutDocumentInput, DocumentChunkUncheckedCreateWithoutDocumentInput> | DocumentChunkCreateWithoutDocumentInput[] | DocumentChunkUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: DocumentChunkCreateOrConnectWithoutDocumentInput | DocumentChunkCreateOrConnectWithoutDocumentInput[]
    upsert?: DocumentChunkUpsertWithWhereUniqueWithoutDocumentInput | DocumentChunkUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: DocumentChunkCreateManyDocumentInputEnvelope
    set?: DocumentChunkWhereUniqueInput | DocumentChunkWhereUniqueInput[]
    disconnect?: DocumentChunkWhereUniqueInput | DocumentChunkWhereUniqueInput[]
    delete?: DocumentChunkWhereUniqueInput | DocumentChunkWhereUniqueInput[]
    connect?: DocumentChunkWhereUniqueInput | DocumentChunkWhereUniqueInput[]
    update?: DocumentChunkUpdateWithWhereUniqueWithoutDocumentInput | DocumentChunkUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: DocumentChunkUpdateManyWithWhereWithoutDocumentInput | DocumentChunkUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: DocumentChunkScalarWhereInput | DocumentChunkScalarWhereInput[]
  }

  export type DocumentChunkUncheckedUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<DocumentChunkCreateWithoutDocumentInput, DocumentChunkUncheckedCreateWithoutDocumentInput> | DocumentChunkCreateWithoutDocumentInput[] | DocumentChunkUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: DocumentChunkCreateOrConnectWithoutDocumentInput | DocumentChunkCreateOrConnectWithoutDocumentInput[]
    upsert?: DocumentChunkUpsertWithWhereUniqueWithoutDocumentInput | DocumentChunkUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: DocumentChunkCreateManyDocumentInputEnvelope
    set?: DocumentChunkWhereUniqueInput | DocumentChunkWhereUniqueInput[]
    disconnect?: DocumentChunkWhereUniqueInput | DocumentChunkWhereUniqueInput[]
    delete?: DocumentChunkWhereUniqueInput | DocumentChunkWhereUniqueInput[]
    connect?: DocumentChunkWhereUniqueInput | DocumentChunkWhereUniqueInput[]
    update?: DocumentChunkUpdateWithWhereUniqueWithoutDocumentInput | DocumentChunkUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: DocumentChunkUpdateManyWithWhereWithoutDocumentInput | DocumentChunkUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: DocumentChunkScalarWhereInput | DocumentChunkScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutStudyHistoryInput = {
    create?: XOR<UserCreateWithoutStudyHistoryInput, UserUncheckedCreateWithoutStudyHistoryInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudyHistoryInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutStudyHistoryNestedInput = {
    create?: XOR<UserCreateWithoutStudyHistoryInput, UserUncheckedCreateWithoutStudyHistoryInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudyHistoryInput
    upsert?: UserUpsertWithoutStudyHistoryInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStudyHistoryInput, UserUpdateWithoutStudyHistoryInput>, UserUncheckedUpdateWithoutStudyHistoryInput>
  }

  export type UserCreateNestedOneWithoutFlashcardsInput = {
    create?: XOR<UserCreateWithoutFlashcardsInput, UserUncheckedCreateWithoutFlashcardsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFlashcardsInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutFlashcardsNestedInput = {
    create?: XOR<UserCreateWithoutFlashcardsInput, UserUncheckedCreateWithoutFlashcardsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFlashcardsInput
    upsert?: UserUpsertWithoutFlashcardsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFlashcardsInput, UserUpdateWithoutFlashcardsInput>, UserUncheckedUpdateWithoutFlashcardsInput>
  }

  export type DocumentCreateNestedOneWithoutChunksInput = {
    create?: XOR<DocumentCreateWithoutChunksInput, DocumentUncheckedCreateWithoutChunksInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutChunksInput
    connect?: DocumentWhereUniqueInput
  }

  export type DocumentUpdateOneRequiredWithoutChunksNestedInput = {
    create?: XOR<DocumentCreateWithoutChunksInput, DocumentUncheckedCreateWithoutChunksInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutChunksInput
    upsert?: DocumentUpsertWithoutChunksInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutChunksInput, DocumentUpdateWithoutChunksInput>, DocumentUncheckedUpdateWithoutChunksInput>
  }

  export type UserCreateNestedOneWithoutTokenUsagesInput = {
    create?: XOR<UserCreateWithoutTokenUsagesInput, UserUncheckedCreateWithoutTokenUsagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokenUsagesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutTokenUsagesNestedInput = {
    create?: XOR<UserCreateWithoutTokenUsagesInput, UserUncheckedCreateWithoutTokenUsagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokenUsagesInput
    upsert?: UserUpsertWithoutTokenUsagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTokenUsagesInput, UserUpdateWithoutTokenUsagesInput>, UserUncheckedUpdateWithoutTokenUsagesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    lastActiveAt?: Date | string
    activeSeconds?: number
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    lastActiveAt?: Date | string
    activeSeconds?: number
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BinderCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentCreateNestedManyWithoutBinderInput
  }

  export type BinderUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutBinderInput
  }

  export type BinderCreateOrConnectWithoutUserInput = {
    where: BinderWhereUniqueInput
    create: XOR<BinderCreateWithoutUserInput, BinderUncheckedCreateWithoutUserInput>
  }

  export type BinderCreateManyUserInputEnvelope = {
    data: BinderCreateManyUserInput | BinderCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type StudyHistoryCreateWithoutUserInput = {
    id?: string
    query: string
    response: string
    createdAt?: Date | string
  }

  export type StudyHistoryUncheckedCreateWithoutUserInput = {
    id?: string
    query: string
    response: string
    createdAt?: Date | string
  }

  export type StudyHistoryCreateOrConnectWithoutUserInput = {
    where: StudyHistoryWhereUniqueInput
    create: XOR<StudyHistoryCreateWithoutUserInput, StudyHistoryUncheckedCreateWithoutUserInput>
  }

  export type StudyHistoryCreateManyUserInputEnvelope = {
    data: StudyHistoryCreateManyUserInput | StudyHistoryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FlashcardCreateWithoutUserInput = {
    id?: string
    front: string
    back: string
    interval?: number
    easeFactor?: number
    reps?: number
    nextReview?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FlashcardUncheckedCreateWithoutUserInput = {
    id?: string
    front: string
    back: string
    interval?: number
    easeFactor?: number
    reps?: number
    nextReview?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FlashcardCreateOrConnectWithoutUserInput = {
    where: FlashcardWhereUniqueInput
    create: XOR<FlashcardCreateWithoutUserInput, FlashcardUncheckedCreateWithoutUserInput>
  }

  export type FlashcardCreateManyUserInputEnvelope = {
    data: FlashcardCreateManyUserInput | FlashcardCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TokenUsageCreateWithoutUserInput = {
    id?: string
    modelName: string
    promptTokens: number
    completionTokens: number
    totalTokens: number
    action: string
    createdAt?: Date | string
  }

  export type TokenUsageUncheckedCreateWithoutUserInput = {
    id?: string
    modelName: string
    promptTokens: number
    completionTokens: number
    totalTokens: number
    action: string
    createdAt?: Date | string
  }

  export type TokenUsageCreateOrConnectWithoutUserInput = {
    where: TokenUsageWhereUniqueInput
    create: XOR<TokenUsageCreateWithoutUserInput, TokenUsageUncheckedCreateWithoutUserInput>
  }

  export type TokenUsageCreateManyUserInputEnvelope = {
    data: TokenUsageCreateManyUserInput | TokenUsageCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    token?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    lastActiveAt?: DateTimeFilter<"Session"> | Date | string
    activeSeconds?: IntFilter<"Session"> | number
  }

  export type BinderUpsertWithWhereUniqueWithoutUserInput = {
    where: BinderWhereUniqueInput
    update: XOR<BinderUpdateWithoutUserInput, BinderUncheckedUpdateWithoutUserInput>
    create: XOR<BinderCreateWithoutUserInput, BinderUncheckedCreateWithoutUserInput>
  }

  export type BinderUpdateWithWhereUniqueWithoutUserInput = {
    where: BinderWhereUniqueInput
    data: XOR<BinderUpdateWithoutUserInput, BinderUncheckedUpdateWithoutUserInput>
  }

  export type BinderUpdateManyWithWhereWithoutUserInput = {
    where: BinderScalarWhereInput
    data: XOR<BinderUpdateManyMutationInput, BinderUncheckedUpdateManyWithoutUserInput>
  }

  export type BinderScalarWhereInput = {
    AND?: BinderScalarWhereInput | BinderScalarWhereInput[]
    OR?: BinderScalarWhereInput[]
    NOT?: BinderScalarWhereInput | BinderScalarWhereInput[]
    id?: StringFilter<"Binder"> | string
    userId?: StringFilter<"Binder"> | string
    name?: StringFilter<"Binder"> | string
    description?: StringNullableFilter<"Binder"> | string | null
    createdAt?: DateTimeFilter<"Binder"> | Date | string
    updatedAt?: DateTimeFilter<"Binder"> | Date | string
  }

  export type StudyHistoryUpsertWithWhereUniqueWithoutUserInput = {
    where: StudyHistoryWhereUniqueInput
    update: XOR<StudyHistoryUpdateWithoutUserInput, StudyHistoryUncheckedUpdateWithoutUserInput>
    create: XOR<StudyHistoryCreateWithoutUserInput, StudyHistoryUncheckedCreateWithoutUserInput>
  }

  export type StudyHistoryUpdateWithWhereUniqueWithoutUserInput = {
    where: StudyHistoryWhereUniqueInput
    data: XOR<StudyHistoryUpdateWithoutUserInput, StudyHistoryUncheckedUpdateWithoutUserInput>
  }

  export type StudyHistoryUpdateManyWithWhereWithoutUserInput = {
    where: StudyHistoryScalarWhereInput
    data: XOR<StudyHistoryUpdateManyMutationInput, StudyHistoryUncheckedUpdateManyWithoutUserInput>
  }

  export type StudyHistoryScalarWhereInput = {
    AND?: StudyHistoryScalarWhereInput | StudyHistoryScalarWhereInput[]
    OR?: StudyHistoryScalarWhereInput[]
    NOT?: StudyHistoryScalarWhereInput | StudyHistoryScalarWhereInput[]
    id?: StringFilter<"StudyHistory"> | string
    userId?: StringFilter<"StudyHistory"> | string
    query?: StringFilter<"StudyHistory"> | string
    response?: StringFilter<"StudyHistory"> | string
    createdAt?: DateTimeFilter<"StudyHistory"> | Date | string
  }

  export type FlashcardUpsertWithWhereUniqueWithoutUserInput = {
    where: FlashcardWhereUniqueInput
    update: XOR<FlashcardUpdateWithoutUserInput, FlashcardUncheckedUpdateWithoutUserInput>
    create: XOR<FlashcardCreateWithoutUserInput, FlashcardUncheckedCreateWithoutUserInput>
  }

  export type FlashcardUpdateWithWhereUniqueWithoutUserInput = {
    where: FlashcardWhereUniqueInput
    data: XOR<FlashcardUpdateWithoutUserInput, FlashcardUncheckedUpdateWithoutUserInput>
  }

  export type FlashcardUpdateManyWithWhereWithoutUserInput = {
    where: FlashcardScalarWhereInput
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyWithoutUserInput>
  }

  export type FlashcardScalarWhereInput = {
    AND?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
    OR?: FlashcardScalarWhereInput[]
    NOT?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
    id?: StringFilter<"Flashcard"> | string
    userId?: StringFilter<"Flashcard"> | string
    front?: StringFilter<"Flashcard"> | string
    back?: StringFilter<"Flashcard"> | string
    interval?: IntFilter<"Flashcard"> | number
    easeFactor?: FloatFilter<"Flashcard"> | number
    reps?: IntFilter<"Flashcard"> | number
    nextReview?: DateTimeFilter<"Flashcard"> | Date | string
    createdAt?: DateTimeFilter<"Flashcard"> | Date | string
    updatedAt?: DateTimeFilter<"Flashcard"> | Date | string
  }

  export type TokenUsageUpsertWithWhereUniqueWithoutUserInput = {
    where: TokenUsageWhereUniqueInput
    update: XOR<TokenUsageUpdateWithoutUserInput, TokenUsageUncheckedUpdateWithoutUserInput>
    create: XOR<TokenUsageCreateWithoutUserInput, TokenUsageUncheckedCreateWithoutUserInput>
  }

  export type TokenUsageUpdateWithWhereUniqueWithoutUserInput = {
    where: TokenUsageWhereUniqueInput
    data: XOR<TokenUsageUpdateWithoutUserInput, TokenUsageUncheckedUpdateWithoutUserInput>
  }

  export type TokenUsageUpdateManyWithWhereWithoutUserInput = {
    where: TokenUsageScalarWhereInput
    data: XOR<TokenUsageUpdateManyMutationInput, TokenUsageUncheckedUpdateManyWithoutUserInput>
  }

  export type TokenUsageScalarWhereInput = {
    AND?: TokenUsageScalarWhereInput | TokenUsageScalarWhereInput[]
    OR?: TokenUsageScalarWhereInput[]
    NOT?: TokenUsageScalarWhereInput | TokenUsageScalarWhereInput[]
    id?: StringFilter<"TokenUsage"> | string
    userId?: StringFilter<"TokenUsage"> | string
    modelName?: StringFilter<"TokenUsage"> | string
    promptTokens?: IntFilter<"TokenUsage"> | number
    completionTokens?: IntFilter<"TokenUsage"> | number
    totalTokens?: IntFilter<"TokenUsage"> | number
    action?: StringFilter<"TokenUsage"> | string
    createdAt?: DateTimeFilter<"TokenUsage"> | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    binders?: BinderCreateNestedManyWithoutUserInput
    studyHistory?: StudyHistoryCreateNestedManyWithoutUserInput
    flashcards?: FlashcardCreateNestedManyWithoutUserInput
    tokenUsages?: TokenUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    binders?: BinderUncheckedCreateNestedManyWithoutUserInput
    studyHistory?: StudyHistoryUncheckedCreateNestedManyWithoutUserInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUserInput
    tokenUsages?: TokenUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    binders?: BinderUpdateManyWithoutUserNestedInput
    studyHistory?: StudyHistoryUpdateManyWithoutUserNestedInput
    flashcards?: FlashcardUpdateManyWithoutUserNestedInput
    tokenUsages?: TokenUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    binders?: BinderUncheckedUpdateManyWithoutUserNestedInput
    studyHistory?: StudyHistoryUncheckedUpdateManyWithoutUserNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUserNestedInput
    tokenUsages?: TokenUsageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutBindersInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    studyHistory?: StudyHistoryCreateNestedManyWithoutUserInput
    flashcards?: FlashcardCreateNestedManyWithoutUserInput
    tokenUsages?: TokenUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBindersInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    studyHistory?: StudyHistoryUncheckedCreateNestedManyWithoutUserInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUserInput
    tokenUsages?: TokenUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBindersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBindersInput, UserUncheckedCreateWithoutBindersInput>
  }

  export type DocumentCreateWithoutBinderInput = {
    id?: string
    name: string
    fileType: string
    content: string
    base64?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    chunks?: DocumentChunkCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutBinderInput = {
    id?: string
    name: string
    fileType: string
    content: string
    base64?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    chunks?: DocumentChunkUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutBinderInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutBinderInput, DocumentUncheckedCreateWithoutBinderInput>
  }

  export type DocumentCreateManyBinderInputEnvelope = {
    data: DocumentCreateManyBinderInput | DocumentCreateManyBinderInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutBindersInput = {
    update: XOR<UserUpdateWithoutBindersInput, UserUncheckedUpdateWithoutBindersInput>
    create: XOR<UserCreateWithoutBindersInput, UserUncheckedCreateWithoutBindersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBindersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBindersInput, UserUncheckedUpdateWithoutBindersInput>
  }

  export type UserUpdateWithoutBindersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    studyHistory?: StudyHistoryUpdateManyWithoutUserNestedInput
    flashcards?: FlashcardUpdateManyWithoutUserNestedInput
    tokenUsages?: TokenUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBindersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    studyHistory?: StudyHistoryUncheckedUpdateManyWithoutUserNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUserNestedInput
    tokenUsages?: TokenUsageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DocumentUpsertWithWhereUniqueWithoutBinderInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutBinderInput, DocumentUncheckedUpdateWithoutBinderInput>
    create: XOR<DocumentCreateWithoutBinderInput, DocumentUncheckedCreateWithoutBinderInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutBinderInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutBinderInput, DocumentUncheckedUpdateWithoutBinderInput>
  }

  export type DocumentUpdateManyWithWhereWithoutBinderInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutBinderInput>
  }

  export type DocumentScalarWhereInput = {
    AND?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    OR?: DocumentScalarWhereInput[]
    NOT?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    id?: StringFilter<"Document"> | string
    binderId?: StringFilter<"Document"> | string
    name?: StringFilter<"Document"> | string
    fileType?: StringFilter<"Document"> | string
    content?: StringFilter<"Document"> | string
    base64?: StringNullableFilter<"Document"> | string | null
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
  }

  export type BinderCreateWithoutDocumentsInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBindersInput
  }

  export type BinderUncheckedCreateWithoutDocumentsInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BinderCreateOrConnectWithoutDocumentsInput = {
    where: BinderWhereUniqueInput
    create: XOR<BinderCreateWithoutDocumentsInput, BinderUncheckedCreateWithoutDocumentsInput>
  }

  export type DocumentChunkCreateWithoutDocumentInput = {
    id?: string
    content: string
    createdAt?: Date | string
  }

  export type DocumentChunkUncheckedCreateWithoutDocumentInput = {
    id?: string
    content: string
    createdAt?: Date | string
  }

  export type DocumentChunkCreateOrConnectWithoutDocumentInput = {
    where: DocumentChunkWhereUniqueInput
    create: XOR<DocumentChunkCreateWithoutDocumentInput, DocumentChunkUncheckedCreateWithoutDocumentInput>
  }

  export type DocumentChunkCreateManyDocumentInputEnvelope = {
    data: DocumentChunkCreateManyDocumentInput | DocumentChunkCreateManyDocumentInput[]
    skipDuplicates?: boolean
  }

  export type BinderUpsertWithoutDocumentsInput = {
    update: XOR<BinderUpdateWithoutDocumentsInput, BinderUncheckedUpdateWithoutDocumentsInput>
    create: XOR<BinderCreateWithoutDocumentsInput, BinderUncheckedCreateWithoutDocumentsInput>
    where?: BinderWhereInput
  }

  export type BinderUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: BinderWhereInput
    data: XOR<BinderUpdateWithoutDocumentsInput, BinderUncheckedUpdateWithoutDocumentsInput>
  }

  export type BinderUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBindersNestedInput
  }

  export type BinderUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentChunkUpsertWithWhereUniqueWithoutDocumentInput = {
    where: DocumentChunkWhereUniqueInput
    update: XOR<DocumentChunkUpdateWithoutDocumentInput, DocumentChunkUncheckedUpdateWithoutDocumentInput>
    create: XOR<DocumentChunkCreateWithoutDocumentInput, DocumentChunkUncheckedCreateWithoutDocumentInput>
  }

  export type DocumentChunkUpdateWithWhereUniqueWithoutDocumentInput = {
    where: DocumentChunkWhereUniqueInput
    data: XOR<DocumentChunkUpdateWithoutDocumentInput, DocumentChunkUncheckedUpdateWithoutDocumentInput>
  }

  export type DocumentChunkUpdateManyWithWhereWithoutDocumentInput = {
    where: DocumentChunkScalarWhereInput
    data: XOR<DocumentChunkUpdateManyMutationInput, DocumentChunkUncheckedUpdateManyWithoutDocumentInput>
  }

  export type DocumentChunkScalarWhereInput = {
    AND?: DocumentChunkScalarWhereInput | DocumentChunkScalarWhereInput[]
    OR?: DocumentChunkScalarWhereInput[]
    NOT?: DocumentChunkScalarWhereInput | DocumentChunkScalarWhereInput[]
    id?: StringFilter<"DocumentChunk"> | string
    documentId?: StringFilter<"DocumentChunk"> | string
    content?: StringFilter<"DocumentChunk"> | string
    createdAt?: DateTimeFilter<"DocumentChunk"> | Date | string
  }

  export type UserCreateWithoutStudyHistoryInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    binders?: BinderCreateNestedManyWithoutUserInput
    flashcards?: FlashcardCreateNestedManyWithoutUserInput
    tokenUsages?: TokenUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutStudyHistoryInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    binders?: BinderUncheckedCreateNestedManyWithoutUserInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUserInput
    tokenUsages?: TokenUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutStudyHistoryInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStudyHistoryInput, UserUncheckedCreateWithoutStudyHistoryInput>
  }

  export type UserUpsertWithoutStudyHistoryInput = {
    update: XOR<UserUpdateWithoutStudyHistoryInput, UserUncheckedUpdateWithoutStudyHistoryInput>
    create: XOR<UserCreateWithoutStudyHistoryInput, UserUncheckedCreateWithoutStudyHistoryInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStudyHistoryInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStudyHistoryInput, UserUncheckedUpdateWithoutStudyHistoryInput>
  }

  export type UserUpdateWithoutStudyHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    binders?: BinderUpdateManyWithoutUserNestedInput
    flashcards?: FlashcardUpdateManyWithoutUserNestedInput
    tokenUsages?: TokenUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutStudyHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    binders?: BinderUncheckedUpdateManyWithoutUserNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUserNestedInput
    tokenUsages?: TokenUsageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutFlashcardsInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    binders?: BinderCreateNestedManyWithoutUserInput
    studyHistory?: StudyHistoryCreateNestedManyWithoutUserInput
    tokenUsages?: TokenUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFlashcardsInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    binders?: BinderUncheckedCreateNestedManyWithoutUserInput
    studyHistory?: StudyHistoryUncheckedCreateNestedManyWithoutUserInput
    tokenUsages?: TokenUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFlashcardsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFlashcardsInput, UserUncheckedCreateWithoutFlashcardsInput>
  }

  export type UserUpsertWithoutFlashcardsInput = {
    update: XOR<UserUpdateWithoutFlashcardsInput, UserUncheckedUpdateWithoutFlashcardsInput>
    create: XOR<UserCreateWithoutFlashcardsInput, UserUncheckedCreateWithoutFlashcardsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFlashcardsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFlashcardsInput, UserUncheckedUpdateWithoutFlashcardsInput>
  }

  export type UserUpdateWithoutFlashcardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    binders?: BinderUpdateManyWithoutUserNestedInput
    studyHistory?: StudyHistoryUpdateManyWithoutUserNestedInput
    tokenUsages?: TokenUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFlashcardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    binders?: BinderUncheckedUpdateManyWithoutUserNestedInput
    studyHistory?: StudyHistoryUncheckedUpdateManyWithoutUserNestedInput
    tokenUsages?: TokenUsageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DocumentCreateWithoutChunksInput = {
    id?: string
    name: string
    fileType: string
    content: string
    base64?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    binder: BinderCreateNestedOneWithoutDocumentsInput
  }

  export type DocumentUncheckedCreateWithoutChunksInput = {
    id?: string
    binderId: string
    name: string
    fileType: string
    content: string
    base64?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateOrConnectWithoutChunksInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutChunksInput, DocumentUncheckedCreateWithoutChunksInput>
  }

  export type DocumentUpsertWithoutChunksInput = {
    update: XOR<DocumentUpdateWithoutChunksInput, DocumentUncheckedUpdateWithoutChunksInput>
    create: XOR<DocumentCreateWithoutChunksInput, DocumentUncheckedCreateWithoutChunksInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutChunksInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutChunksInput, DocumentUncheckedUpdateWithoutChunksInput>
  }

  export type DocumentUpdateWithoutChunksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    base64?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    binder?: BinderUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateWithoutChunksInput = {
    id?: StringFieldUpdateOperationsInput | string
    binderId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    base64?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutTokenUsagesInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    binders?: BinderCreateNestedManyWithoutUserInput
    studyHistory?: StudyHistoryCreateNestedManyWithoutUserInput
    flashcards?: FlashcardCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTokenUsagesInput = {
    id?: string
    email: string
    passwordHash: string
    customInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    binders?: BinderUncheckedCreateNestedManyWithoutUserInput
    studyHistory?: StudyHistoryUncheckedCreateNestedManyWithoutUserInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTokenUsagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTokenUsagesInput, UserUncheckedCreateWithoutTokenUsagesInput>
  }

  export type UserUpsertWithoutTokenUsagesInput = {
    update: XOR<UserUpdateWithoutTokenUsagesInput, UserUncheckedUpdateWithoutTokenUsagesInput>
    create: XOR<UserCreateWithoutTokenUsagesInput, UserUncheckedCreateWithoutTokenUsagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTokenUsagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTokenUsagesInput, UserUncheckedUpdateWithoutTokenUsagesInput>
  }

  export type UserUpdateWithoutTokenUsagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    binders?: BinderUpdateManyWithoutUserNestedInput
    studyHistory?: StudyHistoryUpdateManyWithoutUserNestedInput
    flashcards?: FlashcardUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTokenUsagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    customInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    binders?: BinderUncheckedUpdateManyWithoutUserNestedInput
    studyHistory?: StudyHistoryUncheckedUpdateManyWithoutUserNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SessionCreateManyUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    lastActiveAt?: Date | string
    activeSeconds?: number
  }

  export type BinderCreateManyUserInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudyHistoryCreateManyUserInput = {
    id?: string
    query: string
    response: string
    createdAt?: Date | string
  }

  export type FlashcardCreateManyUserInput = {
    id?: string
    front: string
    back: string
    interval?: number
    easeFactor?: number
    reps?: number
    nextReview?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenUsageCreateManyUserInput = {
    id?: string
    modelName: string
    promptTokens: number
    completionTokens: number
    totalTokens: number
    action: string
    createdAt?: Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSeconds?: IntFieldUpdateOperationsInput | number
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSeconds?: IntFieldUpdateOperationsInput | number
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSeconds?: IntFieldUpdateOperationsInput | number
  }

  export type BinderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUpdateManyWithoutBinderNestedInput
  }

  export type BinderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutBinderNestedInput
  }

  export type BinderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudyHistoryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudyHistoryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudyHistoryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlashcardUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    interval?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    reps?: IntFieldUpdateOperationsInput | number
    nextReview?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlashcardUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    interval?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    reps?: IntFieldUpdateOperationsInput | number
    nextReview?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlashcardUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    interval?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    reps?: IntFieldUpdateOperationsInput | number
    nextReview?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUsageUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    totalTokens?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUsageUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    totalTokens?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUsageUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    totalTokens?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateManyBinderInput = {
    id?: string
    name: string
    fileType: string
    content: string
    base64?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateWithoutBinderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    base64?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chunks?: DocumentChunkUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutBinderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    base64?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chunks?: DocumentChunkUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateManyWithoutBinderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    base64?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentChunkCreateManyDocumentInput = {
    id?: string
    content: string
    createdAt?: Date | string
  }

  export type DocumentChunkUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentChunkUncheckedUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentChunkUncheckedUpdateManyWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BinderCountOutputTypeDefaultArgs instead
     */
    export type BinderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BinderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DocumentCountOutputTypeDefaultArgs instead
     */
    export type DocumentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DocumentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SessionDefaultArgs instead
     */
    export type SessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BinderDefaultArgs instead
     */
    export type BinderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BinderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DocumentDefaultArgs instead
     */
    export type DocumentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DocumentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StudyHistoryDefaultArgs instead
     */
    export type StudyHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StudyHistoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FlashcardDefaultArgs instead
     */
    export type FlashcardArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FlashcardDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DocumentChunkDefaultArgs instead
     */
    export type DocumentChunkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DocumentChunkDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TokenUsageDefaultArgs instead
     */
    export type TokenUsageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TokenUsageDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}