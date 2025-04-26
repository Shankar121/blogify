import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthCheckResolver {
  @Query(() => String)
  hello(): string {
    return 'Health ok!';
  }
}
