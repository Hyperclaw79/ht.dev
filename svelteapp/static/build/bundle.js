
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_custom_element_data_map(node, data_map) {
        Object.keys(data_map).forEach((key) => {
            set_custom_element_data(node, key, data_map[key]);
        });
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    /** regex of all html void element names */
    const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
    function is_void(name) {
        return void_element_names.test(name) || name.toLowerCase() === '!doctype';
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.52.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function validate_dynamic_element(tag) {
        const is_string = typeof tag === 'string';
        if (tag && !is_string) {
            throw new Error('<svelte:element> expects "this" attribute to be a string.');
        }
    }
    function validate_void_dynamic_element(tag) {
        if (tag && is_void(tag)) {
            console.warn(`<svelte:element this="${tag}"> is self-closing and cannot have content.`);
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Shrinkable.svelte generated by Svelte v3.52.0 */
    const file$m = "src\\components\\Shrinkable.svelte";

    function create_fragment$n(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "shrinkable svelte-ua7787");
    			toggle_class(div, "shrunk", /*shrunk*/ ctx[1]);
    			add_location(div, file$m, 16, 0, 357);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[5](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*shrunk*/ 2) {
    				toggle_class(div, "shrunk", /*shrunk*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[5](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Shrinkable', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let containerRef;
    	let shrunk = false;
    	let { handle } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (handle === undefined && !('handle' in $$props || $$self.$$.bound[$$self.$$.props['handle']])) {
    			console.warn("<Shrinkable> was created without expected prop 'handle'");
    		}
    	});

    	const writable_props = ['handle'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Shrinkable> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerRef = $$value;
    			$$invalidate(0, containerRef);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('handle' in $$props) $$invalidate(2, handle = $$props.handle);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		containerRef,
    		shrunk,
    		handle
    	});

    	$$self.$inject_state = $$props => {
    		if ('containerRef' in $$props) $$invalidate(0, containerRef = $$props.containerRef);
    		if ('shrunk' in $$props) $$invalidate(1, shrunk = $$props.shrunk);
    		if ('handle' in $$props) $$invalidate(2, handle = $$props.handle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*handle*/ 4) {
    			if (handle) {
    				handle.addEventListener('click', () => {
    					$$invalidate(1, shrunk = true);
    					dispatch('shrunkEvent');
    				});
    			}
    		}
    	};

    	return [containerRef, shrunk, handle, $$scope, slots, div_binding];
    }

    class Shrinkable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { handle: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Shrinkable",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get handle() {
    		throw new Error("<Shrinkable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handle(value) {
    		throw new Error("<Shrinkable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const skills = {
        "Technical Skills": [
            {
                "name": "Python",
                "confidence": 100,
                "icon": "/icons/technical/python.webp"
            },
            {
                "name": "REST API",
                "confidence": 100,
                "icon": "/icons/technical/rest.png"
            },
            {
                "name": "GIT",
                "confidence": 100,
                "icon": "/icons/technical/git.png"
            },
            {
                "name": "HTML5",
                "confidence": 100,
                "icon": "/icons/technical/html5.png"
            },
            {
                "name": "CSS3",
                "confidence": 95,
                "icon": "/icons/technical/css3.png"
            },
            {
                "name": "JavaScript",
                "confidence": 95,
                "icon": "/icons/technical/javascript.png"
            },
            {
                "name": "ReactJS",
                "confidence": 85,
                "icon": "/icons/technical/reactjs.png"
            }
        ],
        "Soft Skills": [
            {
                "name": "Communication Skills",
                "confidence": 100,
                "icon": "/icons/soft/communication.png"
            },
            {
                "name": "Lateral Thinking",
                "confidence": 100,
                "icon": "/icons/soft/lateral-thinking.png"
            },
            {
                "name": "Logical Analysis",
                "confidence": 95,
                "icon": "/icons/soft/logical-analysis.png"
            },
            {
                "name": "English",
                "confidence": 100,
                "icon": "/icons/soft/english.png"
            },
            {
                "name": "Leadership",
                "confidence": 100,
                "icon": "/icons/soft/leadership.png"
            },
            {
                "name": "Teamwork",
                "confidence": 100,
                "icon": "/icons/soft/teamwork.png"
            },
            {
                "name": "Adaptability",
                "confidence": 90,
                "icon": "/icons/soft/adaptability.png"
            }
        ]
    };

    // Helper functions
    const transpose = (matrix) => {
        return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
    };
    const mutate = (arr, width, height) => {
        return arr.map((item) => ({
            x: item.x + (Math.random() * (width / 2)),
            y: item.y + (Math.random() * (height / 2))
        }));
        // return arr;
    };

    const generateGrid = (len) => {
        const numRows = Math.ceil(Math.sqrt(len));
        const numCols = Math.ceil(len / numRows);
        const widthRanges = Array.from({ length: numRows }, (_, i) => (Math.ceil((window.innerWidth / numRows) * i)));
        const heightRanges = Array.from({ length: numCols }, (_, i) => (Math.ceil((window.innerHeight / numCols) * i)));
        const grid = Array.from({ length: numRows }, (_, i) => (
            Array.from({ length: numCols }, (_, j) => (
                { x: widthRanges[i], y: heightRanges[j] }
            ))
        ));
        return mutate(transpose(grid).flat(1), window.innerWidth / numRows, window.innerHeight / numCols);
    };
    const getRandomRotation = () => {
        return Math.floor(Math.random() * 120) - 60;
    };

    // Global variables
    const icons = skills["Technical Skills"].sort(
        () => Math.random() - 0.5
    ).map((skill) => skill.icon);
    const grid = generateGrid(icons.length);

    // Generated data
    const iconData = icons.map((icon, idx) => {
        return { icon, position: grid[idx], rotation: getRandomRotation() };
    });

    /* src\components\landing\IconCanvas.svelte generated by Svelte v3.52.0 */
    const file$l = "src\\components\\landing\\IconCanvas.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (6:4) {#each icons as icon}
    function create_each_block$9(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "key", /*icon*/ ctx[0].icon);
    			attr_dev(img, "class", "icon svelte-1ywxnw6");
    			if (!src_url_equal(img.src, img_src_value = /*icon*/ ctx[0].icon)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Technical Skill Icon");

    			attr_dev(img, "style", `
                transform: rotate(${/*icon*/ ctx[0].rotation}deg);
                top: ${/*icon*/ ctx[0].position.y}px;
                left: ${/*icon*/ ctx[0].position.x}px;
            `);

    			add_location(img, file$l, 6, 8, 102);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(6:4) {#each icons as icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let each_value = iconData;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(div, file$l, 4, 0, 60);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*icons*/ 0) {
    				each_value = iconData;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconCanvas', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconCanvas> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ icons: iconData });
    	return [];
    }

    class IconCanvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconCanvas",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\components\landing\StartButton.svelte generated by Svelte v3.52.0 */
    const file$k = "src\\components\\landing\\StartButton.svelte";

    function create_fragment$l(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Start";
    			attr_dev(button, "class", "startBtn svelte-1b2cmfv");
    			toggle_class(button, "activated", /*activated*/ ctx[1]);
    			add_location(button, file$k, 13, 0, 265);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			/*button_binding*/ ctx[2](button);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activated*/ 2) {
    				toggle_class(button, "activated", /*activated*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			/*button_binding*/ ctx[2](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StartButton', slots, []);
    	let { binder } = $$props;
    	let activated = false;

    	onMount(() => {
    		window.addEventListener('hoverStartBtn', e => {
    			$$invalidate(1, activated = e.detail.activated);
    		});
    	});

    	$$self.$$.on_mount.push(function () {
    		if (binder === undefined && !('binder' in $$props || $$self.$$.bound[$$self.$$.props['binder']])) {
    			console.warn("<StartButton> was created without expected prop 'binder'");
    		}
    	});

    	const writable_props = ['binder'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StartButton> was created with unknown prop '${key}'`);
    	});

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			binder = $$value;
    			$$invalidate(0, binder);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('binder' in $$props) $$invalidate(0, binder = $$props.binder);
    	};

    	$$self.$capture_state = () => ({ onMount, binder, activated });

    	$$self.$inject_state = $$props => {
    		if ('binder' in $$props) $$invalidate(0, binder = $$props.binder);
    		if ('activated' in $$props) $$invalidate(1, activated = $$props.activated);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [binder, activated, button_binding];
    }

    class StartButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { binder: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StartButton",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get binder() {
    		throw new Error("<StartButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set binder(value) {
    		throw new Error("<StartButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let counter = 0;

    const commandsMap = {
        start: (inputs) => {
            // document.querySelector("button[class~='startBtn']").click();
            counter++;
            inputs.push({ output: "Starting...", uuid: Date.now() + counter });
            counter++;
            inputs.push({ progress: true, uuid: Date.now() + counter });
            counter++;
            inputs.push({
                action: () => {
                    const startBtn = document.querySelector("button[class~='startBtn']");
                    startBtn.click();
                },
                uuid: Date.now() + counter,
                timeout: 2000
            });
        },
        clear: (inputs) => {
            inputs.length = 0;
        },
        ls: (inputs) => {
            const sections = [".", "..", ...[...document.querySelectorAll("main > section")].map((elem) => elem.id)];
            counter++;
            inputs.push({ output: sections, uuid: Date.now() + counter });
        },
        help: (inputs) => {
            counter++;
            inputs.push({ output: "You can check out these commands:", uuid: Date.now() + counter });
            counter++;
            inputs.push({ output: Object.keys(commandsMap), uuid: Date.now() + counter });
        },
        chdir: (inputs, cmd, data) => {
            if (cmd.split(" ").length === 1) {
                counter++;
                inputs.push({ output: "Please specify a directory.", uuid: Date.now() + counter, error: true });
            }
            data.cwd = cmd.split(" ")[1];
        },
        pwd: (inputs, cmd, data) => {
            counter++;
            inputs.push({ output: data.cwd, uuid: Date.now() + counter });
        },
        echo: (inputs, cmd) => {
            counter++;
            inputs.push({ output: cmd.split(" ").slice(1).join(" "), uuid: Date.now() + counter });
        }
    };

    const execute = (inputs, cmd, data, commandsCache) => {
        commandsCache.push({ command: cmd });
        inputs.forEach(element => {
            element.isLastInput = false;
        });
        const cmdWord = cmd.toLowerCase().split(" ")[0];
        if (!Object.keys(commandsMap).includes(cmdWord)) {
            if (cmd) {
                counter++;
                inputs.push({ output: `Command not found: ${cmd}`, uuid: Date.now() + counter, error: true });
            }
        } else {
            commandsMap[cmdWord](inputs, cmd, data);
        }
        counter++;
        inputs.push({ command: "", uuid: Date.now() + counter, isLastInput: true });
        return inputs;
    };

    /* src\components\landing\terminal\Input.svelte generated by Svelte v3.52.0 */

    const { Object: Object_1$2 } = globals;
    const file$j = "src\\components\\landing\\terminal\\Input.svelte";

    function create_fragment$k(ctx) {
    	let div5;
    	let div0;
    	let t0;
    	let span0;
    	let t1_value = /*data*/ ctx[1].user.replace('@', '㉿') + "";
    	let t1;
    	let t2;
    	let span1;
    	let t3_value = /*data*/ ctx[1].cwd + "";
    	let t3;
    	let t4;
    	let t5;
    	let div4;
    	let div2;
    	let span2;
    	let t7;
    	let div1;
    	let input_1;
    	let input_1_style_value;
    	let t8;
    	let span3;
    	let t9;
    	let div3;
    	let i;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			t0 = text("(");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = text(")-[");
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = text("]");
    			t5 = space();
    			div4 = element("div");
    			div2 = element("div");
    			span2 = element("span");
    			span2.textContent = "$ ";
    			t7 = space();
    			div1 = element("div");
    			input_1 = element("input");
    			t8 = space();
    			span3 = element("span");
    			t9 = space();
    			div3 = element("div");
    			i = element("i");
    			attr_dev(span0, "class", "svelte-1avxmnv");
    			add_location(span0, file$j, 83, 23, 2791);
    			attr_dev(span1, "class", "svelte-1avxmnv");
    			add_location(span1, file$j, 83, 68, 2836);
    			attr_dev(div0, "class", "path svelte-1avxmnv");
    			add_location(div0, file$j, 83, 4, 2772);
    			attr_dev(span2, "class", "dollar svelte-1avxmnv");
    			add_location(span2, file$j, 86, 12, 2959);
    			attr_dev(input_1, "class", "input svelte-1avxmnv");
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "style", input_1_style_value = `width: ${/*size*/ ctx[4]}ch;`);
    			add_location(input_1, file$j, 88, 16, 3052);
    			attr_dev(span3, "class", "code svelte-1avxmnv");
    			add_location(span3, file$j, 94, 16, 3252);
    			attr_dev(div1, "class", "inputWrapper svelte-1avxmnv");
    			add_location(div1, file$j, 87, 12, 3008);
    			attr_dev(div2, "class", "inputContainer svelte-1avxmnv");
    			add_location(div2, file$j, 85, 8, 2917);
    			attr_dev(i, "class", "svelte-1avxmnv");
    			toggle_class(i, "blinker", /*blinker*/ ctx[0]);
    			add_location(i, file$j, 97, 38, 3349);
    			attr_dev(div3, "class", "blinkerContainer svelte-1avxmnv");
    			add_location(div3, file$j, 97, 8, 3319);
    			attr_dev(div4, "class", "line svelte-1avxmnv");
    			add_location(div4, file$j, 84, 4, 2872);
    			attr_dev(div5, "class", "container svelte-1avxmnv");
    			add_location(div5, file$j, 82, 0, 2743);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, t0);
    			append_dev(div0, span0);
    			append_dev(span0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, span1);
    			append_dev(span1, t3);
    			append_dev(div0, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, span2);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, input_1);
    			/*input_1_binding*/ ctx[7](input_1);
    			append_dev(div1, t8);
    			append_dev(div1, span3);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div3, i);
    			/*div4_binding*/ ctx[8](div4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 2 && t1_value !== (t1_value = /*data*/ ctx[1].user.replace('@', '㉿') + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*data*/ 2 && t3_value !== (t3_value = /*data*/ ctx[1].cwd + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*size*/ 16 && input_1_style_value !== (input_1_style_value = `width: ${/*size*/ ctx[4]}ch;`)) {
    				attr_dev(input_1, "style", input_1_style_value);
    			}

    			if (dirty & /*blinker*/ 1) {
    				toggle_class(i, "blinker", /*blinker*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			/*input_1_binding*/ ctx[7](null);
    			/*div4_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let input, line;
    	let hovering = false;
    	let size = 1;
    	let cmdStackPointer = 1;
    	let { execCallback } = $$props;
    	let { blinker = false } = $$props;
    	let { data } = $$props;
    	let { commandsCache = [] } = $$props;
    	const commands = Object.keys(commandsMap);

    	//eslint-disable-next-line no-useless-escape
    	const commandRegex = new RegExp(`^(${commands.join('|')})\s*(.*)$`, "i");

    	onMount(() => {
    		setTimeout(
    			() => {
    				input.focus();
    			},
    			200
    		);

    		line.addEventListener("click", () => {
    			input.focus();
    		});

    		input.addEventListener("keyup", e => {
    			if (e.key !== "ArrowUp") {
    				cmdStackPointer = 1;
    			}

    			if (e.key === "Enter" && execCallback) {
    				execCallback(input.value);
    			}

    			if (e.key === "ArrowUp") {
    				let prevCmd = commandsCache[commandsCache.length - cmdStackPointer]?.command;

    				if (prevCmd) {
    					cmdStackPointer++;
    					$$invalidate(4, size = prevCmd.length || 1);
    					$$invalidate(2, input.value = prevCmd, input);
    					input.focus();
    				}
    			}

    			if (e.key === "ArrowDown") {
    				$$invalidate(2, input.value = "", input);
    				$$invalidate(4, size = 1);
    				input.focus();
    			}

    			if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
    				$$invalidate(2, input.selectionStart = $$invalidate(2, input.selectionEnd = input.value.length, input), input);
    				e.preventDefault();
    			}
    		});

    		input.addEventListener("input", () => {
    			$$invalidate(4, size = input.value.length || 1);
    			let matches = commandRegex.exec(input.value);

    			if (matches) {
    				$$invalidate(2, input.nextElementSibling.innerHTML = matches[1], input);
    			} else {
    				$$invalidate(2, input.nextElementSibling.innerHTML = "", input);
    			}

    			if (input.value.toLowerCase() === "start") {
    				hovering = true;
    				window.dispatchEvent(new CustomEvent("hoverStartBtn", { detail: { activated: true } }));
    			} else if (hovering) {
    				hovering = false;
    				window.dispatchEvent(new CustomEvent("hoverStartBtn", { detail: { activated: false } }));
    			}
    		});
    	});

    	$$self.$$.on_mount.push(function () {
    		if (execCallback === undefined && !('execCallback' in $$props || $$self.$$.bound[$$self.$$.props['execCallback']])) {
    			console.warn("<Input> was created without expected prop 'execCallback'");
    		}

    		if (data === undefined && !('data' in $$props || $$self.$$.bound[$$self.$$.props['data']])) {
    			console.warn("<Input> was created without expected prop 'data'");
    		}
    	});

    	const writable_props = ['execCallback', 'blinker', 'data', 'commandsCache'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(2, input);
    		});
    	}

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			line = $$value;
    			$$invalidate(3, line);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('execCallback' in $$props) $$invalidate(5, execCallback = $$props.execCallback);
    		if ('blinker' in $$props) $$invalidate(0, blinker = $$props.blinker);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('commandsCache' in $$props) $$invalidate(6, commandsCache = $$props.commandsCache);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		commandsMap,
    		input,
    		line,
    		hovering,
    		size,
    		cmdStackPointer,
    		execCallback,
    		blinker,
    		data,
    		commandsCache,
    		commands,
    		commandRegex
    	});

    	$$self.$inject_state = $$props => {
    		if ('input' in $$props) $$invalidate(2, input = $$props.input);
    		if ('line' in $$props) $$invalidate(3, line = $$props.line);
    		if ('hovering' in $$props) hovering = $$props.hovering;
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('cmdStackPointer' in $$props) cmdStackPointer = $$props.cmdStackPointer;
    		if ('execCallback' in $$props) $$invalidate(5, execCallback = $$props.execCallback);
    		if ('blinker' in $$props) $$invalidate(0, blinker = $$props.blinker);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('commandsCache' in $$props) $$invalidate(6, commandsCache = $$props.commandsCache);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		blinker,
    		data,
    		input,
    		line,
    		size,
    		execCallback,
    		commandsCache,
    		input_1_binding,
    		div4_binding
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			execCallback: 5,
    			blinker: 0,
    			data: 1,
    			commandsCache: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get execCallback() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set execCallback(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blinker() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blinker(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get commandsCache() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set commandsCache(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\landing\terminal\Output.svelte generated by Svelte v3.52.0 */

    const { Object: Object_1$1 } = globals;
    const file$i = "src\\components\\landing\\terminal\\Output.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (14:4) {:else}
    function create_else_block$4(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*output*/ ctx[0]);
    			attr_dev(span, "class", "output svelte-uw5ha7");
    			toggle_class(span, "error", /*error*/ ctx[1]);
    			add_location(span, file$i, 14, 8, 449);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*output*/ 1) set_data_dev(t, /*output*/ ctx[0]);

    			if (dirty & /*error*/ 2) {
    				toggle_class(span, "error", /*error*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(14:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:4) {#if Array.isArray(output)}
    function create_if_block$7(ctx) {
    	let each_1_anchor;
    	let each_value = /*output*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*commandRegex, output*/ 5) {
    				each_value = /*output*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(10:4) {#if Array.isArray(output)}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#each output as line}
    function create_each_block$8(ctx) {
    	let span;
    	let t_value = /*line*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "output svelte-uw5ha7");
    			toggle_class(span, "command", /*commandRegex*/ ctx[2].exec(/*line*/ ctx[4]));
    			add_location(span, file$i, 11, 12, 335);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*output*/ 1 && t_value !== (t_value = /*line*/ ctx[4] + "")) set_data_dev(t, t_value);

    			if (dirty & /*commandRegex, output*/ 5) {
    				toggle_class(span, "command", /*commandRegex*/ ctx[2].exec(/*line*/ ctx[4]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(11:8) {#each output as line}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let show_if;

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*output*/ 1) show_if = null;
    		if (show_if == null) show_if = !!Array.isArray(/*output*/ ctx[0]);
    		if (show_if) return create_if_block$7;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "outputContainer svelte-uw5ha7");
    			add_location(div, file$i, 8, 0, 227);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Output', slots, []);
    	let { output, error } = $$props;
    	const commands = Object.keys(commandsMap);
    	const commandRegex = new RegExp(`^(${commands.join('|')})$`);

    	$$self.$$.on_mount.push(function () {
    		if (output === undefined && !('output' in $$props || $$self.$$.bound[$$self.$$.props['output']])) {
    			console.warn("<Output> was created without expected prop 'output'");
    		}

    		if (error === undefined && !('error' in $$props || $$self.$$.bound[$$self.$$.props['error']])) {
    			console.warn("<Output> was created without expected prop 'error'");
    		}
    	});

    	const writable_props = ['output', 'error'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Output> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('output' in $$props) $$invalidate(0, output = $$props.output);
    		if ('error' in $$props) $$invalidate(1, error = $$props.error);
    	};

    	$$self.$capture_state = () => ({
    		commandsMap,
    		output,
    		error,
    		commands,
    		commandRegex
    	});

    	$$self.$inject_state = $$props => {
    		if ('output' in $$props) $$invalidate(0, output = $$props.output);
    		if ('error' in $$props) $$invalidate(1, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [output, error, commandRegex];
    }

    class Output extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { output: 0, error: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Output",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get output() {
    		throw new Error("<Output>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set output(value) {
    		throw new Error("<Output>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<Output>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<Output>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\landing\terminal\AsciiProgress.svelte generated by Svelte v3.52.0 */
    const file$h = "src\\components\\landing\\terminal\\AsciiProgress.svelte";

    function create_fragment$i(ctx) {
    	let div1;
    	let div0;
    	let div0_style_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "progress-bar svelte-133rb66");

    			attr_dev(div0, "style", div0_style_value = `
        width: ${/*currProgress*/ ctx[1]}%;
        transition: width ${/*timeout*/ ctx[0]}ms;
    `);

    			add_location(div0, file$h, 20, 4, 445);
    			attr_dev(div1, "class", "progress svelte-133rb66");
    			add_location(div1, file$h, 19, 0, 417);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currProgress, timeout*/ 3 && div0_style_value !== (div0_style_value = `
        width: ${/*currProgress*/ ctx[1]}%;
        transition: width ${/*timeout*/ ctx[0]}ms;
    `)) {
    				attr_dev(div0, "style", div0_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AsciiProgress', slots, []);
    	let { startProgress = 0 } = $$props;
    	let { endProgress = 90 } = $$props;
    	let { timeout = 1000 } = $$props;
    	let { callback } = $$props;
    	let currProgress = startProgress;

    	onMount(() => {
    		setTimeout(
    			() => {
    				$$invalidate(1, currProgress = endProgress);
    			},
    			100
    		);

    		if (callback) {
    			setTimeout(callback, timeout - 100);
    		}
    	});

    	$$self.$$.on_mount.push(function () {
    		if (callback === undefined && !('callback' in $$props || $$self.$$.bound[$$self.$$.props['callback']])) {
    			console.warn("<AsciiProgress> was created without expected prop 'callback'");
    		}
    	});

    	const writable_props = ['startProgress', 'endProgress', 'timeout', 'callback'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AsciiProgress> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('startProgress' in $$props) $$invalidate(2, startProgress = $$props.startProgress);
    		if ('endProgress' in $$props) $$invalidate(3, endProgress = $$props.endProgress);
    		if ('timeout' in $$props) $$invalidate(0, timeout = $$props.timeout);
    		if ('callback' in $$props) $$invalidate(4, callback = $$props.callback);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		startProgress,
    		endProgress,
    		timeout,
    		callback,
    		currProgress
    	});

    	$$self.$inject_state = $$props => {
    		if ('startProgress' in $$props) $$invalidate(2, startProgress = $$props.startProgress);
    		if ('endProgress' in $$props) $$invalidate(3, endProgress = $$props.endProgress);
    		if ('timeout' in $$props) $$invalidate(0, timeout = $$props.timeout);
    		if ('callback' in $$props) $$invalidate(4, callback = $$props.callback);
    		if ('currProgress' in $$props) $$invalidate(1, currProgress = $$props.currProgress);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [timeout, currProgress, startProgress, endProgress, callback];
    }

    class AsciiProgress extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			startProgress: 2,
    			endProgress: 3,
    			timeout: 0,
    			callback: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AsciiProgress",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get startProgress() {
    		throw new Error("<AsciiProgress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startProgress(value) {
    		throw new Error("<AsciiProgress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get endProgress() {
    		throw new Error("<AsciiProgress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set endProgress(value) {
    		throw new Error("<AsciiProgress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get timeout() {
    		throw new Error("<AsciiProgress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timeout(value) {
    		throw new Error("<AsciiProgress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get callback() {
    		throw new Error("<AsciiProgress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set callback(value) {
    		throw new Error("<AsciiProgress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\landing\terminal\Action.svelte generated by Svelte v3.52.0 */

    // (15:0) {#if timeout > 0 && !noProgress}
    function create_if_block$6(ctx) {
    	let asciiprogress;
    	let current;

    	asciiprogress = new AsciiProgress({
    			props: {
    				timeout: /*timeout*/ ctx[1],
    				callback: /*action*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(asciiprogress.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(asciiprogress, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const asciiprogress_changes = {};
    			if (dirty & /*timeout*/ 2) asciiprogress_changes.timeout = /*timeout*/ ctx[1];
    			if (dirty & /*action*/ 1) asciiprogress_changes.callback = /*action*/ ctx[0];
    			asciiprogress.$set(asciiprogress_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(asciiprogress.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(asciiprogress.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(asciiprogress, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(15:0) {#if timeout > 0 && !noProgress}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*timeout*/ ctx[1] > 0 && !/*noProgress*/ ctx[2] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*timeout*/ ctx[1] > 0 && !/*noProgress*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*timeout, noProgress*/ 6) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Action', slots, []);
    	let { action } = $$props;
    	let { timeout = 0 } = $$props;
    	let { noProgress = false } = $$props;

    	onMount(() => {
    		if (timeout === 0) {
    			action();
    		} else if (noProgress) {
    			setTimeout(action, timeout);
    		}
    	});

    	$$self.$$.on_mount.push(function () {
    		if (action === undefined && !('action' in $$props || $$self.$$.bound[$$self.$$.props['action']])) {
    			console.warn("<Action> was created without expected prop 'action'");
    		}
    	});

    	const writable_props = ['action', 'timeout', 'noProgress'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Action> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('action' in $$props) $$invalidate(0, action = $$props.action);
    		if ('timeout' in $$props) $$invalidate(1, timeout = $$props.timeout);
    		if ('noProgress' in $$props) $$invalidate(2, noProgress = $$props.noProgress);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		AsciiProgress,
    		action,
    		timeout,
    		noProgress
    	});

    	$$self.$inject_state = $$props => {
    		if ('action' in $$props) $$invalidate(0, action = $$props.action);
    		if ('timeout' in $$props) $$invalidate(1, timeout = $$props.timeout);
    		if ('noProgress' in $$props) $$invalidate(2, noProgress = $$props.noProgress);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [action, timeout, noProgress];
    }

    class Action extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { action: 0, timeout: 1, noProgress: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Action",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get action() {
    		throw new Error("<Action>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<Action>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get timeout() {
    		throw new Error("<Action>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timeout(value) {
    		throw new Error("<Action>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noProgress() {
    		throw new Error("<Action>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noProgress(value) {
    		throw new Error("<Action>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\landing\terminal\Screen.svelte generated by Svelte v3.52.0 */
    const file$g = "src\\components\\landing\\terminal\\Screen.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (52:53) 
    function create_if_block_2$1(ctx) {
    	let action;
    	let current;

    	action = new Action({
    			props: {
    				action: /*input*/ ctx[6].action,
    				timeout: /*input*/ ctx[6].timeout || 0
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(action.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(action, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const action_changes = {};
    			if (dirty & /*inputs*/ 4) action_changes.action = /*input*/ ctx[6].action;
    			if (dirty & /*inputs*/ 4) action_changes.timeout = /*input*/ ctx[6].timeout || 0;
    			action.$set(action_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(action.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(action.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(action, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(52:53) ",
    		ctx
    	});

    	return block;
    }

    // (50:53) 
    function create_if_block_1$3(ctx) {
    	let output;
    	let current;

    	output = new Output({
    			props: {
    				output: /*input*/ ctx[6].output,
    				error: /*input*/ ctx[6].error
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(output.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(output, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const output_changes = {};
    			if (dirty & /*inputs*/ 4) output_changes.output = /*input*/ ctx[6].output;
    			if (dirty & /*inputs*/ 4) output_changes.error = /*input*/ ctx[6].error;
    			output.$set(output_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(output.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(output.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(output, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(50:53) ",
    		ctx
    	});

    	return block;
    }

    // (43:16) {#if input.command !== undefined}
    function create_if_block$5(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				execCallback: /*handleExec*/ ctx[4],
    				blinker: /*input*/ ctx[6].isLastInput,
    				data: /*data*/ ctx[0],
    				commandsCache: /*commandsCache*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};
    			if (dirty & /*inputs*/ 4) input_changes.blinker = /*input*/ ctx[6].isLastInput;
    			if (dirty & /*data*/ 1) input_changes.data = /*data*/ ctx[0];
    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(43:16) {#if input.command !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (42:12) {#each inputs as input (input.uuid)}
    function create_each_block$7(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_if_block_1$3, create_if_block_2$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*input*/ ctx[6].command !== undefined) return 0;
    		if (/*input*/ ctx[6].output !== undefined) return 1;
    		if (/*input*/ ctx[6].action !== undefined) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(42:12) {#each inputs as input (input.uuid)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let pre;
    	let t2;
    	let code0;
    	let t4;
    	let code1;
    	let t6;
    	let t7;
    	let div1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*inputs*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*input*/ ctx[6].uuid;
    	validate_each_keys(ctx, each_value, get_each_context$7, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$7(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$7(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "HT's Portfolio";
    			t1 = space();
    			pre = element("pre");
    			t2 = text("                Enter the command ");
    			code0 = element("code");
    			code0.textContent = "Start";
    			t4 = text(" or click the button.\r\n                Alternatively, you can use the ");
    			code1 = element("code");
    			code1.textContent = "Help";
    			t6 = text(" command to play around.\r\n            ");
    			t7 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "title svelte-49kf84");
    			add_location(h1, file$g, 34, 12, 976);
    			attr_dev(code0, "class", "svelte-49kf84");
    			add_location(code0, file$g, 36, 34, 1085);
    			attr_dev(code1, "class", "svelte-49kf84");
    			add_location(code1, file$g, 37, 47, 1173);
    			attr_dev(pre, "class", "subtitle svelte-49kf84");
    			add_location(pre, file$g, 35, 12, 1027);
    			attr_dev(div0, "class", "banner svelte-49kf84");
    			add_location(div0, file$g, 33, 8, 942);
    			add_location(div1, file$g, 40, 8, 1260);
    			attr_dev(div2, "class", "innerDiv svelte-49kf84");
    			add_location(div2, file$g, 32, 4, 910);
    			attr_dev(div3, "class", "screen svelte-49kf84");
    			add_location(div3, file$g, 31, 0, 865);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, pre);
    			append_dev(pre, t2);
    			append_dev(pre, code0);
    			append_dev(pre, t4);
    			append_dev(pre, code1);
    			append_dev(pre, t6);
    			append_dev(div2, t7);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			/*div3_binding*/ ctx[5](div3);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*handleExec, inputs, data, commandsCache, undefined*/ 29) {
    				each_value = /*inputs*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$7, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div1, outro_and_destroy_block, create_each_block$7, null, get_each_context$7);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*div3_binding*/ ctx[5](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Screen', slots, []);
    	let screen;

    	let inputs = [
    		{
    			command: '',
    			uuid: Date.now() + Math.random(),
    			isLastInput: true
    		}
    	];

    	let commandsCache = [];
    	let { data } = $$props;

    	const handleExec = command => {
    		$$invalidate(2, inputs = execute(inputs, command, data, commandsCache));
    		$$invalidate(0, data = { ...data });
    		$$invalidate(2, inputs = [...inputs].sort((a, b) => a.uuid - b.uuid));
    	};

    	onMount(() => {
    		screen && screen.addEventListener("click", () => {
    			let nodes = screen.querySelectorAll('input[class~="input"]');
    			nodes[nodes.length - 1].focus();
    		});
    	});

    	$$self.$$.on_mount.push(function () {
    		if (data === undefined && !('data' in $$props || $$self.$$.bound[$$self.$$.props['data']])) {
    			console.warn("<Screen> was created without expected prop 'data'");
    		}
    	});

    	const writable_props = ['data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Screen> was created with unknown prop '${key}'`);
    	});

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			screen = $$value;
    			$$invalidate(1, screen);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Input,
    		execute,
    		Output,
    		Action,
    		screen,
    		inputs,
    		commandsCache,
    		data,
    		handleExec
    	});

    	$$self.$inject_state = $$props => {
    		if ('screen' in $$props) $$invalidate(1, screen = $$props.screen);
    		if ('inputs' in $$props) $$invalidate(2, inputs = $$props.inputs);
    		if ('commandsCache' in $$props) $$invalidate(3, commandsCache = $$props.commandsCache);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, screen, inputs, commandsCache, handleExec, div3_binding];
    }

    class Screen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Screen",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get data() {
    		throw new Error("<Screen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Screen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\landing\terminal\TitleBar.svelte generated by Svelte v3.52.0 */

    const file$f = "src\\components\\landing\\terminal\\TitleBar.svelte";

    function create_fragment$f(ctx) {
    	let div1;
    	let span;
    	let t0_value = /*data*/ ctx[0].user + "";
    	let t0;
    	let t1;
    	let t2_value = /*data*/ ctx[0].cwd + "";
    	let t2;
    	let t3;
    	let div0;
    	let svg0;
    	let rect0;
    	let t4;
    	let svg1;
    	let rect1;
    	let rect2;
    	let rect3;
    	let rect4;
    	let t5;
    	let svg2;
    	let path;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			rect0 = svg_element("rect");
    			t4 = space();
    			svg1 = svg_element("svg");
    			rect1 = svg_element("rect");
    			rect2 = svg_element("rect");
    			rect3 = svg_element("rect");
    			rect4 = svg_element("rect");
    			t5 = space();
    			svg2 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(span, "class", "titleBarText svelte-xuv39y");
    			add_location(span, file$f, 5, 4, 73);
    			attr_dev(rect0, "x", "3");
    			attr_dev(rect0, "y", "19");
    			attr_dev(rect0, "width", "18");
    			attr_dev(rect0, "height", "2");
    			add_location(rect0, file$f, 14, 12, 363);
    			attr_dev(svg0, "width", "24");
    			attr_dev(svg0, "height", "24");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "titleBtn svelte-xuv39y");
    			add_location(svg0, file$f, 7, 8, 174);
    			attr_dev(rect1, "x", "3");
    			attr_dev(rect1, "y", "3");
    			attr_dev(rect1, "width", "18");
    			attr_dev(rect1, "height", "2");
    			add_location(rect1, file$f, 23, 12, 621);
    			attr_dev(rect2, "x", "3");
    			attr_dev(rect2, "y", "19");
    			attr_dev(rect2, "width", "18");
    			attr_dev(rect2, "height", "2");
    			add_location(rect2, file$f, 24, 12, 677);
    			attr_dev(rect3, "x", "3");
    			attr_dev(rect3, "y", "11");
    			attr_dev(rect3, "width", "2");
    			attr_dev(rect3, "height", "8");
    			add_location(rect3, file$f, 25, 12, 734);
    			attr_dev(rect4, "x", "19");
    			attr_dev(rect4, "y", "11");
    			attr_dev(rect4, "width", "2");
    			attr_dev(rect4, "height", "8");
    			add_location(rect4, file$f, 26, 12, 790);
    			attr_dev(svg1, "width", "24");
    			attr_dev(svg1, "height", "24");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "titleBtn svelte-xuv39y");
    			add_location(svg1, file$f, 16, 8, 432);
    			attr_dev(path, "d", "M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z");
    			add_location(path, file$f, 29, 12, 915);
    			attr_dev(svg2, "class", "titleBtn svelte-xuv39y");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			add_location(svg2, file$f, 28, 8, 859);
    			attr_dev(div0, "class", "titleBarButtons svelte-xuv39y");
    			add_location(div0, file$f, 6, 4, 135);
    			attr_dev(div1, "class", "titleBar svelte-xuv39y");
    			add_location(div1, file$f, 4, 0, 45);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, rect0);
    			append_dev(div0, t4);
    			append_dev(div0, svg1);
    			append_dev(svg1, rect1);
    			append_dev(svg1, rect2);
    			append_dev(svg1, rect3);
    			append_dev(svg1, rect4);
    			append_dev(div0, t5);
    			append_dev(div0, svg2);
    			append_dev(svg2, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1 && t0_value !== (t0_value = /*data*/ ctx[0].user + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*data*/ 1 && t2_value !== (t2_value = /*data*/ ctx[0].cwd + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TitleBar', slots, []);
    	let { data } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (data === undefined && !('data' in $$props || $$self.$$.bound[$$self.$$.props['data']])) {
    			console.warn("<TitleBar> was created without expected prop 'data'");
    		}
    	});

    	const writable_props = ['data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TitleBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ data });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class TitleBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TitleBar",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get data() {
    		throw new Error("<TitleBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<TitleBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\landing\terminal\Terminal.svelte generated by Svelte v3.52.0 */
    const file$e = "src\\components\\landing\\terminal\\Terminal.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let titlebar;
    	let t;
    	let screen;
    	let updating_data;
    	let current;

    	titlebar = new TitleBar({
    			props: { data: /*data*/ ctx[0] },
    			$$inline: true
    		});

    	function screen_data_binding(value) {
    		/*screen_data_binding*/ ctx[1](value);
    	}

    	let screen_props = {};

    	if (/*data*/ ctx[0] !== void 0) {
    		screen_props.data = /*data*/ ctx[0];
    	}

    	screen = new Screen({ props: screen_props, $$inline: true });
    	binding_callbacks.push(() => bind(screen, 'data', screen_data_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(titlebar.$$.fragment);
    			t = space();
    			create_component(screen.$$.fragment);
    			attr_dev(div, "class", "terminal svelte-1ldeppr");
    			add_location(div, file$e, 10, 0, 205);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(titlebar, div, null);
    			append_dev(div, t);
    			mount_component(screen, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const titlebar_changes = {};
    			if (dirty & /*data*/ 1) titlebar_changes.data = /*data*/ ctx[0];
    			titlebar.$set(titlebar_changes);
    			const screen_changes = {};

    			if (!updating_data && dirty & /*data*/ 1) {
    				updating_data = true;
    				screen_changes.data = /*data*/ ctx[0];
    				add_flush_callback(() => updating_data = false);
    			}

    			screen.$set(screen_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(titlebar.$$.fragment, local);
    			transition_in(screen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(titlebar.$$.fragment, local);
    			transition_out(screen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(titlebar);
    			destroy_component(screen);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Terminal', slots, []);
    	let { data = { user: "root@HT.Dev", cwd: "~/Desktop" } } = $$props;
    	const writable_props = ['data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Terminal> was created with unknown prop '${key}'`);
    	});

    	function screen_data_binding(value) {
    		data = value;
    		$$invalidate(0, data);
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ Screen, TitleBar, data });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, screen_data_binding];
    }

    class Terminal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Terminal",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get data() {
    		throw new Error("<Terminal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Terminal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\landing\Landing.svelte generated by Svelte v3.52.0 */
    const file$d = "src\\components\\landing\\Landing.svelte";

    // (10:0) <Shrinkable on:shrunkEvent {handle} >
    function create_default_slot$3(ctx) {
    	let div;
    	let iconcanvas;
    	let t0;
    	let terminal;
    	let t1;
    	let startbutton;
    	let updating_binder;
    	let current;
    	iconcanvas = new IconCanvas({ $$inline: true });
    	terminal = new Terminal({ $$inline: true });

    	function startbutton_binder_binding(value) {
    		/*startbutton_binder_binding*/ ctx[1](value);
    	}

    	let startbutton_props = {};

    	if (/*handle*/ ctx[0] !== void 0) {
    		startbutton_props.binder = /*handle*/ ctx[0];
    	}

    	startbutton = new StartButton({ props: startbutton_props, $$inline: true });
    	binding_callbacks.push(() => bind(startbutton, 'binder', startbutton_binder_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(iconcanvas.$$.fragment);
    			t0 = space();
    			create_component(terminal.$$.fragment);
    			t1 = space();
    			create_component(startbutton.$$.fragment);
    			attr_dev(div, "class", "landing svelte-8qepmc");
    			add_location(div, file$d, 10, 4, 297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(iconcanvas, div, null);
    			append_dev(div, t0);
    			mount_component(terminal, div, null);
    			append_dev(div, t1);
    			mount_component(startbutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const startbutton_changes = {};

    			if (!updating_binder && dirty & /*handle*/ 1) {
    				updating_binder = true;
    				startbutton_changes.binder = /*handle*/ ctx[0];
    				add_flush_callback(() => updating_binder = false);
    			}

    			startbutton.$set(startbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconcanvas.$$.fragment, local);
    			transition_in(terminal.$$.fragment, local);
    			transition_in(startbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconcanvas.$$.fragment, local);
    			transition_out(terminal.$$.fragment, local);
    			transition_out(startbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(iconcanvas);
    			destroy_component(terminal);
    			destroy_component(startbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(10:0) <Shrinkable on:shrunkEvent {handle} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let shrinkable;
    	let current;

    	shrinkable = new Shrinkable({
    			props: {
    				handle: /*handle*/ ctx[0],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	shrinkable.$on("shrunkEvent", /*shrunkEvent_handler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(shrinkable.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(shrinkable, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const shrinkable_changes = {};
    			if (dirty & /*handle*/ 1) shrinkable_changes.handle = /*handle*/ ctx[0];

    			if (dirty & /*$$scope, handle*/ 9) {
    				shrinkable_changes.$$scope = { dirty, ctx };
    			}

    			shrinkable.$set(shrinkable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(shrinkable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(shrinkable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(shrinkable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Landing', slots, []);
    	let handle;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Landing> was created with unknown prop '${key}'`);
    	});

    	function startbutton_binder_binding(value) {
    		handle = value;
    		$$invalidate(0, handle);
    	}

    	function shrunkEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$capture_state = () => ({
    		Shrinkable,
    		IconCanvas,
    		StartButton,
    		Terminal,
    		handle
    	});

    	$$self.$inject_state = $$props => {
    		if ('handle' in $$props) $$invalidate(0, handle = $$props.handle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handle, startbutton_binder_binding, shrunkEvent_handler];
    }

    class Landing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Landing",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    const experience = [
        {
            name: "Epicor Software Corporation, Bangalore",
            type: "Job",
            year: "2020-12 – Present",
            children: [
                {
                    name: "Product Developer",
                    type: "Role",
                    children: [
                        {
                            name: "Propello",
                            caption: "Cloud based Retail Application",
                            type: "Product",
                            description: `
                        • Worked on multiple modules throughout the application.
                        • Developed custom endpoints using Django Rest framework.
                        • Collaborated with Front-end developers to create production-ready modules.
                        • Proactively discussed enhancements and future-proof solutions.
                        `,
                            skills: [
                                "Python", "Django", "PyTest", "Pylint",
                                "Pep8", "Git", "Jenkins", "Jira"
                            ]
                        },
                        {
                            name: "Epicor Payment Application",
                            caption: "End to End Payment Application",
                            type: "Product",
                            description: `
                        • Coded test-driven multithreaded APIs and fixed multiple bugs.
                        • Worked extensively on EPA integration with Ingenico Pinpads.
                        • Performed Log Analysis on Kibana.
                        • Developed multiple workflows using the SAM principle.
                        • Fixed a critical bug which could’ve bricked multiple Pinpads.
                        `,
                            skills: [
                                "Python", "PyTest", "Pylint", "Pep8",
                                "Git", "Jenkins", "Kibana", "Jira"
                            ]
                        },
                        {
                            name: "AWS Authentication PoC",
                            type: "Product",
                            description: `
                        • Worked on a PoC to expose Backend functionality of Propello as a Rest API.
                        • Handson experience with AWS Cognito and Custom Lambda Authorizer for Oauth2 authentication.
                        • Written Swagger schema for necessary endpoints.
                        `,
                            skills: [
                                "Python", "AWS Cognito", "AWS Lambda"
                            ]
                        }
                    ]
                },
                {
                    name: "Data Science Intern",
                    type: "Role",
                    description: `
                • Collection, cleaning, wrangling, analysis and visualization of Marketing Data as part of ETL pipeline.
                • Actively participated and improved the company’s website experience during the brand refresh project.
                `,
                    skills: [
                        "Python", "SQL", "Pandas", "Tableau", "Asp .NET MVC", "C#",
                        "HTML5", "CSS3", "Bootstrap", "JavaScript", "jQuery", "EPiServer",
                        "Jira", "Git"
                    ]
                }
            ]
        },
        {
            name: "Directorate of Special Projects, DRDO",
            type: "Job",
            year: "2019-01 – 2020-11",
            children: [
                {
                    name: "Python Developer and Research Assistant",
                    type: "Role",
                    description: `
                • Developed data processing software for AIS packets for satellite tracking of ships.
                • Created scripts to test the reliability of captured packet files.
                • Created TCP/IP Interface for Ground Station Communication with Defense Satellites.
                • Researched networking concepts to migrate from Test System – OBC to Cortex – OBC connection chain.
                • Created error reporting script for packet discrepancies, relational patterns, etc. for real-time GPS data from AIS 
                Payload.
                • Mentored 3 interns on regex parsing of AIS packets.
                `,
                    skills: [
                        "Python", "Regular Expression", "Networking - Socket connection",
                        "TCP/IP", "Serial connections", "TKinter", "Pandas", "Numpy",
                        "Matplotlib"
                    ]
                }
            ]
        },
        {
            name: "Hasura Technologies Pvt. Ltd., Bangalore",
            type: "Job",
            year: "2017-12 – 2018-02",
            children: [
                {
                    name: "Frontend Developer (Intern)",
                    type: "Role",
                    description: `
                • Implemented a voting based social media application, election under Hasura's Product Development Fellowship.
                • Lead and managed a team of 10 with regular coordination and planning.
                • Acted as a liaison between the team and the mentor.
                • Found 19 bugs in the company's infrastructure and assisted in fixing them
                `,
                    skills: [
                        "Git", "Hasura Framework", "Python", "Django", "Flask",
                        "ReactJS", "Docker", "Kubernetes", "HTML", "CSS"
                    ]
                }
            ]
        },
        {
            name: "Tata Power Strategic Engineering Division, Bangalore",
            type: "Job",
            year: "2015-11 – 2015-12",
            children: [
                {
                    name: "Microchip Programming Intern",
                    type: "Role",
                    description: `
                • Creation of Automated Sensory Systems on Embedded 8052 Microcontrollers.
                • Guided fellow intern to learn and improve his code.
                • Made final optimizations in the created code.
                `,
                    skills: [
                        "Embedded C", "8052 Microcontroller"
                    ]
                }
            ]
        }
    ];

    /* src\components\experience\Recursor.svelte generated by Svelte v3.52.0 */
    const file$c = "src\\components\\experience\\Recursor.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (25:0) {:else}
    function create_else_block$3(ctx) {
    	let div1;
    	let previous_tag = /*headTag*/ ctx[1];
    	let t2;
    	let div0;
    	let t3;
    	let t4;
    	let t5;
    	let div1_class_value;
    	let div1_data_year_value;
    	let current;
    	validate_dynamic_element(/*headTag*/ ctx[1]);
    	validate_void_dynamic_element(/*headTag*/ ctx[1]);
    	let svelte_element = /*headTag*/ ctx[1] && create_dynamic_element(ctx);
    	let if_block1 = /*node*/ ctx[0].caption && create_if_block_4(ctx);
    	let if_block2 = /*node*/ ctx[0].description && create_if_block_3(ctx);
    	let if_block3 = /*node*/ ctx[0].skills && create_if_block_2(ctx);
    	let if_block4 = /*node*/ ctx[0].children && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (svelte_element) svelte_element.c();
    			t2 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			attr_dev(div0, "class", "contents");
    			add_location(div0, file$c, 32, 8, 860);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`node ${/*node*/ ctx[0].type}`) + " svelte-2xkote"));
    			attr_dev(div1, "data-year", div1_data_year_value = /*node*/ ctx[0].year?.replace(' – ', '\n↓\n'));
    			add_location(div1, file$c, 25, 4, 548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (svelte_element) svelte_element.m(div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t3);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div0, t4);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div0, t5);
    			if (if_block4) if_block4.m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*headTag*/ ctx[1]) {
    				if (!previous_tag) {
    					svelte_element = create_dynamic_element(ctx);
    					svelte_element.c();
    					svelte_element.m(div1, t2);
    				} else if (safe_not_equal(previous_tag, /*headTag*/ ctx[1])) {
    					svelte_element.d(1);
    					validate_dynamic_element(/*headTag*/ ctx[1]);
    					validate_void_dynamic_element(/*headTag*/ ctx[1]);
    					svelte_element = create_dynamic_element(ctx);
    					svelte_element.c();
    					svelte_element.m(div1, t2);
    				} else {
    					svelte_element.p(ctx, dirty);
    				}
    			} else if (previous_tag) {
    				svelte_element.d(1);
    				svelte_element = null;
    			}

    			previous_tag = /*headTag*/ ctx[1];

    			if (/*node*/ ctx[0].caption) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(div0, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*node*/ ctx[0].description) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3(ctx);
    					if_block2.c();
    					if_block2.m(div0, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*node*/ ctx[0].skills) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_2(ctx);
    					if_block3.c();
    					if_block3.m(div0, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*node*/ ctx[0].children) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty & /*node*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_1$2(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div0, null);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*node*/ 1 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`node ${/*node*/ ctx[0].type}`) + " svelte-2xkote"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*node*/ 1 && div1_data_year_value !== (div1_data_year_value = /*node*/ ctx[0].year?.replace(' – ', '\n↓\n'))) {
    				attr_dev(div1, "data-year", div1_data_year_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (svelte_element) svelte_element.d(detaching);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(25:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if Array.isArray(node)}
    function create_if_block$4(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*node*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*node*/ 1) {
    				each_value = /*node*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(21:0) {#if Array.isArray(node)}",
    		ctx
    	});

    	return block;
    }

    // (29:12) {#if node.year}
    function create_if_block_5(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*node*/ ctx[0].year + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("(");
    			t1 = text(t1_value);
    			t2 = text(")");
    			attr_dev(span, "class", "mobile-only svelte-2xkote");
    			add_location(span, file$c, 29, 16, 757);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*node*/ 1 && t1_value !== (t1_value = /*node*/ ctx[0].year + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(29:12) {#if node.year}",
    		ctx
    	});

    	return block;
    }

    // (27:8) <svelte:element this={headTag} class="heading">
    function create_dynamic_element(ctx) {
    	let svelte_element;
    	let t0_value = /*node*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let if_block = /*node*/ ctx[0].year && create_if_block_5(ctx);
    	let svelte_element_levels = [{ class: "heading svelte-2xkote" }];
    	let svelte_element_data = {};

    	for (let i = 0; i < svelte_element_levels.length; i += 1) {
    		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svelte_element = element(/*headTag*/ ctx[1]);
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();

    			if ((/-/).test(/*headTag*/ ctx[1])) {
    				set_custom_element_data_map(svelte_element, svelte_element_data);
    			} else {
    				set_attributes(svelte_element, svelte_element_data);
    			}

    			add_location(svelte_element, file$c, 26, 8, 638);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_element, anchor);
    			append_dev(svelte_element, t0);
    			append_dev(svelte_element, t1);
    			if (if_block) if_block.m(svelte_element, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*node*/ 1 && t0_value !== (t0_value = /*node*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (/*node*/ ctx[0].year) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5(ctx);
    					if_block.c();
    					if_block.m(svelte_element, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			svelte_element_data = get_spread_update(svelte_element_levels, [{ class: "heading svelte-2xkote" }]);

    			if ((/-/).test(/*headTag*/ ctx[1])) {
    				set_custom_element_data_map(svelte_element, svelte_element_data);
    			} else {
    				set_attributes(svelte_element, svelte_element_data);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dynamic_element.name,
    		type: "child_dynamic_element",
    		source: "(27:8) <svelte:element this={headTag} class=\\\"heading\\\">",
    		ctx
    	});

    	return block;
    }

    // (34:12) {#if node.caption}
    function create_if_block_4(ctx) {
    	let blockquote;
    	let t_value = /*node*/ ctx[0].caption + "";
    	let t;

    	const block = {
    		c: function create() {
    			blockquote = element("blockquote");
    			t = text(t_value);
    			attr_dev(blockquote, "class", "caption svelte-2xkote");
    			add_location(blockquote, file$c, 34, 16, 932);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, blockquote, anchor);
    			append_dev(blockquote, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*node*/ 1 && t_value !== (t_value = /*node*/ ctx[0].caption + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(blockquote);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(34:12) {#if node.caption}",
    		ctx
    	});

    	return block;
    }

    // (39:12) {#if node.description}
    function create_if_block_3(ctx) {
    	let pre;
    	let t_value = /*node*/ ctx[0].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			pre = element("pre");
    			t = text(t_value);
    			attr_dev(pre, "class", "description svelte-2xkote");
    			add_location(pre, file$c, 39, 16, 1100);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);
    			append_dev(pre, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*node*/ 1 && t_value !== (t_value = /*node*/ ctx[0].description + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(39:12) {#if node.description}",
    		ctx
    	});

    	return block;
    }

    // (42:12) {#if node.skills}
    function create_if_block_2(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*node*/ ctx[0].skills.join(', ') + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Technologies Used: ");
    			t1 = text(t1_value);
    			attr_dev(p, "class", "skills svelte-2xkote");
    			add_location(p, file$c, 42, 16, 1217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*node*/ 1 && t1_value !== (t1_value = /*node*/ ctx[0].skills.join(', ') + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(42:12) {#if node.skills}",
    		ctx
    	});

    	return block;
    }

    // (47:12) {#if node.children}
    function create_if_block_1$2(ctx) {
    	let details;
    	let summary;
    	let t1;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*node*/ ctx[0].children;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Click for Details";
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(summary, "class", "svelte-2xkote");
    			add_location(summary, file$c, 54, 20, 1692);
    			attr_dev(div, "class", "children svelte-2xkote");
    			add_location(div, file$c, 55, 20, 1750);
    			attr_dev(details, "class", "svelte-2xkote");
    			add_location(details, file$c, 47, 16, 1392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, details, anchor);
    			append_dev(details, summary);
    			append_dev(details, t1);
    			append_dev(details, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(details, "toggle", toggle_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*node*/ 1) {
    				each_value_1 = /*node*/ ctx[0].children;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(details);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(47:12) {#if node.children}",
    		ctx
    	});

    	return block;
    }

    // (57:24) {#each node.children as child}
    function create_each_block_1$1(ctx) {
    	let div;
    	let recursor;
    	let t;
    	let current;

    	recursor = new Recursor({
    			props: { node: /*child*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(recursor.$$.fragment);
    			t = space();
    			add_location(div, file$c, 57, 28, 1858);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(recursor, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const recursor_changes = {};
    			if (dirty & /*node*/ 1) recursor_changes.node = /*child*/ ctx[3];
    			recursor.$set(recursor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(recursor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(recursor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(recursor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(57:24) {#each node.children as child}",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#each node as child}
    function create_each_block$6(ctx) {
    	let recursor;
    	let current;

    	recursor = new Recursor({
    			props: { node: /*child*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(recursor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(recursor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const recursor_changes = {};
    			if (dirty & /*node*/ 1) recursor_changes.node = /*child*/ ctx[3];
    			recursor.$set(recursor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(recursor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(recursor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(recursor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(22:4) {#each node as child}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*node*/ 1) show_if = null;
    		if (show_if == null) show_if = !!Array.isArray(/*node*/ ctx[0]);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const toggle_handler = e => {
    	e.target.querySelector('summary').innerHTML = e.target.open ? 'Click to Close' : 'Click for details';
    };

    function instance$c($$self, $$props, $$invalidate) {
    	let headTag;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Recursor', slots, []);
    	let { node } = $$props;

    	let headingMap = {
    		'Job': 'h2',
    		'Role': 'h3',
    		'Product': 'h4'
    	};

    	onMount(() => {
    		if (window.innerWidth < 641) {
    			document.querySelectorAll('details').forEach(el => {
    				el.open = true;
    			});
    		}
    	});

    	$$self.$$.on_mount.push(function () {
    		if (node === undefined && !('node' in $$props || $$self.$$.bound[$$self.$$.props['node']])) {
    			console.warn("<Recursor> was created without expected prop 'node'");
    		}
    	});

    	const writable_props = ['node'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Recursor> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('node' in $$props) $$invalidate(0, node = $$props.node);
    	};

    	$$self.$capture_state = () => ({ onMount, node, headingMap, headTag });

    	$$self.$inject_state = $$props => {
    		if ('node' in $$props) $$invalidate(0, node = $$props.node);
    		if ('headingMap' in $$props) $$invalidate(2, headingMap = $$props.headingMap);
    		if ('headTag' in $$props) $$invalidate(1, headTag = $$props.headTag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*node*/ 1) {
    			$$invalidate(1, headTag = headingMap[node.type]);
    		}
    	};

    	return [node, headTag];
    }

    class Recursor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { node: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Recursor",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get node() {
    		throw new Error("<Recursor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set node(value) {
    		throw new Error("<Recursor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\experience\Experience.svelte generated by Svelte v3.52.0 */
    const file$b = "src\\components\\experience\\Experience.svelte";

    function create_fragment$b(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let recursor;
    	let current;

    	recursor = new Recursor({
    			props: { node: experience },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Experience";
    			t1 = space();
    			div0 = element("div");
    			create_component(recursor.$$.fragment);
    			attr_dev(h1, "class", "font-effect-anaglyph");
    			add_location(h1, file$b, 6, 4, 163);
    			attr_dev(div0, "class", "contents svelte-tyftmt");
    			add_location(div0, file$b, 9, 4, 233);
    			attr_dev(div1, "class", "container svelte-tyftmt");
    			add_location(div1, file$b, 5, 0, 134);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(recursor, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(recursor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(recursor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(recursor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Experience', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Experience> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ experience, Recursor });
    	return [];
    }

    class Experience extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Experience",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const metadata$2 = [
        {
            name: 'PokeBall-SelfBot-Poketwo-Autocatcher',
            title: 'Pokeball Selfbot',
            description: 'This specific selfbot was designed to automatically catch pokemon spawned on Discord by Poketwo bot. It also offers other utility functions to automate features like trading, releasing, id search, etc. Currently the autocatcher is powered by AI making it possible to autocatch pokemons on multiple bots like PokeTwo, PokeRealm, etc.',
            image_url: '/images/pokeball.png',
            tags: [
                'Python', 'discord.py', 'Asyncio', 'Pytorch', 'Deep CNN',
                'Imagehash', 'Pillow', 'JSON', 'REST API', 'Git', 'SQLite'
            ],
            is_on_github: true
        },
        {
            name: 'HULK-v3',
            title: 'HULK v3',
            description: 'Asynchronous HTTP Botnet for Distributed Denial of Service (DDoS)',
            image_url: '/images/Hulk.gif',
            tags: [
                'Python', 'Aiohttp', 'Asyncio', 'REST API',
                'Electron', 'NextJS', 'Named Pipes', 'Socket', 'Git',
                'Github Actions', 'CI/CD'
            ],
            is_on_github: true
        },
        {
            name: 'PokeGambler',
            title: 'PokéGambler',
            description: 'The PokeGambler Discord Bot uses pokemon themed playing cards for a fun gambling match.\nIt has a dedicated currency, profile system and other minigames.\nEarned pokechips can be cross-traded.',
            image_url: '/images/pokegambler.png',
            tags: [
                'Python', 'Aiohttp', 'Asyncio', 'Discord.py',
                'Google K8s Engine', 'Github Actions', 'PIL',
                'Git', 'MongoDB', 'Dataclasses', 'NextJS',
                'REST API', 'CI/CD'
            ],
            is_on_github: true
        },
        {
            name: 'vssticky',
            title: 'VSSticky',
            description: 'Attach sticky notes on your files, from inside VS Code.',
            image_url: '/images/vssticky.gif',
            tags: [
                'TypeScript', 'VS Code API', 'Git', 'Github Actions'
            ],
            is_on_github: true
        },
        {
            name: 'Electon',
            title: 'Electon',
            description: 'A voting based social networking app made during HPDF. A simple and clean interface which lets users compete is competitions and vote on it. Has support for content ranging from text to audio.',
            image_url: null,
            tags: [
                'Python', 'Django', 'Flask', 'Git', 'ReactJS', 'Javascript', 'HTML5', 
                'CSS3', 'Docker', 'Kubernetes', 'Hasura CLI', 'SQLAlchemy',
                'gunicorn', 'REST API', 'JSON'
            ],
            is_on_github: false
        }
    ];

    /* src\components\Tiltable.svelte generated by Svelte v3.52.0 */

    const file$a = "src\\components\\Tiltable.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (41:8) {#each { length: 9 } as _}
    function create_each_block$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "tracker svelte-1fn60rc");
    			add_location(div, file$a, 41, 12, 1301);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(41:8) {#each { length: 9 } as _}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let each_value = { length: 9 };
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "mouse-position-tracker svelte-1fn60rc");
    			add_location(div0, file$a, 39, 4, 1215);
    			attr_dev(div1, "class", "tilting-card-content svelte-1fn60rc");
    			add_location(div1, file$a, 36, 0, 1134);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div1, t);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*clickCallback*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tiltable', slots, ['default']);

    	const clickCallback = e => {
    		let { x, y } = e;
    		let elems = document.elementsFromPoint(x, y);
    		elems = elems.filter(elem => !elem.classList.contains("tilting-card-content") && !elem.classList.contains("mouse-position-tracker") && !elem.classList.contains("tracker"));

    		elems.sort((a, b) => {
    			if (a.tagName === "BUTTON" || a.tagName === "A" || a.tagName === "INPUT") {
    				return -1;
    			} else if (b.tagName === "BUTTON" || b.tagName === "A" || b.tagName === "INPUT") {
    				return 1;
    			} else {
    				return 0;
    			}
    		});

    		if (elems.length > 0) {
    			/* eslint no-empty: ["error", { allowEmptyCatch: true }] */
    			try {
    				elems[0].click();
    			} catch(e) {
    				
    			}
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tiltable> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ clickCallback });
    	return [clickCallback, $$scope, slots];
    }

    class Tiltable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tiltable",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\projects\GhCard.svelte generated by Svelte v3.52.0 */

    const { Object: Object_1 } = globals;
    const file$9 = "src\\components\\projects\\GhCard.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i][0];
    	child_ctx[17] = list[i][1];
    	return child_ctx;
    }

    // (74:12) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let span;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "No Image for this one...";
    			add_location(span, file$9, 75, 20, 3807);
    			attr_dev(div, "class", "fallback svelte-1o96dc2");
    			add_location(div, file$9, 74, 16, 3763);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(74:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (69:12) {#if card.image_url}
    function create_if_block_1$1(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*card*/ ctx[3].image_url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*card*/ ctx[3].name);
    			attr_dev(img, "class", "svelte-1o96dc2");
    			add_location(img, file$9, 69, 16, 3621);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*card*/ 8 && !src_url_equal(img.src, img_src_value = /*card*/ ctx[3].image_url)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*card*/ 8 && img_alt_value !== (img_alt_value = /*card*/ ctx[3].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(69:12) {#if card.image_url}",
    		ctx
    	});

    	return block;
    }

    // (85:12) {#if display_stats}
    function create_if_block$3(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let p;
    	let each_value = Object.entries(/*stats*/ ctx[4]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "STATS";
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			p = element("p");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "svelte-1o96dc2");
    			add_location(span, file$9, 87, 24, 4234);
    			if (!src_url_equal(img.src, img_src_value = "/icons/github.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "github icon");
    			attr_dev(img, "class", "svelte-1o96dc2");
    			add_location(img, file$9, 88, 24, 4278);
    			attr_dev(div0, "class", "svelte-1o96dc2");
    			add_location(div0, file$9, 86, 20, 4203);
    			attr_dev(p, "class", "stats svelte-1o96dc2");
    			add_location(p, file$9, 90, 20, 4377);
    			attr_dev(div1, "class", "statsHolder svelte-1o96dc2");
    			add_location(div1, file$9, 85, 16, 4156);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			append_dev(div0, img);
    			append_dev(div1, t2);
    			append_dev(div1, p);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(p, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, stats*/ 16) {
    				each_value = Object.entries(/*stats*/ ctx[4]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(p, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(85:12) {#if display_stats}",
    		ctx
    	});

    	return block;
    }

    // (92:24) {#each Object.entries(stats) as [key, value]}
    function create_each_block$4(ctx) {
    	let span4;
    	let span2;
    	let span0;
    	let raw_value = /*value*/ ctx[17].icon + "";
    	let t0;
    	let span1;
    	let t1_value = /*key*/ ctx[16].toUpperCase() + "";
    	let t1;
    	let t2;
    	let span3;
    	let t3_value = /*value*/ ctx[17].count + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			span4 = element("span");
    			span2 = element("span");
    			span0 = element("span");
    			t0 = space();
    			span1 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			span3 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(span0, "class", "svelte-1o96dc2");
    			add_location(span0, file$9, 94, 36, 4614);
    			attr_dev(span1, "class", "svelte-1o96dc2");
    			add_location(span1, file$9, 95, 36, 4683);
    			attr_dev(span2, "class", "statKey svelte-1o96dc2");
    			add_location(span2, file$9, 93, 32, 4554);
    			attr_dev(span3, "class", "statValue svelte-1o96dc2");
    			add_location(span3, file$9, 97, 32, 4790);
    			attr_dev(span4, "class", "stat " + /*key*/ ctx[16] + " svelte-1o96dc2");
    			add_location(span4, file$9, 92, 28, 4495);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span4, anchor);
    			append_dev(span4, span2);
    			append_dev(span2, span0);
    			span0.innerHTML = raw_value;
    			append_dev(span2, t0);
    			append_dev(span2, span1);
    			append_dev(span1, t1);
    			append_dev(span4, t2);
    			append_dev(span4, span3);
    			append_dev(span3, t3);
    			append_dev(span4, t4);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(92:24) {#each Object.entries(stats) as [key, value]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let h2;
    	let a;
    	let t0_value = /*card*/ ctx[3].title + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let div1;
    	let t2;
    	let pre;
    	let t3_value = /*card*/ ctx[3].description + "";
    	let t3;
    	let t4;
    	let p;
    	let t5;
    	let t6_value = /*card*/ ctx[3].tags.join(', ') + "";
    	let t6;
    	let t7;

    	function select_block_type(ctx, dirty) {
    		if (/*card*/ ctx[3].image_url) return create_if_block_1$1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*display_stats*/ ctx[2] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			if_block0.c();
    			t2 = space();
    			pre = element("pre");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			t5 = text("Technologies Used: ");
    			t6 = text(t6_value);
    			t7 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(a, "href", a_href_value = /*card*/ ctx[3].html_url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "class", "svelte-1o96dc2");
    			add_location(a, file$9, 58, 16, 3299);
    			attr_dev(h2, "class", "title svelte-1o96dc2");
    			add_location(h2, file$9, 57, 12, 3263);
    			attr_dev(div0, "class", "titleHolder svelte-1o96dc2");
    			add_location(div0, file$9, 56, 8, 3224);
    			attr_dev(pre, "class", "description svelte-1o96dc2");
    			add_location(pre, file$9, 80, 12, 3949);
    			attr_dev(p, "class", "tags svelte-1o96dc2");
    			add_location(p, file$9, 81, 12, 4012);
    			attr_dev(div1, "class", "cardBody svelte-1o96dc2");
    			add_location(div1, file$9, 67, 8, 3547);
    			attr_dev(div2, "class", "ghCard svelte-1o96dc2");
    			set_style(div2, "transform", "translateX(" + 2 * Math.pow(-1, /*odd_or_even*/ ctx[0]) + "0vw)");
    			toggle_class(div2, "clearTX", /*inview*/ ctx[1]);
    			add_location(div2, file$9, 51, 4, 3071);
    			attr_dev(div3, "class", "shrinker svelte-1o96dc2");
    			set_style(div3, "transform", "scaleY(0)");
    			toggle_class(div3, "clearTX", /*inview*/ ctx[1]);
    			add_location(div3, file$9, 46, 0, 2973);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h2);
    			append_dev(h2, a);
    			append_dev(a, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			if_block0.m(div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, pre);
    			append_dev(pre, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p);
    			append_dev(p, t5);
    			append_dev(p, t6);
    			append_dev(div1, t7);
    			if (if_block1) if_block1.m(div1, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*card*/ 8 && t0_value !== (t0_value = /*card*/ ctx[3].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*card*/ 8 && a_href_value !== (a_href_value = /*card*/ ctx[3].html_url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, t2);
    				}
    			}

    			if (dirty & /*card*/ 8 && t3_value !== (t3_value = /*card*/ ctx[3].description + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*card*/ 8 && t6_value !== (t6_value = /*card*/ ctx[3].tags.join(', ') + "")) set_data_dev(t6, t6_value);

    			if (/*display_stats*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*odd_or_even*/ 1) {
    				set_style(div2, "transform", "translateX(" + 2 * Math.pow(-1, /*odd_or_even*/ ctx[0]) + "0vw)");
    			}

    			if (dirty & /*inview*/ 2) {
    				toggle_class(div2, "clearTX", /*inview*/ ctx[1]);
    			}

    			if (dirty & /*inview*/ 2) {
    				toggle_class(div3, "clearTX", /*inview*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let card;
    	let all_stats_present;
    	let non_zero_stats;
    	let display_stats;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GhCard', slots, []);
    	let { name, title, description, image_url, tags } = $$props;
    	let { html_url = undefined } = $$props;
    	let { watchers_count = undefined } = $$props;
    	let { stargazers_count = undefined } = $$props;
    	let { forks_count = undefined } = $$props;
    	let { odd_or_even = undefined } = $$props;
    	let { inview = false } = $$props;

    	let stats = {
    		watchers: {
    			count: watchers_count,
    			icon: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                    <path fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>`
    		},
    		stars: {
    			count: stargazers_count,
    			icon: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                    <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                </svg>`
    		},
    		forks: {
    			count: forks_count,
    			icon: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                    <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                </svg>`
    		}
    	};

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<GhCard> was created without expected prop 'name'");
    		}

    		if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
    			console.warn("<GhCard> was created without expected prop 'title'");
    		}

    		if (description === undefined && !('description' in $$props || $$self.$$.bound[$$self.$$.props['description']])) {
    			console.warn("<GhCard> was created without expected prop 'description'");
    		}

    		if (image_url === undefined && !('image_url' in $$props || $$self.$$.bound[$$self.$$.props['image_url']])) {
    			console.warn("<GhCard> was created without expected prop 'image_url'");
    		}

    		if (tags === undefined && !('tags' in $$props || $$self.$$.bound[$$self.$$.props['tags']])) {
    			console.warn("<GhCard> was created without expected prop 'tags'");
    		}
    	});

    	const writable_props = [
    		'name',
    		'title',
    		'description',
    		'image_url',
    		'tags',
    		'html_url',
    		'watchers_count',
    		'stargazers_count',
    		'forks_count',
    		'odd_or_even',
    		'inview'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GhCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    		if ('title' in $$props) $$invalidate(6, title = $$props.title);
    		if ('description' in $$props) $$invalidate(7, description = $$props.description);
    		if ('image_url' in $$props) $$invalidate(8, image_url = $$props.image_url);
    		if ('tags' in $$props) $$invalidate(9, tags = $$props.tags);
    		if ('html_url' in $$props) $$invalidate(10, html_url = $$props.html_url);
    		if ('watchers_count' in $$props) $$invalidate(11, watchers_count = $$props.watchers_count);
    		if ('stargazers_count' in $$props) $$invalidate(12, stargazers_count = $$props.stargazers_count);
    		if ('forks_count' in $$props) $$invalidate(13, forks_count = $$props.forks_count);
    		if ('odd_or_even' in $$props) $$invalidate(0, odd_or_even = $$props.odd_or_even);
    		if ('inview' in $$props) $$invalidate(1, inview = $$props.inview);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		title,
    		description,
    		image_url,
    		tags,
    		html_url,
    		watchers_count,
    		stargazers_count,
    		forks_count,
    		odd_or_even,
    		inview,
    		stats,
    		non_zero_stats,
    		all_stats_present,
    		display_stats,
    		card
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    		if ('title' in $$props) $$invalidate(6, title = $$props.title);
    		if ('description' in $$props) $$invalidate(7, description = $$props.description);
    		if ('image_url' in $$props) $$invalidate(8, image_url = $$props.image_url);
    		if ('tags' in $$props) $$invalidate(9, tags = $$props.tags);
    		if ('html_url' in $$props) $$invalidate(10, html_url = $$props.html_url);
    		if ('watchers_count' in $$props) $$invalidate(11, watchers_count = $$props.watchers_count);
    		if ('stargazers_count' in $$props) $$invalidate(12, stargazers_count = $$props.stargazers_count);
    		if ('forks_count' in $$props) $$invalidate(13, forks_count = $$props.forks_count);
    		if ('odd_or_even' in $$props) $$invalidate(0, odd_or_even = $$props.odd_or_even);
    		if ('inview' in $$props) $$invalidate(1, inview = $$props.inview);
    		if ('stats' in $$props) $$invalidate(4, stats = $$props.stats);
    		if ('non_zero_stats' in $$props) $$invalidate(14, non_zero_stats = $$props.non_zero_stats);
    		if ('all_stats_present' in $$props) $$invalidate(15, all_stats_present = $$props.all_stats_present);
    		if ('display_stats' in $$props) $$invalidate(2, display_stats = $$props.display_stats);
    		if ('card' in $$props) $$invalidate(3, card = $$props.card);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name, title, description, html_url, image_url, tags, watchers_count, stargazers_count, forks_count*/ 16352) {
    			$$invalidate(3, card = {
    				name,
    				title,
    				description,
    				html_url,
    				image_url,
    				tags,
    				watchers_count,
    				stargazers_count,
    				forks_count
    			});
    		}

    		if ($$self.$$.dirty & /*all_stats_present, non_zero_stats*/ 49152) {
    			$$invalidate(2, display_stats = all_stats_present && non_zero_stats);
    		}
    	};

    	$$invalidate(15, all_stats_present = Object.values(stats).every(stat => stat.count !== undefined));
    	$$invalidate(14, non_zero_stats = Object.values(stats).reduce((a, b) => a + b.count, 0) > 0);

    	return [
    		odd_or_even,
    		inview,
    		display_stats,
    		card,
    		stats,
    		name,
    		title,
    		description,
    		image_url,
    		tags,
    		html_url,
    		watchers_count,
    		stargazers_count,
    		forks_count,
    		non_zero_stats,
    		all_stats_present
    	];
    }

    class GhCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			name: 5,
    			title: 6,
    			description: 7,
    			image_url: 8,
    			tags: 9,
    			html_url: 10,
    			watchers_count: 11,
    			stargazers_count: 12,
    			forks_count: 13,
    			odd_or_even: 0,
    			inview: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GhCard",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get name() {
    		throw new Error("<GhCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<GhCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<GhCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<GhCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<GhCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<GhCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image_url() {
    		throw new Error("<GhCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image_url(value) {
    		throw new Error("<GhCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tags() {
    		throw new Error("<GhCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tags(value) {
    		throw new Error("<GhCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get html_url() {
    		throw new Error("<GhCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set html_url(value) {
    		throw new Error("<GhCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get watchers_count() {
    		throw new Error("<GhCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set watchers_count(value) {
    		throw new Error("<GhCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stargazers_count() {
    		throw new Error("<GhCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stargazers_count(value) {
    		throw new Error("<GhCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get forks_count() {
    		throw new Error("<GhCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set forks_count(value) {
    		throw new Error("<GhCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get odd_or_even() {
    		throw new Error("<GhCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set odd_or_even(value) {
    		throw new Error("<GhCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inview() {
    		throw new Error("<GhCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inview(value) {
    		throw new Error("<GhCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\projects\GihtubCards.svelte generated by Svelte v3.52.0 */
    const file$8 = "src\\components\\projects\\GihtubCards.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (1:0) <script>      import { writable }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>      import { writable }",
    		ctx
    	});

    	return block;
    }

    // (40:4) {:then repos}
    function create_then_block(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*repos*/ ctx[4];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*card*/ ctx[5].id || /*card*/ ctx[5].name;
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$1(ctx);
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();

    			if (each_1_else) {
    				each_1_else.c();
    			}
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);

    			if (each_1_else) {
    				each_1_else.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*getProjectData, inview*/ 5) {
    				each_value = /*repos*/ ctx[4];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$3, each_1_anchor, get_each_context$3);
    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block$1(ctx);
    					each_1_else.c();
    					each_1_else.m(each_1_anchor.parentNode, each_1_anchor);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    			if (each_1_else) each_1_else.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(40:4) {:then repos}",
    		ctx
    	});

    	return block;
    }

    // (45:8) {:else}
    function create_else_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No projects found...";
    			add_location(p, file$8, 45, 12, 1597);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(45:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:12) <Tiltable>
    function create_default_slot$2(ctx) {
    	let ghcard;
    	let t;
    	let current;

    	const ghcard_spread_levels = [
    		/*card*/ ctx[5],
    		{ odd_or_even: /*idx*/ ctx[7] },
    		{ inview: /*inview*/ ctx[0] }
    	];

    	let ghcard_props = {};

    	for (let i = 0; i < ghcard_spread_levels.length; i += 1) {
    		ghcard_props = assign(ghcard_props, ghcard_spread_levels[i]);
    	}

    	ghcard = new GhCard({ props: ghcard_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(ghcard.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(ghcard, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const ghcard_changes = (dirty & /*getProjectData, inview*/ 5)
    			? get_spread_update(ghcard_spread_levels, [
    					dirty & /*getProjectData*/ 4 && get_spread_object(/*card*/ ctx[5]),
    					dirty & /*getProjectData*/ 4 && { odd_or_even: /*idx*/ ctx[7] },
    					dirty & /*inview*/ 1 && { inview: /*inview*/ ctx[0] }
    				])
    			: {};

    			ghcard.$set(ghcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ghcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ghcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ghcard, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(42:12) <Tiltable>",
    		ctx
    	});

    	return block;
    }

    // (41:8) {#each repos as card, idx (card.id || card.name)}
    function create_each_block$3(key_1, ctx) {
    	let first;
    	let tiltable;
    	let current;

    	tiltable = new Tiltable({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(tiltable.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(tiltable, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const tiltable_changes = {};

    			if (dirty & /*$$scope, inview*/ 257) {
    				tiltable_changes.$$scope = { dirty, ctx };
    			}

    			tiltable.$set(tiltable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tiltable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tiltable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(tiltable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(41:8) {#each repos as card, idx (card.id || card.name)}",
    		ctx
    	});

    	return block;
    }

    // (38:29)           <p>Loading...</p>      {:then repos}
    function create_pending_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading...";
    			add_location(p, file$8, 38, 8, 1358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(38:29)           <p>Loading...</p>      {:then repos}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 4,
    		blocks: [,,,]
    	};

    	handle_promise(/*getProjectData*/ ctx[2](), info);

    	const block = {
    		c: function create() {
    			div = element("div");
    			info.block.c();
    			attr_dev(div, "class", "githubCards svelte-1tg1k89");
    			add_location(div, file$8, 36, 0, 1292);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $projects;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GihtubCards', slots, []);
    	let projects = writable([]);
    	validate_store(projects, 'projects');
    	component_subscribe($$self, projects, value => $$invalidate(3, $projects = value));
    	let { inview = false } = $$props;

    	let getProjectData = async () => {
    		if ($projects.length > 0) {
    			return $projects;
    		}

    		set_store_value(
    			projects,
    			$projects = await Promise.all(metadata$2.map(async data => {
    				let { is_on_github, ...project } = data;

    				if (is_on_github) {
    					let res = await fetch(`https://api.github.com/repos/hyperclaw79/${project.name}`);
    					let data = await res.json();

    					return {
    						...project,
    						...{
    							name: data.name || project.title,
    							description: data.description || project.description,
    							html_url: data.html_url,
    							stargazers_count: data.stargazers_count || 0,
    							watchers_count: data.watchers_count || 0,
    							forks_count: data.forks_count || 0
    						}
    					};
    				} else {
    					return project;
    				}
    			})),
    			$projects
    		);

    		return $projects;
    	};

    	const writable_props = ['inview'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GihtubCards> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('inview' in $$props) $$invalidate(0, inview = $$props.inview);
    	};

    	$$self.$capture_state = () => ({
    		writable,
    		repos: metadata$2,
    		Tiltable,
    		GhCard,
    		projects,
    		inview,
    		getProjectData,
    		$projects
    	});

    	$$self.$inject_state = $$props => {
    		if ('projects' in $$props) $$invalidate(1, projects = $$props.projects);
    		if ('inview' in $$props) $$invalidate(0, inview = $$props.inview);
    		if ('getProjectData' in $$props) $$invalidate(2, getProjectData = $$props.getProjectData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [inview, projects, getProjectData];
    }

    class GihtubCards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { inview: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GihtubCards",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get inview() {
    		throw new Error("<GihtubCards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inview(value) {
    		throw new Error("<GihtubCards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\projects\Projects.svelte generated by Svelte v3.52.0 */
    const file$7 = "src\\components\\projects\\Projects.svelte";

    function create_fragment$7(ctx) {
    	let h1;
    	let t1;
    	let gihtubcards;
    	let current;

    	gihtubcards = new GihtubCards({
    			props: { inview: /*inview*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "MY PROJECTS";
    			t1 = space();
    			create_component(gihtubcards.$$.fragment);
    			attr_dev(h1, "class", "font-effect-anaglyph");
    			add_location(h1, file$7, 5, 0, 102);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(gihtubcards, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const gihtubcards_changes = {};
    			if (dirty & /*inview*/ 1) gihtubcards_changes.inview = /*inview*/ ctx[0];
    			gihtubcards.$set(gihtubcards_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gihtubcards.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gihtubcards.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			destroy_component(gihtubcards, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	let { inview = false } = $$props;
    	const writable_props = ['inview'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('inview' in $$props) $$invalidate(0, inview = $$props.inview);
    	};

    	$$self.$capture_state = () => ({ GihtubCards, inview });

    	$$self.$inject_state = $$props => {
    		if ('inview' in $$props) $$invalidate(0, inview = $$props.inview);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [inview];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { inview: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get inview() {
    		throw new Error("<Projects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inview(value) {
    		throw new Error("<Projects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\components\Progressbar.svelte generated by Svelte v3.52.0 */
    const file$6 = "src\\components\\Progressbar.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "progress-bar__fill svelte-5a8bue");
    			set_style(div0, "max-width", /*$progress*/ ctx[2] - 2 + "%");
    			toggle_class(div0, "animate", /*animate*/ ctx[1]);
    			add_location(div0, file$6, 20, 4, 439);
    			attr_dev(div1, "class", "progress-bar svelte-5a8bue");
    			set_style(div1, "width", /*width*/ ctx[0] + "%");
    			add_location(div1, file$6, 19, 0, 382);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$progress*/ 4) {
    				set_style(div0, "max-width", /*$progress*/ ctx[2] - 2 + "%");
    			}

    			if (dirty & /*animate*/ 2) {
    				toggle_class(div0, "animate", /*animate*/ ctx[1]);
    			}

    			if (dirty & /*width*/ 1) {
    				set_style(div1, "width", /*width*/ ctx[0] + "%");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Progressbar', slots, []);
    	let { width = 100 } = $$props;
    	let { value = 100 } = $$props;
    	let { animate = true } = $$props;
    	let progress = tweened(0, { duration: 500, easing: t => t });
    	validate_store(progress, 'progress');
    	component_subscribe($$self, progress, value => $$invalidate(2, $progress = value));

    	onMount(() => {
    		progress.set(value);
    	});

    	const writable_props = ['width', 'value', 'animate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Progressbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('animate' in $$props) $$invalidate(1, animate = $$props.animate);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		tweened,
    		width,
    		value,
    		animate,
    		progress,
    		$progress
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('animate' in $$props) $$invalidate(1, animate = $$props.animate);
    		if ('progress' in $$props) $$invalidate(3, progress = $$props.progress);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 16) {
    			{
    				progress.set(value);
    			}
    		}
    	};

    	return [width, animate, $progress, progress, value];
    }

    class Progressbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { width: 0, value: 4, animate: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Progressbar",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get width() {
    		throw new Error("<Progressbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Progressbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Progressbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Progressbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animate() {
    		throw new Error("<Progressbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animate(value) {
    		throw new Error("<Progressbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\skills\Skills.svelte generated by Svelte v3.52.0 */
    const file$5 = "src\\components\\skills\\Skills.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (19:24) {#if skill.icon}
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*skill*/ ctx[1].icon)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*skill*/ ctx[1].name);
    			attr_dev(img, "class", "svelte-cf2zu8");
    			add_location(img, file$5, 19, 28, 699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(19:24) {#if skill.icon}",
    		ctx
    	});

    	return block;
    }

    // (16:12) {#each skills['Technical Skills'] as skill}
    function create_each_block_1(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let h3;
    	let t1_value = /*skill*/ ctx[1].name + "";
    	let t1;
    	let t2;
    	let progressbar;
    	let t3;
    	let current;
    	let if_block = /*skill*/ ctx[1].icon && create_if_block_1(ctx);

    	progressbar = new Progressbar({
    			props: {
    				width: 100,
    				value: /*skill*/ ctx[1].confidence
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			create_component(progressbar.$$.fragment);
    			t3 = space();
    			add_location(h3, file$5, 21, 24, 797);
    			attr_dev(div0, "class", "svelte-cf2zu8");
    			add_location(div0, file$5, 17, 20, 622);
    			attr_dev(div1, "class", "skill svelte-cf2zu8");
    			add_location(div1, file$5, 16, 16, 581);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			mount_component(progressbar, div1, null);
    			append_dev(div1, t3);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*skill*/ ctx[1].icon) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_component(progressbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(16:12) {#each skills['Technical Skills'] as skill}",
    		ctx
    	});

    	return block;
    }

    // (36:24) {#if skill.icon}
    function create_if_block$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*skill*/ ctx[1].icon)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*skill*/ ctx[1].name);
    			attr_dev(img, "class", "svelte-cf2zu8");
    			add_location(img, file$5, 36, 28, 1405);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(36:24) {#if skill.icon}",
    		ctx
    	});

    	return block;
    }

    // (33:12) {#each skills['Soft Skills'] as skill}
    function create_each_block$2(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let h3;
    	let t1_value = /*skill*/ ctx[1].name + "";
    	let t1;
    	let t2;
    	let progressbar;
    	let t3;
    	let current;
    	let if_block = /*skill*/ ctx[1].icon && create_if_block$2(ctx);

    	progressbar = new Progressbar({
    			props: {
    				width: 100,
    				value: /*skill*/ ctx[1].confidence
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			create_component(progressbar.$$.fragment);
    			t3 = space();
    			add_location(h3, file$5, 38, 24, 1503);
    			attr_dev(div0, "class", "svelte-cf2zu8");
    			add_location(div0, file$5, 34, 20, 1328);
    			attr_dev(div1, "class", "skill svelte-cf2zu8");
    			add_location(div1, file$5, 33, 16, 1287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			mount_component(progressbar, div1, null);
    			append_dev(div1, t3);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*skill*/ ctx[1].icon) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_component(progressbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(33:12) {#each skills['Soft Skills'] as skill}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div5;
    	let h1;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let h20;
    	let t4;
    	let t5;
    	let div3;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t6;
    	let h21;
    	let t8;
    	let current;
    	let each_value_1 = skills['Technical Skills'];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = skills['Soft Skills'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			h1 = element("h1");
    			h1.textContent = "SKILLS";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Technical Skills";
    			t4 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img1 = element("img");
    			t6 = space();
    			h21 = element("h2");
    			h21.textContent = "Soft Skills";
    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "font-effect-anaglyph");
    			add_location(h1, file$5, 8, 4, 196);
    			if (!src_url_equal(img0.src, img0_src_value = "/icons/technical.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "technical icon");
    			attr_dev(img0, "class", "svelte-cf2zu8");
    			add_location(img0, file$5, 12, 16, 388);
    			attr_dev(h20, "class", "svelte-cf2zu8");
    			add_location(h20, file$5, 13, 16, 461);
    			attr_dev(div0, "class", "title-holder svelte-cf2zu8");
    			add_location(div0, file$5, 11, 12, 344);
    			attr_dev(div1, "class", "skill-category svelte-cf2zu8");
    			toggle_class(div1, "clearTX", /*inview*/ ctx[0]);
    			add_location(div1, file$5, 10, 8, 279);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/soft-skills.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "soft-skills icon");
    			attr_dev(img1, "class", "svelte-cf2zu8");
    			add_location(img1, file$5, 29, 16, 1100);
    			attr_dev(h21, "class", "svelte-cf2zu8");
    			add_location(h21, file$5, 30, 16, 1177);
    			attr_dev(div2, "class", "title-holder svelte-cf2zu8");
    			add_location(div2, file$5, 28, 12, 1056);
    			attr_dev(div3, "class", "skill-category svelte-cf2zu8");
    			toggle_class(div3, "clearTX", /*inview*/ ctx[0]);
    			add_location(div3, file$5, 27, 8, 991);
    			attr_dev(div4, "class", "skill-set svelte-cf2zu8");
    			add_location(div4, file$5, 9, 4, 246);
    			attr_dev(div5, "class", "container");
    			add_location(div5, file$5, 7, 0, 167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, h1);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t2);
    			append_dev(div0, h20);
    			append_dev(div1, t4);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img1);
    			append_dev(div2, t6);
    			append_dev(div2, h21);
    			append_dev(div3, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*skills*/ 0) {
    				each_value_1 = skills['Technical Skills'];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*inview*/ 1) {
    				toggle_class(div1, "clearTX", /*inview*/ ctx[0]);
    			}

    			if (dirty & /*skills*/ 0) {
    				each_value = skills['Soft Skills'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div3, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*inview*/ 1) {
    				toggle_class(div3, "clearTX", /*inview*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skills', slots, []);
    	let { inview = false } = $$props;
    	const writable_props = ['inview'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('inview' in $$props) $$invalidate(0, inview = $$props.inview);
    	};

    	$$self.$capture_state = () => ({ Progressbar, skills, inview });

    	$$self.$inject_state = $$props => {
    		if ('inview' in $$props) $$invalidate(0, inview = $$props.inview);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [inview];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { inview: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get inview() {
    		throw new Error("<Skills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inview(value) {
    		throw new Error("<Skills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\IntersectionObserver.svelte generated by Svelte v3.52.0 */
    const file$4 = "src\\components\\IntersectionObserver.svelte";
    const get_default_slot_changes = dirty => ({ intersecting: dirty & /*intersecting*/ 1 });
    const get_default_slot_context = ctx => ({ intersecting: /*intersecting*/ ctx[0] });

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-1c44y5p");
    			add_location(div, file$4, 55, 0, 1217);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[9](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, intersecting*/ 129)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[9](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IntersectionObserver', slots, ['default']);
    	let { once = false } = $$props;
    	let { top = 0 } = $$props;
    	let { bottom = 0 } = $$props;
    	let { left = 0 } = $$props;
    	let { right = 0 } = $$props;
    	let intersecting = false;
    	let container;

    	onMount(() => {
    		if (typeof IntersectionObserver !== 'undefined') {
    			const rootMargin = `${bottom}px ${left}px ${top}px ${right}px`;

    			const observer = new IntersectionObserver(entries => {
    					$$invalidate(0, intersecting = entries[0].isIntersecting);

    					if (intersecting && once) {
    						observer.unobserve(container);
    					}
    				},
    			{ rootMargin });

    			observer.observe(container);
    			return () => observer.unobserve(container);
    		}

    		function handler() {
    			const bcr = container.getBoundingClientRect();
    			$$invalidate(0, intersecting = bcr.bottom + bottom > 0 && bcr.right + right > 0 && bcr.top - top < window.innerHeight && bcr.left - left < window.innerWidth);

    			if (intersecting && once) {
    				window.removeEventListener('scroll', handler);
    			}
    		}

    		window.addEventListener('scroll', handler);
    		return () => window.removeEventListener('scroll', handler);
    	});

    	const writable_props = ['once', 'top', 'bottom', 'left', 'right'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IntersectionObserver> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(1, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('once' in $$props) $$invalidate(2, once = $$props.once);
    		if ('top' in $$props) $$invalidate(3, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(4, bottom = $$props.bottom);
    		if ('left' in $$props) $$invalidate(5, left = $$props.left);
    		if ('right' in $$props) $$invalidate(6, right = $$props.right);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		once,
    		top,
    		bottom,
    		left,
    		right,
    		intersecting,
    		container
    	});

    	$$self.$inject_state = $$props => {
    		if ('once' in $$props) $$invalidate(2, once = $$props.once);
    		if ('top' in $$props) $$invalidate(3, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(4, bottom = $$props.bottom);
    		if ('left' in $$props) $$invalidate(5, left = $$props.left);
    		if ('right' in $$props) $$invalidate(6, right = $$props.right);
    		if ('intersecting' in $$props) $$invalidate(0, intersecting = $$props.intersecting);
    		if ('container' in $$props) $$invalidate(1, container = $$props.container);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		intersecting,
    		container,
    		once,
    		top,
    		bottom,
    		left,
    		right,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class IntersectionObserver_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			once: 2,
    			top: 3,
    			bottom: 4,
    			left: 5,
    			right: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IntersectionObserver_1",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get once() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bottom() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bottom(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const metadata$1 = [
        {
            name: "Pentesting with Kali",
            type: "Certificate",
            from: {
                name: "Udemy",
                icon: "/icons/achievements/udemy.webp"
            },
            year: "2020",
            image: "/images/pentest.jpg",
        },
        {
            name: "Distinguished Fellow",
            type: "Achievement",
            from: {
                name: "Hasura",
                icon: "/icons/achievements/hasura.svg"
            },
            year: "2017",
            image: "/images/HPDF.jpg"
        },
        {
            name: "City Top 100",
            type: "Achievement",
            from: {
                name: "National Cyber Olympiad",
                icon: "/icons/achievements/nco.png"
            },
            year: "2007",
            image: "/images/nco.png",
            asset_zoomable: false
        },
        {
            name: "Gold Medalist",
            type: "Achievement",
            from: {
                name: "National Science Olympiad",
                icon: "/icons/achievements/nso.png"
            },
            year: "2006",
            image: "/images/nso-gold.png",
            asset_zoomable: false
        }
    ];

    /* src\components\achievements\Listing.svelte generated by Svelte v3.52.0 */

    const file$3 = "src\\components\\achievements\\Listing.svelte";

    // (51:8) {:else}
    function create_else_block(ctx) {
    	let div;
    	let span;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "No Image for this one...";
    			attr_dev(span, "class", "svelte-1k38xt1");
    			add_location(span, file$3, 52, 16, 1638);
    			attr_dev(div, "class", "fallback svelte-1k38xt1");
    			add_location(div, file$3, 51, 12, 1598);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(51:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:8) {#if image}
    function create_if_block$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_title_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*name*/ ctx[0]);
    			attr_dev(img, "class", "asset svelte-1k38xt1");
    			attr_dev(img, "title", img_title_value = /*asset_zoomable*/ ctx[6] ? 'Click to zoom' : '');
    			toggle_class(img, "zoom", /*zoomed*/ ctx[8]);
    			toggle_class(img, "glow", /*asset_zoomable*/ ctx[6] && /*mustClick*/ ctx[10]);
    			add_location(img, file$3, 39, 16, 1172);
    			attr_dev(div, "class", "assetHolder svelte-1k38xt1");
    			add_location(div, file$3, 38, 12, 1129);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			/*img_binding*/ ctx[12](img);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*zoomIn*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*image*/ 32 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[5])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*name*/ 1) {
    				attr_dev(img, "alt", /*name*/ ctx[0]);
    			}

    			if (dirty & /*asset_zoomable*/ 64 && img_title_value !== (img_title_value = /*asset_zoomable*/ ctx[6] ? 'Click to zoom' : '')) {
    				attr_dev(img, "title", img_title_value);
    			}

    			if (dirty & /*zoomed*/ 256) {
    				toggle_class(img, "zoom", /*zoomed*/ ctx[8]);
    			}

    			if (dirty & /*asset_zoomable, mustClick*/ 1088) {
    				toggle_class(img, "glow", /*asset_zoomable*/ ctx[6] && /*mustClick*/ ctx[10]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*img_binding*/ ctx[12](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(37:8) {#if image}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div5;
    	let div0;
    	let t0;
    	let div1;
    	let h2;
    	let t1_value = (/*type*/ ctx[1] === 'Achievement' ? '🏆' : '📜') + "";
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let div4;
    	let t5;
    	let div3;
    	let div2;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t6;
    	let span0;
    	let t7_value = /*from*/ ctx[2].name + "";
    	let t7;
    	let t8;
    	let span1;
    	let t9;
    	let div5_style_value;

    	function select_block_type(ctx, dirty) {
    		if (/*image*/ ctx[5]) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(/*name*/ ctx[0]);
    			t4 = space();
    			div4 = element("div");
    			if_block.c();
    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img = element("img");
    			t6 = space();
    			span0 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			span1 = element("span");
    			t9 = text(/*year*/ ctx[3]);
    			attr_dev(div0, "class", "svelte-1k38xt1");
    			toggle_class(div0, "backdrop", /*zoomed*/ ctx[8]);
    			add_location(div0, file$3, 29, 4, 822);
    			attr_dev(h2, "class", "title svelte-1k38xt1");
    			add_location(h2, file$3, 31, 8, 894);
    			attr_dev(div1, "class", "titleHolder svelte-1k38xt1");
    			add_location(div1, file$3, 30, 4, 859);
    			if (!src_url_equal(img.src, img_src_value = /*from*/ ctx[2].icon)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*from*/ ctx[2].name);
    			attr_dev(img, "class", "icon svelte-1k38xt1");
    			add_location(img, file$3, 59, 16, 1831);
    			add_location(span0, file$3, 60, 16, 1901);
    			attr_dev(div2, "class", "from svelte-1k38xt1");
    			add_location(div2, file$3, 58, 12, 1795);
    			attr_dev(span1, "class", "mobile-only svelte-1k38xt1");
    			add_location(span1, file$3, 62, 12, 1959);
    			attr_dev(div3, "class", "details svelte-1k38xt1");
    			add_location(div3, file$3, 57, 8, 1760);
    			attr_dev(div4, "class", "content svelte-1k38xt1");
    			add_location(div4, file$3, 35, 4, 1003);
    			attr_dev(div5, "class", "listing svelte-1k38xt1");
    			attr_dev(div5, "data-year", /*year*/ ctx[3]);

    			attr_dev(div5, "style", div5_style_value = !/*inview*/ ctx[7] && /*idx*/ ctx[4] > 0
    			? `transform: translateY(calc((100% + 2vw) * -${/*idx*/ ctx[4]})`
    			: '');

    			add_location(div5, file$3, 24, 0, 673);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div5, t0);
    			append_dev(div5, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t1);
    			append_dev(h2, t2);
    			append_dev(h2, t3);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			if_block.m(div4, null);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img);
    			append_dev(div2, t6);
    			append_dev(div2, span0);
    			append_dev(span0, t7);
    			append_dev(div3, t8);
    			append_dev(div3, span1);
    			append_dev(span1, t9);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*zoomed*/ 256) {
    				toggle_class(div0, "backdrop", /*zoomed*/ ctx[8]);
    			}

    			if (dirty & /*type*/ 2 && t1_value !== (t1_value = (/*type*/ ctx[1] === 'Achievement' ? '🏆' : '📜') + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*name*/ 1) set_data_dev(t3, /*name*/ ctx[0]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div4, t5);
    				}
    			}

    			if (dirty & /*from*/ 4 && !src_url_equal(img.src, img_src_value = /*from*/ ctx[2].icon)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*from*/ 4 && img_alt_value !== (img_alt_value = /*from*/ ctx[2].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*from*/ 4 && t7_value !== (t7_value = /*from*/ ctx[2].name + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*year*/ 8) set_data_dev(t9, /*year*/ ctx[3]);

    			if (dirty & /*year*/ 8) {
    				attr_dev(div5, "data-year", /*year*/ ctx[3]);
    			}

    			if (dirty & /*inview, idx*/ 144 && div5_style_value !== (div5_style_value = !/*inview*/ ctx[7] && /*idx*/ ctx[4] > 0
    			? `transform: translateY(calc((100% + 2vw) * -${/*idx*/ ctx[4]})`
    			: '')) {
    				attr_dev(div5, "style", div5_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Listing', slots, []);
    	let { name, type, from, year, idx } = $$props;
    	let { image = null } = $$props;
    	let { asset_zoomable = true } = $$props;
    	let { inview = false } = $$props;
    	let zoomed = false;
    	let zoomable;
    	let mustClick = true;

    	const zoomIn = () => {
    		if (!asset_zoomable) return;
    		$$invalidate(10, mustClick = false);
    		$$invalidate(8, zoomed = true);
    		zoomable.scrollIntoView({ behavior: 'smooth' });

    		setTimeout(
    			() => {
    				window.addEventListener(
    					'click',
    					e => {
    						if (e.target !== zoomable) {
    							$$invalidate(8, zoomed = false);
    						}
    					},
    					{ once: true }
    				);
    			},
    			500
    		);
    	};

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<Listing> was created without expected prop 'name'");
    		}

    		if (type === undefined && !('type' in $$props || $$self.$$.bound[$$self.$$.props['type']])) {
    			console.warn("<Listing> was created without expected prop 'type'");
    		}

    		if (from === undefined && !('from' in $$props || $$self.$$.bound[$$self.$$.props['from']])) {
    			console.warn("<Listing> was created without expected prop 'from'");
    		}

    		if (year === undefined && !('year' in $$props || $$self.$$.bound[$$self.$$.props['year']])) {
    			console.warn("<Listing> was created without expected prop 'year'");
    		}

    		if (idx === undefined && !('idx' in $$props || $$self.$$.bound[$$self.$$.props['idx']])) {
    			console.warn("<Listing> was created without expected prop 'idx'");
    		}
    	});

    	const writable_props = ['name', 'type', 'from', 'year', 'idx', 'image', 'asset_zoomable', 'inview'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Listing> was created with unknown prop '${key}'`);
    	});

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			zoomable = $$value;
    			$$invalidate(9, zoomable);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    		if ('from' in $$props) $$invalidate(2, from = $$props.from);
    		if ('year' in $$props) $$invalidate(3, year = $$props.year);
    		if ('idx' in $$props) $$invalidate(4, idx = $$props.idx);
    		if ('image' in $$props) $$invalidate(5, image = $$props.image);
    		if ('asset_zoomable' in $$props) $$invalidate(6, asset_zoomable = $$props.asset_zoomable);
    		if ('inview' in $$props) $$invalidate(7, inview = $$props.inview);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		type,
    		from,
    		year,
    		idx,
    		image,
    		asset_zoomable,
    		inview,
    		zoomed,
    		zoomable,
    		mustClick,
    		zoomIn
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    		if ('from' in $$props) $$invalidate(2, from = $$props.from);
    		if ('year' in $$props) $$invalidate(3, year = $$props.year);
    		if ('idx' in $$props) $$invalidate(4, idx = $$props.idx);
    		if ('image' in $$props) $$invalidate(5, image = $$props.image);
    		if ('asset_zoomable' in $$props) $$invalidate(6, asset_zoomable = $$props.asset_zoomable);
    		if ('inview' in $$props) $$invalidate(7, inview = $$props.inview);
    		if ('zoomed' in $$props) $$invalidate(8, zoomed = $$props.zoomed);
    		if ('zoomable' in $$props) $$invalidate(9, zoomable = $$props.zoomable);
    		if ('mustClick' in $$props) $$invalidate(10, mustClick = $$props.mustClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		type,
    		from,
    		year,
    		idx,
    		image,
    		asset_zoomable,
    		inview,
    		zoomed,
    		zoomable,
    		mustClick,
    		zoomIn,
    		img_binding
    	];
    }

    class Listing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			name: 0,
    			type: 1,
    			from: 2,
    			year: 3,
    			idx: 4,
    			image: 5,
    			asset_zoomable: 6,
    			inview: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Listing",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get name() {
    		throw new Error("<Listing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Listing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Listing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Listing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get from() {
    		throw new Error("<Listing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set from(value) {
    		throw new Error("<Listing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get year() {
    		throw new Error("<Listing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set year(value) {
    		throw new Error("<Listing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get idx() {
    		throw new Error("<Listing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idx(value) {
    		throw new Error("<Listing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image() {
    		throw new Error("<Listing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<Listing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get asset_zoomable() {
    		throw new Error("<Listing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set asset_zoomable(value) {
    		throw new Error("<Listing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inview() {
    		throw new Error("<Listing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inview(value) {
    		throw new Error("<Listing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\achievements\Achievements.svelte generated by Svelte v3.52.0 */
    const file$2 = "src\\components\\achievements\\Achievements.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (12:12) {#each metadata as data, idx (data.name)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let listing;
    	let current;
    	const listing_spread_levels = [/*data*/ ctx[1], { idx: /*idx*/ ctx[3] }, { inview: /*intersecting*/ ctx[0] }];
    	let listing_props = {};

    	for (let i = 0; i < listing_spread_levels.length; i += 1) {
    		listing_props = assign(listing_props, listing_spread_levels[i]);
    	}

    	listing = new Listing({ props: listing_props, $$inline: true });

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(listing.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(listing, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const listing_changes = (dirty & /*metadata, intersecting*/ 1)
    			? get_spread_update(listing_spread_levels, [
    					dirty & /*metadata*/ 0 && get_spread_object(/*data*/ ctx[1]),
    					dirty & /*metadata*/ 0 && { idx: /*idx*/ ctx[3] },
    					dirty & /*intersecting*/ 1 && { inview: /*intersecting*/ ctx[0] }
    				])
    			: {};

    			listing.$set(listing_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listing.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listing.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(listing, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(12:12) {#each metadata as data, idx (data.name)}",
    		ctx
    	});

    	return block;
    }

    // (6:0) <IntersectionObserver let:intersecting>
    function create_default_slot$1(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = metadata$1;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*data*/ ctx[1].name;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Achievements & Certificates";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "font-effect-anaglyph");
    			add_location(h1, file$2, 7, 8, 279);
    			attr_dev(div0, "class", "contents svelte-luwxya");
    			add_location(div0, file$2, 10, 8, 378);
    			attr_dev(div1, "class", "container svelte-luwxya");
    			add_location(div1, file$2, 6, 4, 246);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*metadata, intersecting*/ 1) {
    				each_value = metadata$1;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(6:0) <IntersectionObserver let:intersecting>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let intersectionobserver;
    	let current;

    	intersectionobserver = new IntersectionObserver_1({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot$1,
    						({ intersecting }) => ({ 0: intersecting }),
    						({ intersecting }) => intersecting ? 1 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(intersectionobserver.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(intersectionobserver, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const intersectionobserver_changes = {};

    			if (dirty & /*$$scope, intersecting*/ 17) {
    				intersectionobserver_changes.$$scope = { dirty, ctx };
    			}

    			intersectionobserver.$set(intersectionobserver_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(intersectionobserver.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(intersectionobserver.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(intersectionobserver, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Achievements', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Achievements> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ IntersectionObserver: IntersectionObserver_1, metadata: metadata$1, Listing });
    	return [];
    }

    class Achievements extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Achievements",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const metadata = [
        {
            name: "Github",
            url: "https://github.com/hyperclaw79",
            icon: "/icons/github.png"
        },
        {
            name: "Linkedin",
            url: "https://linkedin.com/in/harshith-thota-749851154",
            icon: "/icons/linkedin.png"
        },
        {
            name: "Gmail",
            url: "mailto:harshith.thota7@gmail.com",
            icon: "/icons/gmail.webp"
        }
    ];

    /* src\components\Footer.svelte generated by Svelte v3.52.0 */
    const file$1 = "src\\components\\Footer.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (9:12) {#each metadata as social (social.name)}
    function create_each_block(key_1, ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let t0;
    	let span;
    	let t1_value = /*social*/ ctx[0].name + "";
    	let t1;
    	let t2;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(img, "class", "icon svelte-1ifegef");
    			if (!src_url_equal(img.src, img_src_value = /*social*/ ctx[0].icon)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*social*/ ctx[0].name);
    			attr_dev(img, "title", /*social*/ ctx[0].name);
    			add_location(img, file$1, 15, 20, 417);
    			attr_dev(span, "class", "social-name svelte-1ifegef");
    			add_location(span, file$1, 21, 20, 636);
    			attr_dev(a, "href", /*social*/ ctx[0].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "class", "social svelte-1ifegef");
    			add_location(a, file$1, 9, 16, 215);
    			this.first = a;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    			append_dev(a, t0);
    			append_dev(a, span);
    			append_dev(span, t1);
    			append_dev(a, t2);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(9:12) {#each metadata as social (social.name)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let footer;
    	let div2;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t0;
    	let div1;
    	let span0;
    	let t2;
    	let span1;
    	let each_value = metadata;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*social*/ ctx[0].name;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "© Harshith Thota";
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = "2022";
    			attr_dev(div0, "class", "socials svelte-1ifegef");
    			add_location(div0, file$1, 7, 8, 122);
    			attr_dev(span0, "class", "svelte-1ifegef");
    			add_location(span0, file$1, 26, 12, 788);
    			attr_dev(span1, "class", "svelte-1ifegef");
    			add_location(span1, file$1, 27, 12, 832);
    			attr_dev(div1, "class", "copyright svelte-1ifegef");
    			add_location(div1, file$1, 25, 8, 751);
    			attr_dev(div2, "class", "content svelte-1ifegef");
    			add_location(div2, file$1, 6, 4, 91);
    			attr_dev(footer, "class", "svelte-1ifegef");
    			add_location(footer, file$1, 5, 0, 77);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div2);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t2);
    			append_dev(div1, span1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*metadata*/ 0) {
    				each_value = metadata;
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ metadata });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.52.0 */
    const file = "src\\App.svelte";

    // (25:1) {#if window.innerWidth > 800 && !('ontouchstart' in window)}
    function create_if_block(ctx) {
    	let section;
    	let landing_1;
    	let current;
    	landing_1 = new Landing({ $$inline: true });
    	landing_1.$on("shrunkEvent", /*launch*/ ctx[1]);

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(landing_1.$$.fragment);
    			attr_dev(section, "id", "landing");
    			add_location(section, file, 25, 2, 842);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(landing_1, section, null);
    			/*section_binding*/ ctx[2](section);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(landing_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(landing_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(landing_1);
    			/*section_binding*/ ctx[2](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(25:1) {#if window.innerWidth > 800 && !('ontouchstart' in window)}",
    		ctx
    	});

    	return block;
    }

    // (34:2) <IntersectionObserver let:intersecting >
    function create_default_slot_1(ctx) {
    	let project;
    	let current;

    	project = new Projects({
    			props: { inview: /*intersecting*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(project.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(project, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const project_changes = {};
    			if (dirty & /*intersecting*/ 8) project_changes.inview = /*intersecting*/ ctx[3];
    			project.$set(project_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(project.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(project.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(project, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(34:2) <IntersectionObserver let:intersecting >",
    		ctx
    	});

    	return block;
    }

    // (39:2) <IntersectionObserver let:intersecting >
    function create_default_slot(ctx) {
    	let skills;
    	let current;

    	skills = new Skills({
    			props: { inview: /*intersecting*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(skills.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(skills, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const skills_changes = {};
    			if (dirty & /*intersecting*/ 8) skills_changes.inview = /*intersecting*/ ctx[3];
    			skills.$set(skills_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skills.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skills.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(skills, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(39:2) <IntersectionObserver let:intersecting >",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let t0;
    	let section0;
    	let experience;
    	let t1;
    	let section1;
    	let intersectionobserver0;
    	let t2;
    	let section2;
    	let intersectionobserver1;
    	let t3;
    	let section3;
    	let achievements;
    	let t4;
    	let footer;
    	let current;
    	let if_block = window.innerWidth > 800 && !('ontouchstart' in window) && create_if_block(ctx);
    	experience = new Experience({ $$inline: true });

    	intersectionobserver0 = new IntersectionObserver_1({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot_1,
    						({ intersecting }) => ({ 3: intersecting }),
    						({ intersecting }) => intersecting ? 8 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	intersectionobserver1 = new IntersectionObserver_1({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ intersecting }) => ({ 3: intersecting }),
    						({ intersecting }) => intersecting ? 8 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	achievements = new Achievements({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			t0 = space();
    			section0 = element("section");
    			create_component(experience.$$.fragment);
    			t1 = space();
    			section1 = element("section");
    			create_component(intersectionobserver0.$$.fragment);
    			t2 = space();
    			section2 = element("section");
    			create_component(intersectionobserver1.$$.fragment);
    			t3 = space();
    			section3 = element("section");
    			create_component(achievements.$$.fragment);
    			t4 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(section0, "id", "experience");
    			add_location(section0, file, 29, 1, 949);
    			attr_dev(section1, "id", "projects");
    			add_location(section1, file, 32, 1, 1008);
    			attr_dev(section2, "id", "skills");
    			add_location(section2, file, 37, 1, 1156);
    			attr_dev(section3, "id", "achievements");
    			add_location(section3, file, 42, 1, 1301);
    			attr_dev(main, "class", "svelte-yoigby");
    			add_location(main, file, 23, 0, 769);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t0);
    			append_dev(main, section0);
    			mount_component(experience, section0, null);
    			append_dev(main, t1);
    			append_dev(main, section1);
    			mount_component(intersectionobserver0, section1, null);
    			append_dev(main, t2);
    			append_dev(main, section2);
    			mount_component(intersectionobserver1, section2, null);
    			append_dev(main, t3);
    			append_dev(main, section3);
    			mount_component(achievements, section3, null);
    			append_dev(main, t4);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (window.innerWidth > 800 && !('ontouchstart' in window)) if_block.p(ctx, dirty);
    			const intersectionobserver0_changes = {};

    			if (dirty & /*$$scope, intersecting*/ 24) {
    				intersectionobserver0_changes.$$scope = { dirty, ctx };
    			}

    			intersectionobserver0.$set(intersectionobserver0_changes);
    			const intersectionobserver1_changes = {};

    			if (dirty & /*$$scope, intersecting*/ 24) {
    				intersectionobserver1_changes.$$scope = { dirty, ctx };
    			}

    			intersectionobserver1.$set(intersectionobserver1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(experience.$$.fragment, local);
    			transition_in(intersectionobserver0.$$.fragment, local);
    			transition_in(intersectionobserver1.$$.fragment, local);
    			transition_in(achievements.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(experience.$$.fragment, local);
    			transition_out(intersectionobserver0.$$.fragment, local);
    			transition_out(intersectionobserver1.$$.fragment, local);
    			transition_out(achievements.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			destroy_component(experience);
    			destroy_component(intersectionobserver0);
    			destroy_component(intersectionobserver1);
    			destroy_component(achievements);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let landing;

    	const launch = () => {
    		document.querySelector('body').style.overflow = "auto";
    		$$invalidate(0, landing.style.marginBottom = "0px", landing);
    	};

    	onMount(() => {
    		history.scrollRestoration = 'manual';
    		location.href = "#landing";
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function section_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			landing = $$value;
    			$$invalidate(0, landing);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Landing,
    		Experience,
    		Project: Projects,
    		Skills,
    		Achievements,
    		IntersectionObserver: IntersectionObserver_1,
    		Footer,
    		onMount,
    		landing,
    		launch
    	});

    	$$self.$inject_state = $$props => {
    		if ('landing' in $$props) $$invalidate(0, landing = $$props.landing);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [landing, launch, section_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
