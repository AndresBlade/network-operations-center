import fsp from 'fs/promises';
import { LogDataSource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

export class FileSystemDatasource implements LogDataSource {
	private readonly logPath = 'logs/';
	private readonly allLogsPath = 'logs/allLogs.log';
	private readonly mediumLogsPath = 'logs/mediumLogs.log';
	private readonly highLogsPath = 'logs/highLogs.log';

	constructor() {
		this.createLogFiles();
	}

	private createLogFiles() {
		fsp.access(this.logPath)
			.catch(() => fsp.mkdir(this.logPath))
			.catch(error => console.log(error));

		[this.allLogsPath, this.mediumLogsPath, this.highLogsPath].forEach(
			path =>
				fsp
					.access(path)
					.catch(() => fsp.writeFile(path, ''))
					.catch(error => console.log(error))
		);
	}

	async saveLog(newLog: LogEntity): Promise<void> {
		const logAsJson = `${JSON.stringify(newLog)}\n`;

		if (newLog.level === LogSeverityLevel.low)
			return await fsp.appendFile(this.allLogsPath, logAsJson);

		if (newLog.level === LogSeverityLevel.medium)
			return await fsp.appendFile(this.mediumLogsPath, logAsJson);

		if (newLog.level === LogSeverityLevel.high)
			return await fsp.appendFile(this.highLogsPath, logAsJson);
	}

	private async getLogsFromFile(path: string): Promise<LogEntity[]> {
		const content = await fsp.readFile(path, { encoding: 'utf-8' });
		const stringLogs = content.split('\n');
		const logs: LogEntity[] = stringLogs.map(logAsString =>
			LogEntity.fromJson(logAsString)
		);

		return logs;
	}

	async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
		if (severityLevel === LogSeverityLevel.medium)
			return this.getLogsFromFile(this.mediumLogsPath);
		if (severityLevel === LogSeverityLevel.high)
			return this.getLogsFromFile(this.highLogsPath);
		if (severityLevel === LogSeverityLevel.low)
			return this.getLogsFromFile(this.allLogsPath);
		throw new Error('Severity Level not matched');
	}
}
