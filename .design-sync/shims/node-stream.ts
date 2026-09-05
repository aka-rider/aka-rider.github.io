export class Transform {
  constructor(_opts?: Record<string, unknown>) {}
  push(_chunk?: unknown): boolean {
    return true;
  }
}

const streamModule = { Transform };
export default streamModule;
