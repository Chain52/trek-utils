export default () => {
  let _level = process.env.LOG_LEVEL;
  let _stack = process.env.NODE_ENV !== 'production';
  let _detail = process.env.NODE_ENV !== 'production';

  return {
    get config() {
      return {
        level: _level,
        customKey: 'detail',
        messageKey: 'message',
        detail: _detail,
        stack: _stack,
      };
    },
  };
};
