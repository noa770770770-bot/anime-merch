// Asset library and background editor placeholder
export type Asset = {
  id: string;
  url: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  meta?: Record<string, any>;
};

export class AssetLibrary {
  private assets: Asset[] = [];
  add(asset: Asset) {
    this.assets.push(asset);
  }
  getAll() {
    return this.assets;
  }
  findById(id: string) {
    return this.assets.find(a => a.id === id);
  }
}
