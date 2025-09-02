class DLNode<T> {
    value: T;
    next: DLNode<T> | null = null;
    prev: DLNode<T> | null = null;

    constructor(value: T) {
        this.value = value;
    }
}

class DoublyLinkList<T> {
    
    /*** ----- PRIVATE PROPERTIES ----- ***/
    #head: DLNode<T> | null = null;
    #tail: DLNode<T> | null = null;
    #size = 0;
    
    /*** ----- PUBLIC API ----- ***/
    
    constructor() {}

    /** The first item in the list (O(1)) */
    get first(): T | undefined {
        return this.#head?.value;
    }
    /** The lists last item (access in O(1)) */
    get last(): T | undefined {
        return this.#tail?.value;
    }
    /** The amount of elements in the Link List */
    get size(): number {
        return this.#size;
    }
    /** True if the Link List is empty, false otherwise */
    get isEmpty(): boolean {
        return this.#size === 0;
    }
    
    /**
     * Creates a linked list from an array of values.
     * @param array - The array of values to populate the list.
     */
    static fromArray<T>(array: Array<T>): DoublyLinkList<T> {
        const list = new DoublyLinkList<T>();
        for (const item of array) list.append(item);
        return list;
    }

    /**
     * Returns a snapshot of the current list as an array.
     */
    toArray(): T[] {
        return [...this.inOrder()];
    }

    /**
     * Returns the value at the specified index.
     * Starts from the closer end for efficiency.
     * @param index - The index of the value to retrieve.
     */
    get(index: number): T | undefined {
        if (index < 0 || index >= this.#size) return undefined;
        let headIsCloser = index <= this.#size / 2;
        let currentIndex = headIsCloser ? 0 : this.#size - 1;
        for (const node of headIsCloser ? this.#iterNodes() : this.#iterNodesReversed()) {
            if (currentIndex === index) {
                return node.value;
            }
            headIsCloser ? currentIndex++ : currentIndex--;
        }
    }

    /**
     * Searches the list for a values first occurence in linear time (O(n)) 
     * @param target - value to search for
     * @returns The index of the first occurrence in the list, or undefined if not found.
     */
    getIndex(target: T): number | undefined {
        let index = 0;
        for (const node of this.#iterNodes()) {
            if (node.value === target) {
                return index;
            }
            index++;
        }
        return undefined;
    }

    /**
     * Sets the value at the given index and returns the old value in O(n).
     * @param index - Position to update.
     * @param value - New value.
     */
    set(index: number, value: T): T | undefined {
        if (index < 0 || index >= this.#size) throw new RangeError("Index out of bounds");
        let indexInFirstHalf = this.size / 2 >= index;
        let currentIndex = indexInFirstHalf ? 0 : this.size - 1;    
        for (const current of indexInFirstHalf ? this.#iterNodes() : this.#iterNodesReversed()) {
            if (currentIndex === index) {
                const oldValue = current.value;
                current.value = value;
                return oldValue; // Return replaced value (or you could return new one if you prefer)
            }
            indexInFirstHalf ? currentIndex++ : currentIndex--;
        }
    }

    

    /**
     * Inserts a value at the specified index.
     * O(1) at start/end, O(n) otherwise.
     * @param index - Position to insert.
     * @param value - Value to insert.
     */
    insert(index: number, value: T) {
        if (index < 0 || index > this.#size) throw new RangeError("Index out of bounds");
        if (this.#size === 0) {
            this.#head = this.#tail = new DLNode(value)
            this.#size++
        } 
        else if(index === 0) { this.prepend(value) } 
        else if(index === this.#size) { this.append(value) } 
        else { this.#insertInternal(index, value) }
    }

    /**
     * Adds a value to the end of the list (O(1)).
     */
    append(value: T) {
        const node = new DLNode(value);
        node.prev = this.#tail;
        this.#tail!.next = node;
        this.#tail = node;
        this.#size++
    }

    /**
     * Adds a value to the start of the list (O(1)).
     */
    prepend(value: T) {
        const node = new DLNode(value);
        node.next = this.#head;
        this.#head!.prev = node;
        this.#head = node;
        this.#size++
    }

    /**
     * Removes the value at the specified index.
     * O(1) at start/end, O(n) otherwise.
     * @param index - Position to remove.
     */
    remove(index: number): T | undefined {  
        if (index === 0) {
            return this.#removeHead();
        } 
        else if (index === this.#size - 1) {
            return this.#removeTail();
        } 
        else {
            return this.#removeInternal(index);
        }
    }

    /** Clears the entire list (O(1)) */
    clear() {
        this.#head = this.#tail = null;
        this.#size = 0;
    }

    /** Default iterator (forward) */
    [Symbol.iterator](): IterableIterator<T> {
        return this.inOrder();
    }

    /** Forward iteration generator */
    *inOrder(): IterableIterator<T> {
        let current = this.#head;
        while (current) {
            yield current.value;
            current = current.next;
        }
    }

    /** Reverse iteration generator */
    *reversed(): IterableIterator<T> {
        let current = this.#tail;
        while (current) {
            yield current.value;
            current = current.prev;
        }
    }

    /*** ----- INTERNAL NODE ITERATORS ----- ***/

    /** Forward iteration over nodes (internal use) */
    *#iterNodes(): IterableIterator<DLNode<T>> {
        let current = this.#head;
        while (current) {
            yield current;
            current = current.next;
        }
    }

    /** Reverse iteration over nodes (internal use) */
    *#iterNodesReversed(): IterableIterator<DLNode<T>> {
        let current = this.#tail;
        while (current) {
            yield current;
            current = current.prev;
        }
    }

    /** Inserts internally at a specific index */
    #insertInternal(index: number, value: T) {
        const node = new DLNode(value);
        const indexInFirstHalf = this.size / 2 >= index;
        let currentIndex = indexInFirstHalf ? 0 : this.size - 1;
        for (const current of indexInFirstHalf ? this.#iterNodes() : this.#iterNodesReversed()) {
            if (currentIndex === index) {
                current.prev!.next = node;
                node.prev = current.prev;
                node.next = current;
                current.prev = node;
                break;
            }
            indexInFirstHalf ? currentIndex++ : currentIndex--;
        }
        this.#size++;
    }

    /** Removes the head (O(1)) */
    #removeHead(): T | undefined {
        if (!this.#head) return undefined;
        const val = this.first;
        this.#head = this.#head.next;
        if (this.#head) this.#head.prev = null;
        else this.#tail = null;
        this.#size--;
        return val;
    }

    /** Removes the tail (O(1)) */
    #removeTail(): T | undefined {
        if (!this.#tail) return undefined;
        const val = this.last;
        this.#tail = this.#tail.prev;
        if (this.#tail) this.#tail.next = null;
        else this.#head = null;
        this.#size--;
        return val;
    }

    /** Removes an internal node at a given index (O(n)) */
    #removeInternal(index: number): T | undefined {
        if (index < 1 || index >= this.#size - 1) throw new RangeError("Index out of bounds");
        const indexInFirstHalf = this.#size / 2 >= index;
        let currentIndex = indexInFirstHalf ? 0 : this.#size - 1;
        for (const current of indexInFirstHalf ? this.#iterNodes() : this.#iterNodesReversed()) {
            if (currentIndex === index) {
                current.prev!.next = current.next;
                if (current.next) current.next.prev = current.prev;
                this.#size--;
                return current.value;
            }
            indexInFirstHalf ? currentIndex++ : currentIndex--;
        }
    }
}
