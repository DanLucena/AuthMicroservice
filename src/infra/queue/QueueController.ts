import UsecaseFactory from "../factory/UsecaseFactory";
import Queue from "./Queue";

export default class QueueController {

	constructor (readonly queue: Queue, readonly usecaseFactory: UsecaseFactory) {
		const confirmationMail = usecaseFactory.sendConfirmationMail();
		const passwordResetMail = usecaseFactory.sendPasswordReset();
		
		queue.on("mailer", async (input: any) => {
			await confirmationMail.execute(input);
		});

		queue.on("password-reset-mailer", async (input: any) => {
			await passwordResetMail.execute(input);
		})
	}
}