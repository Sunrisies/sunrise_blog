import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { LoggerFactory } from './utils/my-logger';
const validationPipe = new ValidationPipe({
  disableErrorMessages: false, // 必须为false（默认值）
  transform: true,             // 启用自动类型转换
  whitelist: true,             // 过滤未经验证的属性
  forbidNonWhitelisted: true,  // 返回非白名单属性的错误
  exceptionFactory: (errors) => {
    const formattedErrors = errors.map(error => ({
      field: error.property,
      errors: Object.values(error.constraints || {})
    }));
    return new BadRequestException({
      code: 400,
      message: '请求参数验证失败',
      data: formattedErrors
    });
  }
})
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory("MyApp"),
  });
  app.useGlobalPipes(validationPipe);
  app.setGlobalPrefix("api");
  await app.listen(2345, () => {
    console.log("服务启动成功");
  });
}
bootstrap();
