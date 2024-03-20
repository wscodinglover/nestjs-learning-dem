import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule, TagModule, CategoryModule } from '../modules';
import { MDMiddleware } from './../core/middleware/md.middleware';
import { PostsEntity } from '../entities/posts.entity';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostsController } from '../controller';
import { PostsService } from '../service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity]),
    CategoryModule,
    TagModule,
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MDMiddleware)
      .forRoutes({ path: 'post', method: RequestMethod.POST });
  }
}
