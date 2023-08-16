import { PrismaClient, Status } from "@prisma/client";
import ORMConnection from "./ORMConnection";

export default class PrismaAdapter implements ORMConnection {
  public client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  open(): PrismaClient {
    return this.client;
  }

  async close(): Promise<void> {
    await this.client.$disconnect();
  }
}