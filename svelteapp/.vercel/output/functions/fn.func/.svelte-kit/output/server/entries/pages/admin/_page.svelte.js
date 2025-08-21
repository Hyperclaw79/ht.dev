import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
const LoginForm_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: '.heading.svelte-10wt6ts.svelte-10wt6ts{text-align:center;font-weight:700;color:#b3b3b3}.login-form.svelte-10wt6ts.svelte-10wt6ts{position:fixed;left:50%;transform:translate(-50%, 25%);width:60vw;background-color:#1f1f1f;color:#fff;border-radius:10px;box-shadow:0 0 10px rgba(0, 0, 0, 0.3);display:flex;flex-direction:column;align-items:center;padding:1rem;padding-top:0.5rem}.login-form.svelte-10wt6ts h2.svelte-10wt6ts::after{display:none;content:attr(data-short-text);position:absolute;top:10%;left:0;right:0;bottom:0;width:60vw;margin:auto;pointer-events:none}.login-form.svelte-10wt6ts input[type="text"].svelte-10wt6ts,.login-form.svelte-10wt6ts input[type="password"].svelte-10wt6ts{width:100%;padding:10px;margin-bottom:20px;border-radius:5px;border:none;background-color:#333;color:#fff;font-size:16px}p.error.svelte-10wt6ts.svelte-10wt6ts{color:#ff0000;font-size:14px;margin:0;margin-bottom:20px;display:none}p.error.show.svelte-10wt6ts.svelte-10wt6ts{display:block}.login-form.svelte-10wt6ts button[type="submit"].svelte-10wt6ts{width:100%;padding:10px;border-radius:5px;border:none;background-color:var(--theme-primary);color:#fff;font-size:16px;cursor:pointer}.login-form.svelte-10wt6ts button[type="submit"].svelte-10wt6ts:hover{filter:brightness(1.1)}@media screen and (max-width: 640px){.login-form.svelte-10wt6ts h2.svelte-10wt6ts{color:transparent}.login-form.svelte-10wt6ts h2.svelte-10wt6ts::after{display:block;color:#fff}}',
  map: null
};
const LoginForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div class="container"><form class="login-form svelte-10wt6ts"><h2 class="heading svelte-10wt6ts" data-short-text="Login" data-svelte-h="svelte-18g1vn3">Please Login to Continue</h2> <input type="text" name="username" placeholder="Username" class="svelte-10wt6ts"> <input type="password" name="password" placeholder="Password" class="svelte-10wt6ts"> <p class="${["error svelte-10wt6ts", ""].join(" ").trim()}" data-svelte-h="svelte-7mgo6a">Invalid Credentials</p> <button type="submit" class="svelte-10wt6ts" data-svelte-h="svelte-17x1dyk">LOGIN</button></form> </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".container.svelte-1sz4mmu{margin:0 auto;padding:1rem;height:100vh;text-transform:uppercase}.heading.svelte-1sz4mmu{text-align:center;font-weight:700;color:#b3b3b3}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<h1 class="heading svelte-1sz4mmu" data-svelte-h="svelte-1t5ln6t">Admin Console</h1> <div class="container svelte-1sz4mmu">${validate_component(LoginForm, "LoginForm").$$render($$result, {}, {}, {})} </div>`;
});
export {
  Page as default
};
