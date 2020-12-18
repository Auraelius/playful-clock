import app from './app.js';
const EXPRESS_PORT = process.env.EXPRESS_PORT;


app.listen(EXPRESS_PORT, () => {
  console.log(`Server listening at http://localhost:${EXPRESS_PORT}`);
});
