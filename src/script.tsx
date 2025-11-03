import { h } from './jsx-fragment';

import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';

import 'highlight.js/styles/github.css';

hljs.registerLanguage('python', python);

interface Entry {
    code: string;
    tags: string[];
    title: string;
}

type Data = Entry[];

const fetchContent = async () => {
    const request = await fetch('./data.json');
    const json = (await request.json()) as Data;

    return json;
};

const getActive = () => {
    const current = new URL(window.location.href).searchParams.get('index');
    if (!current) return 0;
    return parseInt(current);
};

const previous = (current: number): number => {
    if (current <= 0) return current;

    const currentElement = document.getElementById('entry' + current.toString());
    if (!currentElement) return current;
    currentElement.classList.remove('active');
    currentElement.classList.add('inactive');
    const previousElement = document.getElementById('entry' + (current - 1).toString());
    if (!previousElement) return current;
    previousElement.classList.remove('inactive');
    previousElement.classList.add('active');
    window.history.pushState({}, '', '?index=' + (current - 1).toString());

    return current - 1;
};

const next = (current: number, max: number): number => {
    if (current >= max) return current;
    const currentElement = document.getElementById('entry' + current.toString());
    if (!currentElement) return current;
    currentElement.classList.remove('active');
    currentElement.classList.add('inactive');
    const nextElement = document.getElementById('entry' + (current + 1).toString());
    if (!nextElement) return current;
    nextElement.classList.remove('inactive');
    nextElement.classList.add('active');
    window.history.pushState({}, '', '?index=' + (current + 1).toString());

    return current + 1;
};

const populateData = (data: Data) => {
    const container = document.getElementById('main');
    if (!container) return;

    let active = getActive();
    let max = data.length - 1;

    container.append(
        <main>
            {data.map((entry, i) => (
                <div
                    className={'entry' + (i === active ? ' active' : ' inactive')}
                    id={'entry' + i.toString()}
                >
                    <h1>{entry.title}</h1>
                    <div id='tags'>
                        {entry.tags.map((tag) => (
                            <div className='tag'>{tag}</div>
                        ))}
                    </div>
                    <pre>
                        <code className='language-python'>{entry.code}</code>
                    </pre>
                </div>
            ))}
            <div id='buttons'>
                <button
                    onClick={() => {
                        active = previous(active);
                    }}
                >
                    Prev
                </button>
                <button
                    onClick={() => {
                        active = next(active, max);
                    }}
                >
                    Next
                </button>
            </div>
        </main>
    );

    hljs.highlightAll();

    window.onpopstate = () => {
        const active = getActive();
        const currentElement = document.getElementById('entry' + active.toString());
        if (!currentElement) return;
        currentElement.classList.remove('active');
        currentElement.classList.add('inactive');
        window.history.pushState({}, '', '?index=' + (active - 1).toString());
    };
};

const main = () => {
    const data = fetchContent();
    window.addEventListener('DOMContentLoaded', () => {
        data.then((res) => {
            populateData(res);
        });
    });
};

main();
