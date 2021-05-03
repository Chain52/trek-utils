import mainDataSource from './mainDataSource';

export default () => {
  const data = mainDataSource();

  return {
    async open() {
      try {
        await data.databaseConnection();
      } catch (e) {
        console.error('Database connection error: ', e);
      }
    },
  };
};
