import { app } from './app';
import { config } from './config/index';

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Task Manager API listening on http://localhost:${config.port}`);
});

