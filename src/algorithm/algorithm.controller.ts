import { Controller, Get } from '@nestjs/common';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

@Controller()
export class ParallelController {
  @Get()
  async executeParallelAlgorithms() {
    if (isMainThread) {
      // Головний потік

      const algorithmData = [1, 2, 3]; // Дані для алгоритмів

      // Створення промісів для отримання результатів з підпроцесів
      const workerPromises = algorithmData.map((data) => {
        return new Promise((resolve, reject) => {
          const worker = new Worker(__filename, { workerData: data });

          worker.on('message', resolve);
          worker.on('error', reject);
          worker.on('exit', (code) => {
            if (code !== 0)
              reject(new Error(`Worker stopped with exit code ${code}`));
          });
        });
      });

      // Отримання результатів з підпроцесів
      const results = await Promise.all(workerPromises);

      // Обробка результатів
      const finalResult = results.reduce(
        (accumulator: any, result: any) => accumulator + result,
        0,
      );

      return finalResult;
    } else {
      // Підпроцеси

      // Отримання даних з головного потоку
      const data = workerData;

      // Виконання обчислень в залежності від алгоритму
      let result;
      if (data === 1) {
        result = performAlgorithm1();
      } else if (data === 2) {
        result = performAlgorithm2();
      } else if (data === 3) {
        result = performAlgorithm3();
      } else {
        result = 0; // Повернення значення за замовчуванням
      }

      // Повернення результату головному потоку
      parentPort.postMessage(result);
    }
  }
}

// Функція, що виконує перший алгоритм
function performAlgorithm1() {
  // Complex algorithm implementation for the first algorithm (Merge Sort)
  const arr = [5, 2, 8, 3, 1, 9, 4, 7, 6];

  // Call the merge sort function
  const sortedArr = mergeSort(arr);

  // Returning the sorted array
  return sortedArr;
}

function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }

  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  // Add the remaining elements from the left array
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }

  // Add the remaining elements from the right array
  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }

  return result;
}

// Функція, що виконує другий алгоритм
// Function that performs the second algorithm (Dijkstra's algorithm)
function performAlgorithm2() {
  // Complex algorithm implementation for the second algorithm (Dijkstra's algorithm)

  // Graph representation (adjacency matrix)
  const graph = [
    [0, 4, 0, 0, 0, 0, 0, 8, 0],
    [4, 0, 8, 0, 0, 0, 0, 11, 0],
    [0, 8, 0, 7, 0, 4, 0, 0, 2],
    [0, 0, 7, 0, 9, 14, 0, 0, 0],
    [0, 0, 0, 9, 0, 10, 0, 0, 0],
    [0, 0, 4, 14, 10, 0, 2, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 1, 6],
    [8, 11, 0, 0, 0, 0, 1, 0, 7],
    [0, 0, 2, 0, 0, 0, 6, 7, 0],
  ];

  const startNode = 0; // Starting node index

  // Call Dijkstra's algorithm
  const shortestPaths = dijkstra(graph, startNode);

  // Returning the shortest paths
  return shortestPaths;
}

// Dijkstra's algorithm
function dijkstra(graph: number[][], startNode: number): number[] {
  const numNodes = graph.length;
  const visited: boolean[] = new Array(numNodes).fill(false);
  const distances: number[] = new Array(numNodes).fill(Number.MAX_SAFE_INTEGER);
  distances[startNode] = 0;

  for (let i = 0; i < numNodes - 1; i++) {
    const minDistNode = getMinDistanceNode(distances, visited);
    visited[minDistNode] = true;

    for (let j = 0; j < numNodes; j++) {
      if (
        !visited[j] &&
        graph[minDistNode][j] !== 0 &&
        distances[minDistNode] + graph[minDistNode][j] < distances[j]
      ) {
        distances[j] = distances[minDistNode] + graph[minDistNode][j];
      }
    }
  }

  return distances;
}

function getMinDistanceNode(distances: number[], visited: boolean[]): number {
  let minDist = Number.MAX_SAFE_INTEGER;
  let minDistNode = -1;

  for (let i = 0; i < distances.length; i++) {
    if (!visited[i] && distances[i] < minDist) {
      minDist = distances[i];
      minDistNode = i;
    }
  }

  return minDistNode;
}

// Функція, що виконує третій алгоритм
// Function that performs the third algorithm (DFS)
function performAlgorithm3() {
  // Complex algorithm implementation for the third algorithm (DFS)

  // Graph representation (adjacency list)
  const graph = [[1, 2], [0, 3, 4], [0, 5, 6], [1], [1], [2], [2, 7], [6]];

  const startNode = 0; // Starting node index

  // Call DFS algorithm
  const traversalOrder = dfs(graph, startNode);

  // Returning the traversal order
  return traversalOrder;
}

// DFS algorithm
function dfs(graph: number[][], startNode: number): number[] {
  const numNodes = graph.length;
  const visited: boolean[] = new Array(numNodes).fill(false);
  const traversalOrder: number[] = [];

  // Call recursive DFS function
  recursiveDFS(startNode);

  return traversalOrder;

  function recursiveDFS(node: number) {
    visited[node] = true;
    traversalOrder.push(node);

    for (const neighbor of graph[node]) {
      if (!visited[neighbor]) {
        recursiveDFS(neighbor);
      }
    }
  }
}
