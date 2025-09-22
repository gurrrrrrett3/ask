import fs from "fs";
import path from "path";
import { Logger } from "../../util/logger.js";

export default class ComponentCache extends Map<string, (props: { rid: string }) => any> {

    private readonly logger = new Logger("ComponentCache")

    constructor(public readonly basePath: string) {
        super();
    }

    private scanComponents(dir: string): string[] {
        const results: string[] = [];
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);

            if (file.isDirectory()) {
                results.push(...this.scanComponents(fullPath));
            } else if (file.name.endsWith(".js")) {
                const relativePath = path.relative(this.basePath, fullPath);
                results.push(relativePath);
            }
        }

        return results;
    }

    private async loadComponent(componentPath: string): Promise<void> {
        const id = componentPath.replace(".js", "").replace(/\//g, ".").toLowerCase()
        const fullPath = path.join(this.basePath, componentPath);

        try {
            const component = (await import(fullPath)).default;
            this.set(id, component);
            this.logger.debug(`Loaded component: ${id} from ${componentPath}`);
        } catch (error) {
            this.logger.error(`Failed to load component ${componentPath}:`, error);
        }
    }

    public async init(): Promise<void> {
        const componentFiles = this.scanComponents(this.basePath);
        for (const file of componentFiles) {
            await this.loadComponent(file);
        }

        this.logger.log(`Initialized ${this.basePath.replace(path.resolve(), "")} with ${componentFiles.length} components`);
    }

    public close(): void {

    }
}