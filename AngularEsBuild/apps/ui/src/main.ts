import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// async function loadConfig() {
//   const config = await import('./config') as any;
//   // Use the config
// }

// loadConfig().then(() => {
console.log(window._env_.clientId);
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
//});
