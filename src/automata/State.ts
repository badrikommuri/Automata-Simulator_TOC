export class State {
  constructor(
    public readonly name: string,
    public readonly isAccepting: boolean = false,
    public readonly isRejecting: boolean = false
  ) {}
}