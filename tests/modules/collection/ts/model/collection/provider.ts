import { IEntityProvider } from "@beyond-js/reactive/entities/item";
import { PendingPromise } from "@beyond-js/pending-promise/main";

import { mockData, MockRecord } from "./mock-data";

export class CollectionProvider {
  /**
   * Lista registros paginados.
   * @param args { limit: number, next?: number } next es el índice de inicio (0 por defecto)
   * @returns { data: MockRecord[], next: number|null }
   */
  async list(args: { limit: number; start?: number }) {
    const promise = new PendingPromise();

    setTimeout(() => {
      const { limit, start = 0 } = args;
      const end = start + limit;
      const data = mockData.slice(start, end);
      const hasNext = end < mockData.length;
      promise.resolve({
        items: data,
        total: mockData.length,
        next: hasNext ? end : null,
      });
    }, 300);
    return promise;
  }

  async filter(specs) {
    const promise = new PendingPromise();

    setTimeout(() => {
      promise.resolve([
        {
          id: 1,
          name: "Julio",
        },
      ]);
    }, 1000);
    return promise;
  }
}
