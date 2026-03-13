export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: { className?: string; attrs?: Record<string, string> } = {},
  children: Array<HTMLElement | Text> = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (options.className) {
    node.className = options.className;
  }
  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      node.setAttribute(key, value);
    }
  }
  for (const child of children) {
    node.appendChild(child);
  }
  return node;
}

export function txt(content: string): Text {
  return document.createTextNode(content);
}

