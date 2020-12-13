export const enum Roles {
  NORMAL_USER,
  ADMIN,
  SUPER_ADMIN,
}

export interface ILogger {
  log(level: number, message: string): void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum LOG_LEVEL {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF,
}
