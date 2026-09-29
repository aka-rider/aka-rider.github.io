export {};

declare global {
  interface Document {
    readonly prerendering?: boolean;
  }

  interface DocumentEventMap {
    prerenderingchange: Event;
  }
}
