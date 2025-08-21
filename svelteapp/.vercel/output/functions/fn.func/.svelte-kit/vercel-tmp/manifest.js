export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["Bitwise-m19x.ttf","build/bundle.css","build/bundle.js","build/bundle.js.map","favicons/favicon_128.png","favicons/favicon_16.png","favicons/favicon_256.png","favicons/favicon_32.png","favicons/favicon_512.png","favicons/favicon_64.png","global.css","icons/achievements/hasura.svg","icons/achievements/nco.png","icons/achievements/nso.png","icons/achievements/udemy.webp","icons/github.png","icons/gmail.webp","icons/linkedin.png","icons/soft/adaptability.png","icons/soft/communication.png","icons/soft/english.png","icons/soft/lateral-thinking.png","icons/soft/leadership.png","icons/soft/logical-analysis.png","icons/soft/teamwork.png","icons/soft-skills.png","icons/technical/css3.png","icons/technical/git.png","icons/technical/github.png","icons/technical/html5.png","icons/technical/javascript.png","icons/technical/python.webp","icons/technical/reactjs.png","icons/technical/rest.png","icons/technical.png","images/HPDF.jpg","images/Hulk.gif","images/nco.png","images/nso-gold.png","images/pentest.jpg","images/pokeball.png","images/pokegambler.png","images/stocksalot_preview.gif","images/vssticky.gif","resume.html","startSfx.mp3"]),
	mimeTypes: {".ttf":"font/ttf",".css":"text/css",".js":"application/javascript",".map":"application/json",".png":"image/png",".svg":"image/svg+xml",".webp":"image/webp",".jpg":"image/jpeg",".gif":"image/gif",".html":"text/html",".mp3":"audio/mpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.5b0867fe.js","app":"_app/immutable/entry/app.ead26665.js","imports":["_app/immutable/entry/start.5b0867fe.js","_app/immutable/chunks/scheduler.38b1c095.js","_app/immutable/chunks/singletons.9aa74f5c.js","_app/immutable/chunks/index.ace71199.js","_app/immutable/entry/app.ead26665.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.38b1c095.js","_app/immutable/chunks/index.1afc2de3.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/achievements",
				pattern: /^\/api\/achievements\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/achievements/_server.js'))
			},
			{
				id: "/api/admin",
				pattern: /^\/api\/admin\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/admin/_server.js'))
			},
			{
				id: "/api/education",
				pattern: /^\/api\/education\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/education/_server.js'))
			},
			{
				id: "/api/experience",
				pattern: /^\/api\/experience\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/experience/_server.js'))
			},
			{
				id: "/api/projects",
				pattern: /^\/api\/projects\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/projects/_server.js'))
			},
			{
				id: "/api/skills",
				pattern: /^\/api\/skills\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/skills/_server.js'))
			},
			{
				id: "/api/socials",
				pattern: /^\/api\/socials\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/socials/_server.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
