import { transports, format } from 'winston'
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston'
import 'winston-daily-rotate-file'
// 自定义时间格式化函数
const customTimestamp = format((info) => {
  const now = new Date()
  info.timestamp = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  return info
})
export const LoggerFactory = (appName: string) => {
  let consoleFormat

  const DEBUG = process.env.DEBUG
  const USE_JSON_LOGGER = process.env.USE_JSON_LOGGER
  if (USE_JSON_LOGGER === 'true') {
    consoleFormat = format.combine(customTimestamp(), format.ms(), format.json())
  } else {
    consoleFormat = format.combine(
      customTimestamp(),
      format.ms(),
      nestWinstonModuleUtilities.format.nestLike(appName, {
        colors: true,
        prettyPrint: true
      })
    )
  }

  return WinstonModule.createLogger({
    level: DEBUG ? 'debug' : 'info',
    transports: [
      new transports.DailyRotateFile({
        // %DATE will be replaced by the current date
        filename: `logs/%DATE%-error.log`,
        level: 'error',
        format: format.combine(
          customTimestamp(),
          format.printf((info) => {
            const logEntry = {
              timestamp: info.timestamp, // 确保 timestamp 是第一个字段
              context: info.context,
              level: info.level,
              message: info.message,
              ...info // 保留其他字段
            }
            return JSON.stringify(logEntry)
          })
        ),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false, // don't want to zip our logs
        maxFiles: '30d' // will keep log until they are older than 30 days
      }),
      new transports.DailyRotateFile({
        filename: `logs/%DATE%-combined.log`,
        format: format.combine(
          customTimestamp(),
          format.printf((info) => {
            const logEntry = {
              timestamp: info.timestamp,
              context: info.context,
              level: info.level,
              message: info.message,
              ...info // 保留其他字段
            }
            return JSON.stringify(logEntry)
          })
        ),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d'
      }),
      new transports.Console({ format: consoleFormat })
    ]
  })
}
