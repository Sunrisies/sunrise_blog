import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { LoggerFactory } from './utils/my-logger';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cors from "cors";
const validationPipe = new ValidationPipe({
  disableErrorMessages: false, // 必须为false（默认值）
  transform: true,             // 启用自动类型转换
  whitelist: true,             // 过滤未经验证的属性
  forbidNonWhitelisted: true,  // 返回非白名单属性的错误
  transformOptions: { enableImplicitConversion: true },
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
  // CORS配置
  app.use(
    cors((req, callback) => {
      const origin = req.headers.origin;
      console.log("origin", origin);
      callback(null, {
        origin: true,
        credentials: true,
      });
    }),
  );

  app.useGlobalPipes(validationPipe);
  app.setGlobalPrefix("api");
  const config = new DocumentBuilder()
    .setTitle("朝阳")
    .setDescription("朝阳博客相关的Api")
    .setVersion("1.0")
    .addTag("个人博客")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 导出 swagger 文档
  const fs = require('fs');
  const path = require('path');

  // 导出为 JSON 文件
  fs.writeFileSync(
    path.join(__dirname, '../swagger-spec.json'),
    JSON.stringify(document, null, 2)
  );
  SwaggerModule.setup("doc", app, document);
  await app.listen(2345, () => {
    console.log(`服务启动成功,端口号是:2345`);
  });
}
bootstrap();
