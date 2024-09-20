import axios from "axios";

const API_BASE_URL = "https://api.github.com/users";

const githubService = {
  getUser: (username) =>
    axios
      .get(`${API_BASE_URL}/${username}`)
      .then(({ data }) => data)
      .catch((err) => {
        throw new Error("User not found");
      }),
  getRepos: (username) =>
    axios
      .get(`${API_BASE_URL}/${username}/repos?per_page=100`)
      .then(({ data }) => data)
      .catch((err) => {
        throw new Error("Repos not found");
      }),
};

export default githubService;
