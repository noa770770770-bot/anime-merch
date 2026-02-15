// Command pattern for undo/redo
export type Command = {
  do: () => void;
  undo: () => void;
  label: string;
};

export class History {
  private past: Command[] = [];
  private future: Command[] = [];

  apply(cmd: Command) {
    cmd.do();
    this.past.push(cmd);
    this.future = [];
  }
  undo() {
    const cmd = this.past.pop();
    if (!cmd) return;
    cmd.undo();
    this.future.push(cmd);
  }
  redo() {
    const cmd = this.future.pop();
    if (!cmd) return;
    cmd.do();
    this.past.push(cmd);
  }
}
