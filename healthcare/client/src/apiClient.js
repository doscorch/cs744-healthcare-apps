const tokenHeader = "x-csrf";
const serviceUri = "http://localhost:5000";
const api = {
    get: (path) => {
        let token = sessionStorage.getItem(tokenHeader);
        const url = `${serviceUri}${path}`;
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf': token,
            },
        }).then(res => {
            const resTok = res.headers.get(tokenHeader);
            if (resTok) {
                token = resTok;
                sessionStorage.setItem(tokenHeader, token);
            }
            return res.json();
        }).catch(err => {
            console.log(err);
        });
    },
    post: (path, data) => {
        let token = sessionStorage.getItem(tokenHeader);
        const url = `${serviceUri}${path}`;
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf': token,
            },
            body: JSON.stringify(data),
        }).then(res => {
            const resTok = res.headers.get(tokenHeader);
            console.log(resTok);
            if (resTok) {
                token = resTok;
                sessionStorage.setItem(tokenHeader, token);
            }

            return res.json();
        }).then(json => {
            console.log(json);
            return json
        }).catch(err => {
            console.log(err);
        });
    },
};

export default api;