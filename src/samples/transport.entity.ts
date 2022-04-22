export class Transport {
  transport: string;
  reason: string;
  expenses: number;
  time_start: string;
  time_end: string;

  constructor(
    transport: string,
    reason: string,
    expenses: number,
    time_start: string,
    time_end: string,
  ) {
    this.transport = transport;
    this.reason = reason;
    this.expenses = expenses;
    this.time_start = time_start;
    this.time_end = time_end;
  }
}
