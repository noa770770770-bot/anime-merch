// Autosave and publish logic (draft vs published)
import { PageModel } from "./page-model";

export class AutosaveManager {
  private timer: any = null;
  private lastSaved: string = "";
  private saveFn: (model: PageModel) => Promise<void>;

  constructor(saveFn: (model: PageModel) => Promise<void>) {
    this.saveFn = saveFn;
  }

  queueSave(model: PageModel) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.save(model), 400);
  }

  async save(model: PageModel) {
    const json = JSON.stringify(model);
    if (json === this.lastSaved) return;
    await this.saveFn(model);
    this.lastSaved = json;
  }
}
