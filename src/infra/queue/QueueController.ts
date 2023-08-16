import UsecaseFactory from "../factory/UsecaseFactory";
import Queue from "./Queue";

export default class QueueController {

	constructor (readonly queue: Queue, readonly usecaseFactory: UsecaseFactory) {
		const sendMail = usecaseFactory.sendMail();
		
		queue.on("mailer", async function (input: any) {
			await sendMail.execute(input);
		});
	}
}