# ReactiveTree

Una estructura de datos de árbol reactivo para datos jerárquicos. Cada nodo implementa `IReactiveValue` y mantiene relaciones padre-hijo.

## Instalación

```typescript
import { ReactiveTree, ReactiveTreeNode, ITreeNodeData } from '@beyond-js/reactive/structures/tree';
```

## Uso Básico

```typescript
// Define tu tipo de nodo
interface Category extends ITreeNodeData {
	id: string;
	name: string;
	description?: string;
}

// Crear árbol
const categories = new ReactiveTree<Category>({
	root: { id: 'root', name: 'Todas las Categorías' },
	children: [
		{
			data: { id: 'electronics', name: 'Electrónica' },
			children: [
				{ data: { id: 'phones', name: 'Teléfonos' } },
				{ data: { id: 'laptops', name: 'Laptops' } },
			],
		},
		{
			data: { id: 'clothing', name: 'Ropa' },
		},
	],
});

// Acceder a nodos
const electronics = categories.getNode('electronics');
console.log(electronics?.data.name); // 'Electrónica'

// Agregar nodo
categories.addNode('electronics', { id: 'tablets', name: 'Tabletas' });

// Eliminar nodo (y todos los descendientes)
categories.removeNode('phones');
```

## Opciones del Constructor

```typescript
interface IReactiveTreeOptions<T extends ITreeNodeData> {
	// Datos del nodo raíz
	root?: T;
	
	// Hijos iniciales
	children?: ITreeNodeInput<T>[];
	
	// Nombre de propiedad para hijos en datos anidados (por defecto: 'children')
	childrenKey?: string;
	
	// Separador para acceso basado en ruta (por defecto: '.')
	pathSeparator?: string;
}
```

## Acceso a Nodos

```typescript
// Por ID
const node = tree.getNode('node-id');

// Por ruta
const nested = tree.getByPath('root.parent.child');

// Verificar existencia
if (tree.hasNode('node-id')) {
	// ...
}

// Acceso a raíz
const root = tree.root;

// Conteo total de nodos
console.log(tree.size);
```

## Operaciones con Nodos

### Agregar Nodos

```typescript
// Agregar como hijo de padre
const newNode = tree.addNode('parentId', { id: 'newId', name: 'Nuevo Nodo' });

// Agregar en índice específico
tree.addNode('parentId', { id: 'newId', name: 'Nuevo' }, 0); // Primera posición
```

### Eliminar Nodos

```typescript
// Eliminar nodo y todos los descendientes
const removed = tree.removeNode('nodeId');

// No se puede eliminar la raíz
tree.removeNode('root'); // Retorna false
```

### Mover Nodos

```typescript
// Mover a nuevo padre
tree.moveNode('nodeId', 'newParentId');

// Mover a posición específica
tree.moveNode('nodeId', 'newParentId', 0); // Primer hijo

// No se puede mover nodo a su propio subárbol
tree.moveNode('parent', 'child'); // Retorna false
```

### Actualizar Nodos

```typescript
// Actualizar datos del nodo
tree.updateNode('nodeId', { name: 'Nombre Actualizado' });

// ID no puede ser cambiado
tree.updateNode('nodeId', { id: 'newId' }); // id permanece igual
```

## Propiedades de Nodos

```typescript
const node = tree.getNode('nodeId');

// Identidad
node.id;          // El ID del nodo
node.data;        // El objeto de datos completo

// Relaciones
node.parent;      // Nodo padre o null
node.children;    // Array de nodos hijos
node.isRoot;      // true si no tiene padre
node.isLeaf;      // true si no tiene hijos

// Posición
node.depth;       // Distancia desde la raíz (raíz = 0)
node.path;        // Cadena de ruta completa (ej: 'root.parent.child')
```

## Recorrido

### Profundidad Primero (Pre-orden)

```typescript
tree.walkDepthFirst(node => {
	console.log(node.data.name);
});
// Visita: Raíz -> Hijo1 -> Nieto1 -> Nieto2 -> Hijo2
```

### Anchura Primero

