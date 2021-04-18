const tokenHeader = "x-csrf";
const serviceUri = "http://localhost:5002";
const api = {
    get: (path) => {
        const url = `${serviceUri}${path}`;
        return fetch(url, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            return res.json();
        }).then(json => {
            return json
        }).catch(err => {
            console.log(err);
        });
    },
    post: (path, data) => {
        const url = `${serviceUri}${path}`;
        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => {
            return res.json();
        }).then(json => {
            return json
        }).catch(err => {
            console.log(err);
        });
    },
    patch: (path, data) => {
        let token = tokenManager.get();
        const url = `${serviceUri}${path}`;
        return fetch(url, {
            method: 'PATCH',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf': token,
            },
            body: JSON.stringify(data),
        }).then(res => {
            const resTok = res.headers.get(tokenHeader);
            if (resTok) {
                token = resTok;
                tokenManager.set(token);
            }

            return res.json();
        }).then(json => {
            return json
        }).catch(err => {
            console.log(err);
        });
    },
    delete: (path) => {
        let token = tokenManager.get();
        const url = `${serviceUri}${path}`;
        return fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf': token,
            },
        }).then(res => {
            const resTok = res.headers.get(tokenHeader);
            if (resTok) {
                token = resTok;
                tokenManager.set(token);
            }
            return res.json();
        }).then(json => {
            return json
        }).catch(err => {
            console.log(err);
        });
    },
};

export default api;