# Doubly Linked List

DoublyLinkList<T> is a fully-featured, generic doubly linked list implementation in TypeScript. It provides an easy-to-use, efficient data structure for scenarios where frequent insertions and deletions at both ends or at arbitrary positions are required.

## Operations
| Operation | Description | TimeComplexity | 
| --- | --- | --- |
| append | Adds an element to the start of the list | O(1) |
| prepend | Adds an element to the end of the list | O(1) |
| insert | Random insertion of an element  | O(n) |
| remove | remove list element at speciefied index | first/last element - O(1)  <br> other element: O(n)
| get | Acess list item at index | first/last element - O(1)  <br> other element: O(n)
| set | Updates the value of list item |  first/last element - O(1)  <br> other element: O(n)
| clear | Removes all items in the list |  O(1) 

## Usage
```
// Create a new list
const list = new DoublyLinkList<number>();

// Append / prepend: O(1)
list.append(10);
list.append(20);
list.prepend(5);
console.log(list.toArray());  // [5, 10, 20]

// Insert / remove
list.insert(size-1, 7);  // [7, 5, 10, 20] // O(1)
list.remove(0);  // [5, 10, 20]

list.insert(list.size-1, 7);  // [7, 5, 10, 20] // O(1)
list.remove(0);  // [5, 10, 20]

// Access / modify 
console.log(list.get(1));  // 7
list.set(1, 8);
console.log(list.toArray());  // [5, 8, 20]

// First / last / size (O(1))
console.log(list.first, list.last, list.size);  // 5 20 3 

// Iteration
for (const v of list) console.log(v);  // 5, 8, 20
for (const v of list.reversed()) console.log(v);  // 20, 8, 5

// Clear
list.clear();
console.log(list.isEmpty);  // true

// Create from array
const arrList = DoublyLinkList.fromArray([1, 2, 3]);
console.log([...arrList.reversed()]);  // [3, 2, 1]
```
