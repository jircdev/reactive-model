import { IEntityProvider } from "@beyond-js/reactive/entities/item";
import { PendingPromise } from "@beyond-js/pending-promise/main";
import { items } from "./data";

export class ItemProvider {
  /**
   * Lista los items paginados
   * @param params { limit?: number, next?: number }
   * @returns { entries, next, total }
   */
  async list(params: { limit?: number; next?: number } = {}) {
    const promise = new PendingPromise();
    const { limit = 5, next = 0 } = params;
    // Simula paginación
    const start = next;
    const end = start + limit;
    const entries = items.slice(start, end);
    const newNext = end < items.length ? end : null;
    const total = items.length;

    setTimeout(() => {
      promise.resolve({
        entries,
        next: newNext,
        total,
      });
    }, 300);
    return promise;
  }

  async getData() {
    const promise = new PendingPromise();
    setTimeout(() => {
      promise.resolve(items[0]);
    }, 100);
    return promise;
  }
}
