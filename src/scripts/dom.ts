type QueryRoot = Pick<ParentNode, "querySelector" | "querySelectorAll">;

export function queryElement<T extends Element>(
  root: QueryRoot,
  selector: string,
  type: abstract new () => T,
): T | null {
  const element = root.querySelector(selector);

  return element instanceof type ? element : null;
}

export function queryElements<T extends Element>(
  root: QueryRoot,
  selector: string,
  type: abstract new () => T,
): Array<T> {
  const elements: Array<T> = [];

  for (const element of root.querySelectorAll(selector)) {
    if (element instanceof type) {
      elements.push(element);
    }
  }

  return elements;
}
