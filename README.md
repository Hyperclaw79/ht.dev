# 🚀 HT Developer Portfolio 🚀
![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![PocketBase](https://img.shields.io/badge/pocketbase-%23b8dbe4.svg?style=for-the-badge&logo=Pocketbase&logoColor=black)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Hyperclaw79/ht.dev/build.yml?style=for-the-badge&logo=Github)
![Codacy](https://img.shields.io/codacy/grade/485f58538f324d4d8154b55e991455d5?label=Code%20Quality&logo=Codacy&style=for-the-badge)
![Vercel](https://img.shields.io/github/deployments/hyperclaw79/ht.dev/production?label=Vercel&logo=Vercel&style=for-the-badge)
![Checkly](https://api.checklyhq.com/v1/badges/checks/ec3abe6a-d733-43eb-964a-99d06a61efb7?style=for-the-badge&theme=default)

Welcome to my developer portfolio website, built using SvelteKit and PocketBase. The website showcases my skills, projects, and experiences as a developer.

You can access the live website [here](https://ht-dev.vercel.app/).

## 🌟 Features

- Modern and responsive design
- Interactive and user-friendly UI
- Dynamic content fetched from PocketBase database
- Easy to update and maintain
- Admin Panel which redirects to PocketHost

<details>
<summary><h3>🔥 Highlights</h3></summary>
Some personal favorite quirks I added which you might wanna use in your own projects:

- On Desktop screens, there is an interactive bash Terminal I made from scratch just to play around.

<img src="assets/Terminal.png" alt="Terminal" width="500" />

- About section has a Typewriter Animation. Skills are displayed as a Word Cloud.

<img src="assets/About.gif" alt="About" width="500" />

- On Desktop screens, the Experience and Acheivements sections have a Timeline created using CSS pseudo-elements.
<img src="assets/Timeline.png" alt="Timeline" width="250" />

- Projects section features Tiltable GitHub Cards.

<img src="assets/Tiltable.png" alt="Projects" width="250" />

- Multicolor Progressbar to display Skill Proficiency.

<img src="assets/Progress.png" alt="Progressbar" width="250" />
</details>

## 🛠️ Technologies Used

- [SvelteKit](https://kit.svelte.dev/)
- [PocketBase](https://pocketbase.io/)
- [Vercel](https://vercel.com/)
- [Pockethost](https://pockethost.io/)

## 🚀 Deployment

The website is deployed using [Vercel](https://vercel.com/) and the database is hosted on [Pockethost](https://pockethost.io/). To deploy the website:

1. Clone the repository
2. Set up a PocketHost account and create a new database
3. Update the `.env` file with your relevant credentials
4. Deploy the website to Vercel

## 🖥️ Local Development

To run the website locally:

1. Clone the repository
2. Install dependencies using `npm install`
3. Update the `.env` file with your relevant credentials
4. Start the development server using `npm run dev`

### 🧪 Running Tests

To run the test suite:

1. Ensure dependencies are installed: `npm install`
2. Run all tests: `npm test`
3. Run tests in watch mode: `npm test -- --watch`

All tests are located in the `svelteapp/tests/` directory, organized to mirror the source code structure in `svelteapp/src/`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check out the [issues page](https://github.com/hyperclaw79/ht.dev/issues) if you want to contribute.

## 📝 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
