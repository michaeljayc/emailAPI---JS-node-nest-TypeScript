import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { EmailReference } from "src/messages/message.dto";

export class MessageValidationPipe implements PipeTransform {

    transform(value: any) {
        this.checkRecipientObject(value.recipient);
        this.checkRecipientEmailIsNotEmpty(value.recipient.email);

        return value;
    }

    private checkRecipientObject(recipient: EmailReference) {
        if (!recipient)
            throw new BadRequestException("Provide recipient details")
    }

    private checkRecipientEmailIsNotEmpty(email: string) {
        if(!email) {
            throw new BadRequestException("Provide recipient's email.")
        }
    }
}