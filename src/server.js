const setup = require('./app');
const port = process.env.PORT || 3000;

(async () => {
  const app = await setup();
  app.listen(port, () => console.log(`Server running on port ${port}`));
})();
