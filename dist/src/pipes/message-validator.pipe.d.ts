import { PipeTransform } from "@nestjs/common";
export declare class MessageValidationPipe implements PipeTransform {
    transform(value: any): any;
    private checkRecipientObject;
    private checkRecipientEmailIsNotEmpty;
}
