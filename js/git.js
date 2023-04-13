
export class GitApp{

    static search(userName){
        const api = `https://api.github.com/users/${userName}`;

        return fetch(api).then(data => data.json()).then(({ login, name, public_repos, followers })=> ({
            login,
            name,
            public_repos,
            followers
        }));
    }
}