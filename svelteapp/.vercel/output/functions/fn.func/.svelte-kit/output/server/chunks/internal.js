import { c as create_ssr_component, b as setContext, v as validate_component, m as missing_component } from "./ssr.js";
import "./private.js";
let base = "";
let assets = base;
const initial = { base, assets };
function reset() {
  base = initial.base;
  assets = initial.assets;
}
function set_assets(path) {
  assets = initial.assets = path;
}
function afterUpdate() {
}
function set_building() {
}
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { constructors } = $$props;
  let { components = [] } = $$props;
  let { form } = $$props;
  let { data_0 = null } = $$props;
  let { data_1 = null } = $$props;
  {
    setContext("__svelte__", stores);
  }
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.constructors === void 0 && $$bindings.constructors && constructors !== void 0)
    $$bindings.constructors(constructors);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.data_0 === void 0 && $$bindings.data_0 && data_0 !== void 0)
    $$bindings.data_0(data_0);
  if ($$props.data_1 === void 0 && $$bindings.data_1 && data_1 !== void 0)
    $$bindings.data_1(data_1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      stores.page.set(page);
    }
    $$rendered = `  ${constructors[1] ? `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      { data: data_0, this: components[0] },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(constructors[1] || missing_component, "svelte:component").$$render(
            $$result,
            { data: data_1, form, this: components[1] },
            {
              this: ($$value) => {
                components[1] = $$value;
                $$settled = false;
              }
            },
            {}
          )}`;
        }
      }
    )}` : `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      { data: data_0, form, this: components[0] },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {}
    )}`} ${``}`;
  } while (!$$settled);
  return $$rendered;
});
const options = {
  app_template_contains_nonce: false,
  csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false }, "reportOnly": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
  csrf_check_origin: true,
  track_server_fetches: false,
  embedded: false,
  env_public_prefix: "PUBLIC_",
  env_private_prefix: "",
  hooks: null,
  // added lazily, via `get_hooks`
  preload_strategy: "modulepreload",
  root: Root,
  service_worker: false,
  templates: {
    app: ({ head, body, assets: assets2, nonce, env }) => `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset='utf-8'>
		<meta name='viewport' content='width=device-width,initial-scale=1'>
		<meta name="title" content="Harshith Thota's Developer Portfolio">
		<meta name="description" content="An interactive and responsive dark themed Developer Portfolio for HT, created from scratch using Sveltekit and Pocketbase.">
		<meta name="author" content="Harshith Thota">
		
		<meta property="og:title" content="Harshith Thota's Developer Portfolio">
		<meta property="og:description" content="An interactive and responsive dark themed Developer Portfolio for HT, created from scratch using Sveltekit and Pocketbase.">
		<meta property="og:url" content="https://ht-dev.vercel.app/">
		<meta property="og:image" content="https://raw.githubusercontent.com/Hyperclaw79/ht.dev/main/assets/Terminal.png">
		<meta property="og:type" content="website">
		
		<meta name="twitter:title" content="Harshith Thota's Developer Portfolio">
		<meta name="twitter:description" content="Harshith Thota's Developer Portfolio">
		<meta property="twitter:url" content="https://ht-dev.vercel.app/">
		<meta name="twitter:image" content="https://raw.githubusercontent.com/Hyperclaw79/ht.dev/main/assets/Terminal.png">
		<meta name="twitter:card" content="summary_large_image">

		<title>Harshith Thota's Developer Portfolio</title>

		<link rel="icon" type="image/png" sizes="512x512" href="/favicons/favicon_512.png">
		<link rel="icon" type="image/png" sizes="256x256" href="/favicons/favicon_256.png">
		<link rel="icon" type="image/png" sizes="128x128" href="/favicons/favicon_128.png">
		<link rel="icon" type="image/png" sizes="64x64" href="/favicons/favicon_64.png">
		<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon_32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon_16.png">
		<link rel='stylesheet' href='/global.css'>
		<link rel='stylesheet' href='/build/bundle.css'>
		<link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=M+PLUS+1+Code:wght@700&display=swap" crossOrigin="anonymous">
		<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Exo:Black&effect=anaglyph&display=swap' crossOrigin="anonymous">

		` + head + '\n	</head>\n\n	<body data-sveltekit-preload-data="hover">\n		<div style="display: contents">' + body + "</div>\n	</body>\n</html>\n",
    error: ({ status, message }) => '<!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<title>' + message + `</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family:
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					Oxygen,
					Ubuntu,
					Cantarell,
					'Open Sans',
					'Helvetica Neue',
					sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">` + status + '</span>\n			<div class="message">\n				<h1>' + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n"
  },
  version_hash: "15apf1v"
};
function get_hooks() {
  return {};
}
export {
  assets as a,
  base as b,
  set_building as c,
  get_hooks as g,
  options as o,
  reset as r,
  set_assets as s
};
