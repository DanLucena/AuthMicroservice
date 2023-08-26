import PrismaAdapter from "./infra/database/PrismaAdapter";
import UsecaseFactory from "./infra/factory/UsecaseFactory";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import MainController from "./infra/http/MainController";
import ORMConnection from "./infra/database/ORMConnection";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";
import NodemailerAdapter from "./infra/mailer/NodemailerAdapter";
import QueueController from "./infra/queue/QueueController";
import RepositoryFactory from "./infra/factory/RepositoryFactory";
import RedisAdapter from "./infra/database/RedisAdapter";
import 'dotenv/config'

async function main() {
  const httpServer = new ExpressAdapter();
  const prisma = new PrismaAdapter() as ORMConnection;
  const queue = new RabbitMQAdapter();
  const redis = new RedisAdapter();
  
  await queue.connect();
  await redis.connect();

  const mailer = new NodemailerAdapter();
  const repositories = new RepositoryFactory(prisma);
  const usecases = new UsecaseFactory(repositories, queue, mailer, redis);

  new MainController(httpServer, usecases);
  new QueueController(queue, usecases);
  
  httpServer.listen(3000);
}

main();