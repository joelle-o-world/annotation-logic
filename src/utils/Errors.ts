export class ImplementationError extends Error {}
export class NotSupported extends ImplementationError {}
export class NotImplemented extends ImplementationError {}

export class LogicalError extends Error {}
export class Contradiction extends LogicalError {}
