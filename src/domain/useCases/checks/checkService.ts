import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';

interface CheckServiceUseCase {
	execute(url: string): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;

type ErrorCallback = ((error: string) => void) | undefined;

export class CheckService implements CheckServiceUseCase {
	constructor(
		private readonly logRepository: LogRepository,
		private readonly successCallback: SuccessCallback,
		private readonly errorCallback: ErrorCallback
	) {}
	public async execute(url: string): Promise<boolean> {
		const origin: string = 'checkService.ts';
		try {
			await fetch(url).then(res => {
				if (res.ok) return res;
				return Promise.reject(res);
			});
			const log = new LogEntity({
				level: LogSeverityLevel.low,
				message: `Service ${url} working`,
				origin,
			});

			await this.logRepository.saveLog(log);
			if (this.successCallback) this.successCallback();

			return true;
		} catch (error) {
			const errorMessage = `${url} is not ok. ${error}`;
			const log = new LogEntity({
				level: LogSeverityLevel.high,
				message: errorMessage,
				origin,
			});

			this.logRepository.saveLog(log);

			this.errorCallback && this.errorCallback(errorMessage);

			return false;
		}
	}
}
