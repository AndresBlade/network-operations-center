import { envs } from './config/plugins/envs.plugin';
import { ServerApp } from './presentation/server';
import 'dotenv/config';

const main = () => {
	ServerApp.start();
	console.log({
		PORT: envs.PORT,
		MAILER_EMAIL: envs.MAILER_EMAIL,
	});
};
(() => {
	main();
})();
