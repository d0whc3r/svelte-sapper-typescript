import { Server } from 'miragejs';

new Server({
  routes() {
    this.namespace = 'api';

    this.get('/test');
  }
});
