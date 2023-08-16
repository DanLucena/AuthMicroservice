import User from "../../domain/User";

export default interface ORMConnection {
  open(): any;
  close(): Promise<void>;
}