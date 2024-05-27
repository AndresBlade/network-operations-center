export enum LogSeverityLevel {
	low = 'low',
	medium = 'medium',
	high = 'high',
}

export interface LogEntityProps {
	level: LogSeverityLevel; //Enum
	message: string;
	origin: string;
	createdAt?: Date;
}

export class LogEntity {
	public level: LogSeverityLevel; //Enum
	public message: string;
	public createdAt: Date;
	public origin: string;

	constructor({ message, level, origin, createdAt }: LogEntityProps) {
		this.message = message;
		this.level = level;
		this.origin = origin;
		this.createdAt = createdAt || new Date();
	}

	static fromJson(jsonData: string): LogEntity {
		const { level, message, createdAt, origin } = JSON.parse(
			jsonData
		) as LogEntity;
		if (!message) throw new Error('Empty message in log');
		if (!level) throw new Error('No level in log');

		const log = new LogEntity({ level, message, createdAt, origin });
		return log;
	}
}
