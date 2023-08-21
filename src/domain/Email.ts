import { CustomError } from "../infra/errors/CustomError";

export default class Email {
  value: string;

  constructor(value: string) {
    if(!this.validate(value)) throw new CustomError('Invalid email', 400);
    this.value = value;
  }

  private validate(email: string) {
    return email
			.match(
			  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
  }
}