import * as React from "react";

interface ViewProps {
  store: any;
}

export /*bundle*/ function View({ store }: ViewProps) {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Actualiza items cuando cambia la colección
  React.useEffect(() => {
    if (store && store.collection && store.collection.items) {
      setItems([...store.collection.items]);
    }
    // Escucha el evento de carga de la colección
    const handler = () => {
      if (store && store.collection && store.collection.items) {
        setItems([...store.collection.items]);
      }
    };
    store?.on?.("collection.loaded", handler);
    return () => {
      store?.off?.("collection.loaded", handler);
    };
  }, [store, store?.collection]);

  const handleLoadMore = async () => {
    setLoading(true);
    await store.update();
    setLoading(false);
  };
  const disabled = !store.collection.next || loading;
  return (
    <div>
      <h2>Usuarios</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button onClick={handleLoadMore} disabled={disabled}>
        {loading ? "Cargando..." : "Cargar más"}
      </button>
    </div>
  );
}
