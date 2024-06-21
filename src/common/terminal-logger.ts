import chalk from "chalk";

type LogLevel = "info" | "warn" | "error";

export class TerminalLogger {
  static log(message: string, level: LogLevel, infos?: Record<string, string>) {
    const date = new Date().toLocaleString();
    const infoPart = infos ? `${this.formatInfos(infos)} - ` : "";
    const fullMessage = `[${this.formatByLevel(
      date,
      level
    )}] ${infoPart}${this.formatByLevel(message, level)}`;
    console.log(fullMessage);
  }

  private static formatInfos(infos: Record<string, string>) {
    return Object.entries(infos)
      .map(([key, value]) => `${chalk.magenta(key)}: ${chalk.white(value)}`)
      .join(" ");
  }

  private static formatByLevel(message: string, level: LogLevel) {
    switch (level) {
      case "info":
        return chalk.blue(message);
      case "warn":
        return chalk.yellow(message);
      case "error":
        return chalk.red(message);
    }
  }
}
