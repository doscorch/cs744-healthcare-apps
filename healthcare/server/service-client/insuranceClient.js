const tokenHeader = "x-csrf";
const fetch = require('node-fetch');
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
    }
};

module.exports.insuranceAPI = api;