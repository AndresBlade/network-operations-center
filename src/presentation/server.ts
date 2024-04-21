import { CheckService } from '../domain/useCases/checks/checkService';
import { CronService } from './cron/cronService';

export class ServerApp {
	public static start() {
		console.log('Server started');

		const url = 'http://localhost:3000';
		CronService.createJob('*/5 * * * * *', () =>
			new CheckService(
				() => console.log('success'),
				error => console.log(error)
			).execute(url)
		);
	}
}
