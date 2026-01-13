import { Events } from 'reactive/events';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var _ReactiveTreeNode_data, _ReactiveTreeNode_parent, _ReactiveTreeNode_children, _ReactiveTreeNode_pathSeparator;
/**
 * Represents a single node in a ReactiveTree.
 * Each node holds data and maintains parent/children relationships.
 *
 * @template T - Type of data stored in nodes
 */
class ReactiveTreeNode extends Events {
    /**
     * Creates a new tree node.
     */
    constructor(data, parent = null, pathSeparator = '.') {
        super();
        this.isReactive = true;
        _ReactiveTreeNode_data.set(this, void 0);
        _ReactiveTreeNode_parent.set(this, null);
        _ReactiveTreeNode_children.set(this, []);
        _ReactiveTreeNode_pathSeparator.set(this, void 0);
        __classPrivateFieldSet(this, _ReactiveTreeNode_data, { ...data }, "f");
        __classPrivateFieldSet(this, _ReactiveTreeNode_parent, parent, "f");
        __classPrivateFieldSet(this, _ReactiveTreeNode_pathSeparator, pathSeparator, "f");
    }
    // ==========================================
    // Getters
    // ==========================================
    get id() {
        return __classPrivateFieldGet(this, _ReactiveTreeNode_data, "f").id;
    }
    get data() {
        return { ...__classPrivateFieldGet(this, _ReactiveTreeNode_data, "f") };
    }
    get parent() {
        return __classPrivateFieldGet(this, _ReactiveTreeNode_parent, "f");
    }
    get children() {
        return [...__classPrivateFieldGet(this, _ReactiveTreeNode_children, "f")];
    }
    get isRoot() {
        return __classPrivateFieldGet(this, _ReactiveTreeNode_parent, "f") === null;
    }
    get isLeaf() {
        return __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f").length === 0;
    }
    get depth() {
        let depth = 0;
        let current = __classPrivateFieldGet(this, _ReactiveTreeNode_parent, "f");
        while (current !== null) {
            depth++;
            current = __classPrivateFieldGet(current, _ReactiveTreeNode_parent, "f");
        }
        return depth;
    }
    get path() {
        const parts = [this.id];
        let current = __classPrivateFieldGet(this, _ReactiveTreeNode_parent, "f");
        while (current !== null) {
            parts.unshift(current.id);
            current = __classPrivateFieldGet(current, _ReactiveTreeNode_parent, "f");
        }
        return parts.join(__classPrivateFieldGet(this, _ReactiveTreeNode_pathSeparator, "f"));
    }
    // ==========================================
    // Internal Setters (for tree operations)
    // ==========================================
    /**
     * @internal Used by ReactiveTree for moving nodes
     */
    _setParent(parent) {
        __classPrivateFieldSet(this, _ReactiveTreeNode_parent, parent, "f");
    }
    /**
     * @internal Used by ReactiveTree for direct children access
     */
    _getChildrenArray() {
        return __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f");
    }
    // ==========================================
    // Data Operations
    // ==========================================
    /**
     * Updates the node's data.
     * Triggers 'update' and 'change' events.
     */
    update(data) {
        const previous = { ...__classPrivateFieldGet(this, _ReactiveTreeNode_data, "f") };
        __classPrivateFieldSet(this, _ReactiveTreeNode_data, { ...__classPrivateFieldGet(this, _ReactiveTreeNode_data, "f"), ...data, id: __classPrivateFieldGet(this, _ReactiveTreeNode_data, "f").id }, "f"); // id cannot change
        this.trigger('update', { data: __classPrivateFieldGet(this, _ReactiveTreeNode_data, "f"), previous });
        this.trigger('change');
    }
    // ==========================================
    // Child Operations
    // ==========================================
    /**
     * Adds a child node.
     *
     * @param data - Data for the new child
     * @param index - Optional index to insert at
     * @returns The new child node
     */
    addChild(data, index) {
        const child = new ReactiveTreeNode(data, this, __classPrivateFieldGet(this, _ReactiveTreeNode_pathSeparator, "f"));
        if (index !== undefined && index >= 0 && index < __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f").length) {
            __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f").splice(index, 0, child);
        }
        else {
            __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f").push(child);
        }
        this.trigger('child.added', { child, index: index !== null && index !== void 0 ? index : __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f").length - 1 });
        this.trigger('change');
        return child;
    }
    /**
     * Removes a child by ID.
     *
     * @param id - ID of the child to remove
     * @returns true if the child was found and removed
     */
    removeChild(id) {
        const index = __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f").findIndex(c => c.id === id);
        if (index === -1)
            return false;
        const [removed] = __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f").splice(index, 1);
        removed._setParent(null);
        this.trigger('child.removed', { child: removed, index });
        this.trigger('change');
        return true;
    }
    /**
     * Gets a direct child by ID.
     */
    getChild(id) {
        return __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f").find(c => c.id === id);
    }
    /**
     * Checks if this node has a direct child with the given ID.
     */
    hasChild(id) {
        return __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f").some(c => c.id === id);
    }
    // ==========================================
    // Traversal Methods
    // ==========================================
    /**
     * Traverses the subtree depth-first (pre-order).
     */
    walkDepthFirst(callback) {
        callback(this);
        for (const child of __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f")) {
            child.walkDepthFirst(callback);
        }
    }
    /**
     * Traverses the subtree breadth-first.
     */
    walkBreadthFirst(callback) {
        const queue = [this];
        while (queue.length > 0) {
            const node = queue.shift();
            callback(node);
            queue.push(...__classPrivateFieldGet(node, _ReactiveTreeNode_children, "f"));
        }
    }
    /**
     * Finds a node in the subtree matching the predicate.
     */
    findNode(predicate) {
        if (predicate(this))
            return this;
        for (const child of __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f")) {
            const found = child.findNode(predicate);
            if (found)
                return found;
        }
        return undefined;
    }
    /**
     * Finds all nodes in the subtree matching the predicate.
     */
    findNodes(predicate) {
        const results = [];
        this.walkDepthFirst(node => {
            if (predicate(node))
                results.push(node);
        });
        return results;
    }
    // ==========================================
    // Serialization
    // ==========================================
    /**
     * Converts the node and its subtree to a plain object.
     */
    toObject() {
        const obj = { ...__classPrivateFieldGet(this, _ReactiveTreeNode_data, "f") };
        if (__classPrivateFieldGet(this, _ReactiveTreeNode_children, "f").length > 0) {
            obj.children = __classPrivateFieldGet(this, _ReactiveTreeNode_children, "f").map(child => child.toObject());
        }
        return obj;
    }
}
_ReactiveTreeNode_data = new WeakMap(), _ReactiveTreeNode_parent = new WeakMap(), _ReactiveTreeNode_children = new WeakMap(), _ReactiveTreeNode_pathSeparator = new WeakMap();

var _ReactiveTree_instances, _ReactiveTree_root, _ReactiveTree_nodeMap, _ReactiveTree_pathSeparator, _ReactiveTree_childrenKey, _ReactiveTree_addNodeRecursive, _ReactiveTree_addFromNestedRecursive, _ReactiveTree_setupNodeListeners;
/**
 * A reactive tree data structure.
 * Maintains hierarchical data with parent/children relationships.
 *
 * @template T - Type of data stored in nodes
 *
 * @example
 * ```typescript
 * interface Category extends ITreeNodeData {
 *   id: string;
 *   name: string;
 * }
 *
 * const tree = new ReactiveTree<Category>({
 *   root: { id: 'root', name: 'Categories' },
 *   children: [
 *     { data: { id: 'electronics', name: 'Electronics' }, children: [] },
 *     { data: { id: 'clothing', name: 'Clothing' }, children: [] },
 *   ]
 * });
 *
 * tree.on('node.added', ({ node }) => console.log('Added:', node.data.name));
 * tree.addNode('electronics', { id: 'phones', name: 'Phones' });
 * ```
 */
class ReactiveTree extends Events {
    /**
     * Creates a new ReactiveTree.
     */
    constructor(options = {}) {
        var _a, _b, _c;
        super();
        _ReactiveTree_instances.add(this);
        this.isReactive = true;
        _ReactiveTree_root.set(this, void 0);
        _ReactiveTree_nodeMap.set(this, new Map());
        _ReactiveTree_pathSeparator.set(this, void 0);
        _ReactiveTree_childrenKey.set(this, void 0);
        __classPrivateFieldSet(this, _ReactiveTree_pathSeparator, (_a = options.pathSeparator) !== null && _a !== void 0 ? _a : '.', "f");
        __classPrivateFieldSet(this, _ReactiveTree_childrenKey, (_b = options.childrenKey) !== null && _b !== void 0 ? _b : 'children', "f");
        // Create root node
        const rootData = (_c = options.root) !== null && _c !== void 0 ? _c : { id: 'root' };
        __classPrivateFieldSet(this, _ReactiveTree_root, new ReactiveTreeNode(rootData, null, __classPrivateFieldGet(this, _ReactiveTree_pathSeparator, "f")), "f");
        __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").set(rootData.id, __classPrivateFieldGet(this, _ReactiveTree_root, "f"));
        // Add children if provided
        if (options.children) {
            for (const childInput of options.children) {
                __classPrivateFieldGet(this, _ReactiveTree_instances, "m", _ReactiveTree_addNodeRecursive).call(this, __classPrivateFieldGet(this, _ReactiveTree_root, "f"), childInput);
            }
        }
        // Listen to root changes
        __classPrivateFieldGet(this, _ReactiveTree_instances, "m", _ReactiveTree_setupNodeListeners).call(this, __classPrivateFieldGet(this, _ReactiveTree_root, "f"));
    }
    // ==========================================
    // Getters
    // ==========================================
    /**
     * The root node of the tree.
     */
    get root() {
        return __classPrivateFieldGet(this, _ReactiveTree_root, "f");
    }
    /**
     * Total number of nodes in the tree.
     */
    get size() {
        return __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").size;
    }
    /**
     * Path separator used for path-based access.
     */
    get pathSeparator() {
        return __classPrivateFieldGet(this, _ReactiveTree_pathSeparator, "f");
    }
    // ==========================================
    // IReactiveValue Implementation
    // ==========================================
    /**
     * Sets the tree content from an array of node data.
     * Clears existing nodes (except root) and rebuilds.
     */
    setValue(values) {
        // Clear all children of root
        for (const child of [...__classPrivateFieldGet(this, _ReactiveTree_root, "f")._getChildrenArray()]) {
            this.removeNode(child.id);
        }
        // Add new nodes as children of root
        for (const value of values) {
            this.addNode(__classPrivateFieldGet(this, _ReactiveTree_root, "f").id, value);
        }
    }
    /**
     * Gets all nodes as a flat array.
     */
    getValue() {
        const result = [];
        __classPrivateFieldGet(this, _ReactiveTree_root, "f").walkDepthFirst(node => {
            result.push(node.data);
        });
        return result;
    }
    /**
     * Serializes the tree to a nested object structure.
     */
    serialize() {
        return __classPrivateFieldGet(this, _ReactiveTree_root, "f").toObject();
    }
    /**
     * Trees don't track unpublished changes in the same way.
     * Always returns false - override if needed.
     */
    hasUnpublishedChanges() {
        return false;
    }
    // ==========================================
    // Node Access
    // ==========================================
    /**
     * Gets a node by its ID.
     */
    getNode(id) {
        return __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").get(id);
    }
    /**
     * Gets a node by its path.
     *
     * @param path - Dot-separated path of node IDs
     */
    getByPath(path) {
        const parts = path.split(__classPrivateFieldGet(this, _ReactiveTree_pathSeparator, "f"));
        let current = __classPrivateFieldGet(this, _ReactiveTree_root, "f");
        for (const part of parts) {
            if (!current)
                return undefined;
            if (current.id.toString() === part)
                continue;
            current = current.getChild(part);
        }
        return current;
    }
    /**
     * Checks if a node exists.
     */
    hasNode(id) {
        return __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").has(id);
    }
    // ==========================================
    // Node Operations
    // ==========================================
    /**
     * Adds a new node as a child of the specified parent.
     *
     * @param parentId - ID of the parent node
     * @param data - Data for the new node
     * @param index - Optional index to insert at
     * @returns The new node, or undefined if parent not found
     */
    addNode(parentId, data, index) {
        const parent = __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").get(parentId);
        if (!parent) {
            console.warn(`ReactiveTree: Parent node ${parentId} not found`);
            return undefined;
        }
        if (__classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").has(data.id)) {
            console.warn(`ReactiveTree: Node ${data.id} already exists`);
            return undefined;
        }
        const node = parent.addChild(data, index);
        __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").set(data.id, node);
        __classPrivateFieldGet(this, _ReactiveTree_instances, "m", _ReactiveTree_setupNodeListeners).call(this, node);
        const eventData = {
            node,
            parent,
            index: index !== null && index !== void 0 ? index : parent.children.length - 1,
        };
        this.trigger('node.added', eventData);
        this.trigger('change');
        return node;
    }
    /**
     * Removes a node and all its descendants.
     *
     * @param id - ID of the node to remove
     * @returns true if the node was found and removed
     */
    removeNode(id) {
        const node = __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").get(id);
        if (!node || node.isRoot)
            return false;
        const parent = node.parent;
        // Remove all descendants from map
        node.walkDepthFirst(n => {
            __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").delete(n.id);
        });
        // Remove from parent
        parent.removeChild(id);
        const eventData = { node, parent };
        this.trigger('node.removed', eventData);
        this.trigger('change');
        return true;
    }
    /**
     * Moves a node to a new parent.
     *
     * @param nodeId - ID of the node to move
     * @param newParentId - ID of the new parent
     * @param index - Optional index in the new parent's children
     * @returns true if the move was successful
     */
    moveNode(nodeId, newParentId, index) {
        const node = __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").get(nodeId);
        const newParent = __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").get(newParentId);
        if (!node || !newParent || node.isRoot)
            return false;
        // Prevent moving a node into its own subtree
        let check = newParent;
        while (check !== null) {
            if (check.id === nodeId) {
                console.warn('ReactiveTree: Cannot move a node into its own subtree');
                return false;
            }
            check = check.parent;
        }
        const oldParent = node.parent;
        const oldIndex = oldParent._getChildrenArray().indexOf(node);
        // Remove from old parent
        oldParent._getChildrenArray().splice(oldIndex, 1);
        // Add to new parent
        const newChildren = newParent._getChildrenArray();
        const newIndex = index !== undefined ? Math.min(index, newChildren.length) : newChildren.length;
        newChildren.splice(newIndex, 0, node);
        node._setParent(newParent);
        const eventData = {
            node,
            oldParent,
            newParent,
            oldIndex,
            newIndex,
        };
        this.trigger('node.moved', eventData);
        this.trigger('change');
        return true;
    }
    /**
     * Updates a node's data.
     *
     * @param id - ID of the node to update
     * @param data - Partial data to merge
     * @returns true if the node was found and updated
     */
    updateNode(id, data) {
        const node = __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").get(id);
        if (!node)
            return false;
        node.update(data);
        this.trigger('change');
        return true;
    }
    // ==========================================
    // Traversal Methods
    // ==========================================
    /**
     * Traverses the entire tree depth-first.
     */
    walkDepthFirst(callback) {
        __classPrivateFieldGet(this, _ReactiveTree_root, "f").walkDepthFirst(callback);
    }
    /**
     * Traverses the entire tree breadth-first.
     */
    walkBreadthFirst(callback) {
        __classPrivateFieldGet(this, _ReactiveTree_root, "f").walkBreadthFirst(callback);
    }
    /**
     * Finds a node matching the predicate.
     */
    findNode(predicate) {
        return __classPrivateFieldGet(this, _ReactiveTree_root, "f").findNode(predicate);
    }
    /**
     * Finds all nodes matching the predicate.
     */
    findNodes(predicate) {
        return __classPrivateFieldGet(this, _ReactiveTree_root, "f").findNodes(predicate);
    }
    /**
     * Gets all leaf nodes.
     */
    getLeaves() {
        return this.findNodes(node => node.isLeaf);
    }
    /**
     * Gets all nodes at a specific depth.
     */
    getNodesAtDepth(depth) {
        return this.findNodes(node => node.depth === depth);
    }
    // ==========================================
    // Utility Methods
    // ==========================================
    /**
     * Clears all nodes except the root.
     */
    clear() {
        for (const child of [...__classPrivateFieldGet(this, _ReactiveTree_root, "f")._getChildrenArray()]) {
            this.removeNode(child.id);
        }
        this.trigger('clear');
        this.trigger('change');
    }
    /**
     * Creates the tree from nested data.
     * Useful for importing hierarchical JSON.
     */
    fromNestedData(data) {
        var _a;
        this.clear();
        // Update root data
        const { [__classPrivateFieldGet(this, _ReactiveTree_childrenKey, "f")]: children, ...rootData } = data;
        __classPrivateFieldGet(this, _ReactiveTree_root, "f").update(rootData);
        __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").set((_a = rootData.id) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _ReactiveTree_root, "f").id, __classPrivateFieldGet(this, _ReactiveTree_root, "f"));
        // Add children recursively
        if (Array.isArray(children)) {
            for (const child of children) {
                __classPrivateFieldGet(this, _ReactiveTree_instances, "m", _ReactiveTree_addFromNestedRecursive).call(this, __classPrivateFieldGet(this, _ReactiveTree_root, "f"), child);
            }
        }
        this.trigger('change');
    }
}
_ReactiveTree_root = new WeakMap(), _ReactiveTree_nodeMap = new WeakMap(), _ReactiveTree_pathSeparator = new WeakMap(), _ReactiveTree_childrenKey = new WeakMap(), _ReactiveTree_instances = new WeakSet(), _ReactiveTree_addNodeRecursive = function _ReactiveTree_addNodeRecursive(parent, input) {
    const node = parent.addChild(input.data);
    __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").set(input.data.id, node);
    __classPrivateFieldGet(this, _ReactiveTree_instances, "m", _ReactiveTree_setupNodeListeners).call(this, node);
    if (input.children) {
        for (const childInput of input.children) {
            __classPrivateFieldGet(this, _ReactiveTree_instances, "m", _ReactiveTree_addNodeRecursive).call(this, node, childInput);
        }
    }
}, _ReactiveTree_addFromNestedRecursive = function _ReactiveTree_addFromNestedRecursive(parent, data) {
    const { [__classPrivateFieldGet(this, _ReactiveTree_childrenKey, "f")]: children, ...nodeData } = data;
    const node = parent.addChild(nodeData);
    __classPrivateFieldGet(this, _ReactiveTree_nodeMap, "f").set(nodeData.id, node);
    __classPrivateFieldGet(this, _ReactiveTree_instances, "m", _ReactiveTree_setupNodeListeners).call(this, node);
    if (Array.isArray(children)) {
        for (const child of children) {
            __classPrivateFieldGet(this, _ReactiveTree_instances, "m", _ReactiveTree_addFromNestedRecursive).call(this, node, child);
        }
    }
}, _ReactiveTree_setupNodeListeners = function _ReactiveTree_setupNodeListeners(node) {
    node.on('change', () => {
        this.trigger('node.changed', { node });
    });
};

export { ReactiveTree, ReactiveTreeNode };
//# sourceMappingURL=index.mjs.map
