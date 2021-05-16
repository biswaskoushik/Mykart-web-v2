export interface Fault {
    readonly "fault_type": string;
    readonly "fault_code": number;
    readonly "fault_message": string;
}

export class FaultEnum {

    public static SYSTEM_ERROR: Fault = {
        fault_code: 1001,
        fault_message: 'SYSTEM',
        fault_type: 'A System error occurred, retry or contact tech support'
    }

    public static EMAIL_DOES_NOT_EXIST: Fault = {
        fault_code: 1023,
        fault_message: 'Email does not exist',
        fault_type: 'APPLICATION'
    }

}
