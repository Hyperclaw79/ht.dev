import { writable } from 'svelte/store';

export const page = writable({
    error: {
        message: 'Test error message'
    },
    url: {
        pathname: '/',
        search: '',
        hash: ''
    },
    params: {},
    route: {
        id: null
    },
    status: 200
});

export const navigating = writable(null);
export const updated = writable(false);