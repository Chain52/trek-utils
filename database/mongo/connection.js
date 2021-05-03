import mongoose from 'mongoose';

mongoose.set('useFindAndModify', false);
mongoose.set('debug', process.env.LOG_DB_ACTIONS === true);

let cachedConnection = null;

export default () => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connection
      .on('error', error => {
        console.error('ERROR: Failed to connect to database!');
        reject(error);
      })
      .on('close', () => {
        console.log('ERROR: Lost connection to database!');
        process.exit(1);
      })
      .once('open', () => {
        const connections = mongoose.connections;

        connections.map(connection =>
          console.log(
            `Connected to ${connection.host}:${connection.port}/${connection.name}`,
          ),
        );
        resolve(cachedConnection);
      });

    if (!cachedConnection) {
      cachedConnection = mongoose.connect(process.env.DB_CONNECTION_URI, {
        useNewUrlParser: true,
        poolSize: 1,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
        keepAlive: 120,
      });
    } else {
      console.log('DATABASE: using cached database instance');
      resolve(cachedConnection);
    }
  });
};
