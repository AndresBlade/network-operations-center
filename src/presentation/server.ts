import { FileSystemDatasource } from '../data/datasources/fileSystem.datasource';
import { LogRepositoryImplementation } from '../data/repositories/log.repository.impl';
import { CheckService } from '../domain/useCases/checks/checkService';
import { CronService } from './cron/cronService';

const fileSystemLogRepository = new LogRepositoryImplementation(
	new FileSystemDatasource()
);

export class ServerApp {
	public static start() {
		console.log('Server started');

		//Mandar email

		const url = 'http://google.com';
		CronService.createJob('*/5 * * * * *', () =>
			new CheckService(
				fileSystemLogRepository,
				() => console.log('success'),
				error => console.log(error)
			).execute(url)
		);
	}
}
