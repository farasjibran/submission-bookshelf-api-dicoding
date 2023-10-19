const Hapi = require('@hapi/hapi');
const router = require('./router');

const initServer = async () => {
  const server = Hapi.server({
      port: 9000,
      host: 'localhost',
      routes: {
        cors: {
          origin: [
            '*'
          ]
        }
      }
  });

  server.route(router);

  // start the server
  await server.start();
  console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

initServer();