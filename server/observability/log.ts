export type LogFields = Record<string, unknown>;

export const logger = {
  info(msg: string, fields: LogFields = {}) {
    console.log(JSON.stringify({ level: "info", msg, ...fields }));
  },
  warn(msg: string, fields: LogFields = {}) {
    console.warn(JSON.stringify({ level: "warn", msg, ...fields }));
  },
  error(msg: string, fields: LogFields = {}) {
    console.error(JSON.stringify({ level: "error", msg, ...fields }));
  }
};
// Sentry/OpenTelemetry hooks can wrap this module later.
