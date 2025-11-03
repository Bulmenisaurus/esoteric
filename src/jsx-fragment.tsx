// Simple JSX pragma function - creates DOM elements
export function h(
    tag: string,
    props: Record<string, any> | null,
    ...children: any[]
): HTMLElement | DocumentFragment {
    const element = document.createElement(tag);

    if (props) {
        for (const [key, value] of Object.entries(props)) {
            if (key === 'className') {
                element.className = value;
            } else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.slice(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else if (key !== 'children') {
                element.setAttribute(key, String(value));
            }
        }
    }

    for (const child of children.flat()) {
        if (child instanceof Node) {
            element.appendChild(child);
        } else if (typeof child === 'string' || typeof child === 'number') {
            element.appendChild(document.createTextNode(String(child)));
        } else if (Array.isArray(child)) {
            child.forEach((c) => {
                if (c instanceof Node) {
                    element.appendChild(c);
                } else {
                    element.appendChild(document.createTextNode(String(c)));
                }
            });
        }
    }

    return element;
}