```typescript
tree.walkBreadthFirst(node => {
	console.log(node.data.name);
});
// Visita: Raíz -> Hijo1 -> Hijo2 -> Nieto1 -> Nieto2
```

### Buscar Nodos

```typescript
// Encontrar primer coincidencia
const found = tree.findNode(node => node.data.name === 'Objetivo');

// Encontrar todas las coincidencias
const matches = tree.findNodes(node => node.data.active === true);

// Obtener todos los nodos hoja
const leaves = tree.getLeaves();

// Obtener nodos en profundidad específica
const topLevel = tree.getNodesAtDepth(1);
```

## Eventos

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `node.added` | `{ node, parent, index }` | Nodo fue agregado |
| `node.removed` | `{ node, parent }` | Nodo fue eliminado |
| `node.moved` | `{ node, oldParent, newParent, oldIndex, newIndex }` | Nodo fue movido |
| `node.changed` | `{ node }` | Datos del nodo fueron actualizados |
| `change` | - | Cualquier modificación ocurrió |
| `clear` | - | Árbol fue limpiado |

## Serialización

```typescript
// A objeto anidado
const nested = tree.serialize();
// { id: 'root', name: 'Raíz', children: [{ id: 'child', ... }] }

// A array plano
const flat = tree.getValue();
// [{ id: 'root', ... }, { id: 'child', ... }, ...]
```

## Importar desde Datos Anidados

```typescript
const data = {
	id: 'root',
	name: 'Raíz',
	children: [
		{ id: 'a', name: 'A', children: [] },
		{ id: 'b', name: 'B' },
	],
};

tree.fromNestedData(data);
```

## Ejemplo: Sistema de Archivos

```typescript
interface FileNode extends ITreeNodeData {
	id: string;
	name: string;
	type: 'file' | 'folder';
	size?: number;
}

class FileExplorer {
	private tree = new ReactiveTree<FileNode>({
		root: { id: 'root', name: '/', type: 'folder' },
	});

	constructor() {
		this.tree.on('change', () => this.render());
	}

	createFolder(parentId: string, name: string): void {
		this.tree.addNode(parentId, {
			id: crypto.randomUUID(),
			name,
			type: 'folder',
		});
	}

	createFile(parentId: string, name: string, size: number): void {
		this.tree.addNode(parentId, {
			id: crypto.randomUUID(),
			name,
			type: 'file',
			size,
		});
	}

	move(nodeId: string, newParentId: string): void {
		this.tree.moveNode(nodeId, newParentId);
	}

	delete(nodeId: string): void {
		this.tree.removeNode(nodeId);
	}

	getPath(nodeId: string): string {
		const node = this.tree.getNode(nodeId);
		return node?.path.split('.').slice(1).join('/') ?? '';
	}

	getTotalSize(folderId: string): number {
		const folder = this.tree.getNode(folderId);
		if (!folder) return 0;

		let total = 0;
		folder.walkDepthFirst(node => {
			if (node.data.type === 'file') {
				total += node.data.size ?? 0;
			}
		});
		return total;
	}

	private render(): void {
		// Actualizar UI
	}
}
```

## Ejemplo: Sistema de Menú

```typescript
interface MenuItem extends ITreeNodeData {
	id: string;
	label: string;
	icon?: string;
	href?: string;
	disabled?: boolean;
}

class NavigationMenu {
	private menu = new ReactiveTree<MenuItem>();

	loadFromAPI(data: MenuItem & { children?: MenuItem[] }): void {
		this.menu.fromNestedData(data);
	}

	getVisibleItems(parentId: string): MenuItem[] {
		const parent = this.menu.getNode(parentId);
		if (!parent) return [];

		return parent.children
			.filter(child => !child.data.disabled)
			.map(child => child.data);
	}

	getBreadcrumb(nodeId: string): MenuItem[] {
		const node = this.menu.getNode(nodeId);
		if (!node) return [];

		const breadcrumb: MenuItem[] = [];
		let current = node;

		while (current) {
			breadcrumb.unshift(current.data);
			current = current.parent as ReactiveTreeNode<MenuItem>;
		}

		return breadcrumb;
	}
}
```
