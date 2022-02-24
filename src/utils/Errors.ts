export class ImplementationError extends Error {}
export class MethodNotSupported extends ImplementationError {}
export class NotImplemented extends ImplementationError {}

export class LogicalError extends Error {}
export class Contradiction extends LogicalError {}
