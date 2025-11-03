// JSX type definitions for custom h() function
declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: {
            [propName: string]: any;
        };
    }

    interface Element extends HTMLElement {}
}
