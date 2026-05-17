export class Site {
  private static instance: Site | null = null;

  static getInstance(): Site {
    if (!Site.instance) Site.instance = new Site();
    return Site.instance;
  }

  private constructor() {}
}
