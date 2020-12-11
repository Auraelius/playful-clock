import app from './app.js';
import { EXPRESS_PORT } from '../config.js';


app.listen(EXPRESS_PORT, () => {
  console.log(`Server listening at http://localhost:${EXPRESS_PORT}`);
});
