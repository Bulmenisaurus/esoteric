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

const openAboutPopup = () => {
    const popup = document.getElementById('about-popup');
    if (popup) {
        popup.style.display = 'flex';
    }
};

const closeAboutPopup = () => {
    const popup = document.getElementById('about-popup');
    if (popup) {
        popup.style.display = 'none';
    }
};

const populateData = (data: Data) => {
    const container = document.getElementById('main');
    if (!container) return;

    let active = getActive();
    let max = data.length - 1;

    // Add about link in upper left corner
    const aboutLink = (
        <button
            id='about-link'
            onClick={() => {
                openAboutPopup();
            }}
        >
            About
        </button>
    );
    container.appendChild(aboutLink);

    // Add popup modal
    const popup = (
        <div id='about-popup' className='popup-overlay' onClick={closeAboutPopup}>
            <div className='popup-content' onClick={(e: Event) => e.stopPropagation()}>
                <button className='popup-close' onClick={closeAboutPopup}>
                    ×
                </button>
                <h2>About</h2>
                <p>
                    This is a collection of some of my favorite snippets of python. All are created
                    by me unless otherwise specified.
                </p>
            </div>
        </div>
    );
    container.appendChild(popup);

    // Add Escape key handler to close popup
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            const popup = document.getElementById('about-popup');
            if (popup && popup.style.display === 'flex') {
                closeAboutPopup();
            }
        }
    });

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
