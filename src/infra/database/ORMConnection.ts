export default interface ORMConnection {
  open(): any;
  close(): Promise<void>;
}