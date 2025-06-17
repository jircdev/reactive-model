import {
  IEntityProvider,
  IItem,
  Item,
} from "@beyond-js/reactive/entities/item";
import type { Collection } from "./";

export interface ICollectionProviderResponse<T> {
  status: number;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
export /*bundle*/ interface ICollectionProvider {
  load(specs?: any): Promise<any>;
  list(specs?: any): Promise<any>;
  publish?(data: any): Promise<any>;
  remove?(specs?: any): Promise<any>;
}

export interface ICollectionOptions<T, P extends Partial<IEntityProvider>> {
  entity: string;
  defaultLimit?: number;
  provider?: new (parent: any) => any;
  item: new (...args: any) => T;
  /**
   * Optional. Name of the parameter to send as pagination cursor (default: "next").
   * Used internally by Collection to send the cursor to the provider.
   */
  nextParamName?: string;
}

/**
 * Interface defining the specifications for data loading, filtering, sorting, and pagination.
 */
export /*bundle*/ interface ILoadSpecs<T> {
  /**
   * If true, new items are appended to the collection instead of replacing them (for pagination).
   */
  update?: boolean;
  /**
   * Filters to apply when loading data.
   * Each filter can be a property of the data item with various operators.
   */
  where?: {
    [K in keyof T]?: {
      equals?: T[K];
      not?: T[K];
      in?: T[K][];
      notIn?: T[K][];
      contains?: string;
      startsWith?: string;
      endsWith?: string;
      gt?: T[K];
      gte?: T[K];
      lt?: T[K];
      lte?: T[K];
    };
  };

  /**
   * Specifies the order in which results should be returned.
   * Example: { property: "asc" | "desc" }
   */
  orderBy?: {
    [K in keyof T]?: "asc" | "desc";
  };


  /**
   * Maximum number of items to load after applying the offset (for pagination).
   */
  limit?: number;
}
