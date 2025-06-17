// 100 registros ficticios para pruebas de paginación
export interface MockRecord {
  id: number;
  name: string;
}

export const mockData: MockRecord[] = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `Nombre ${i + 1}`,
}));
