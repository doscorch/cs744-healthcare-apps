import feathers from '@feathersjs/client';
import rest from '@feathersjs/rest-client';

export const app = feathers();
const restClient = rest('http://localhost:3030');
app.configure(restClient.fetch(window.fetch));
app.configure(feathers.authentication({
    storage: window.localStorage
}));

export default app;
