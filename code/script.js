// DOM-selectors
const chart = document.getElementById("chart");
const projects = document.getElementById("projects");
const header = document.getElementById("header");
const API_REPOS = "https://api.github.com/users/sieurin/repos";
const API_USER = "https://api.github.com/users/sieurin";

// my token
const options = {
  method: "GET",
  headers: {
    Authorization: TOKEN,
  },
};

// fetch all information for the user-API and print them out
fetch(API_USER, options)
  .then((res) => res.json())

  .then((json) => {
    header.innerHTML += `
		<div class="header">
			<img src="${json.avatar_url}" alt= "avatar">
			<p class="user-name">${json.login}</p>
		</div>
		<div class="circles">
			<div class="circle one"></div>
			<div class="circle two"></div>
			<div class="circle three"></div>
			<div class="circle four"></div>
			<div class="circle five"></div>
			<div class="circle six"></div>
		</div>
		<p class="bio"><span>HI!</span> ${json.bio}</p>
		`;
  });

// fetch all information for each repo and print them out
fetch(API_REPOS, options)
  .then((res) => res.json())

  .then((json) => {
    const filterProjects = json.filter((project) => {
      return project.fork === true && project.name.startsWith("project");
    });

    renderChart(filterProjects.length);

    filterProjects.forEach((project) => {
      // print out the project name, branch, latest push, url
      projects.innerHTML += `
			<div class="projects" id=${project.name}>
				<div class="project-info">
					<div class="projects-left">
						<p class="pushed-at">last updated <br>${new Date(
              project.pushed_at
            ).toLocaleDateString("en-GB", options)}</p>
					</div>
					<p class="project-name">${project.name
            .replace("project-", "")
            .replace("-", " ")}</p>
					<div class="projects-right">
						<p class="branch-name">${project.default_branch} branch</p>
						<a class="project-url" href="${
              project.html_url
            }" alt="link to git" target="_blank">link to repo</a>
					</div>
				</div>
			</div>
			`;

      // fetch all the pull requests and print them out
      const reponame = project.name;
      const API_PR = `https://api.github.com/repos/Technigo/${reponame}/pulls?per_page=100`;
      fetch(API_PR, options)
        .then((res) => res.json())

        .then((json) => {
          const filteredPR = json.filter((PR) => {
            return PR.user.login === "sieurin";
          });

          const singleProject = document.getElementById(project.name);
          singleProject.innerHTML += `<p class="pull-requests">Pull requests: ${filteredPR.length}</p>`;

          // fetch all commits and print them out
          const API_COMMITS = `https://api.github.com/repos/sieurin/${reponame}/commits`;
          fetch(API_COMMITS, options)
            .then((res) => res.json())

            .then((json) => {
              singleProject.innerHTML += `<p class="commits">Commits: ${json.length}</p>`;
            });
        });
    });
  });
