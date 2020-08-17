import { PortablePath, xfs } from '@yarnpkg/fslib';
import {Command, Usage, UsageError} from 'clipanion';
import { StreamReport, Locator, Ident, structUtils, MessageName, Configuration, CommandContext } from '@yarnpkg/core';
import { Dirent } from 'fs';
import { getManifestFromTarball } from "./packUtils2";
export default class LocalFeedFetcher {
    private packages: Map<Locator, PortablePath> = new Map();
    private loading: Promise<StreamReport>;
    private loaded: boolean = false;
    /**
     *
     */
    constructor(feedPath: PortablePath, context: CommandContext) {
        this.loading = this.loadFeed(feedPath, context )
    }

    private async loadFeed(path: PortablePath, context: CommandContext) {
        const configuration = await Configuration.find(context.cwd, context.plugins);
        return StreamReport.start({
            configuration: configuration,
            stdout: context.stdout
        }, async report => {
            if(!await xfs.existsPromise(path)) {
                report.reportErrorOnce(0, "The given path doesn't exist.");
                return;
            }
            await this.processDirectory(path, report);
            this.loaded = true;
        })
    }

    private async processDirectory(path: PortablePath, report: StreamReport): Promise<void> {
        const files = await xfs.readdirPromise(path, {
            withFileTypes: true
        });
        let promises: Promise<void>[] = [];
        report.reportInfo(null, `Scanning directory ${path} for packages.`);
        for (let i = 0; i < files.length; i++) {
            const element = files[i];
            if(element.isDirectory()) {
                promises.push(this.processDirectory(element.name, report));
            }
            if(element.isFile()) {
                promises.push(this.processFile(element, report));
            }
        }
        await Promise.all(promises);
    }

    private async processFile(filePath: Dirent, report: StreamReport) {
        if(!filePath.name.endsWith("tgz")) return;
         const manifest = await getManifestFromTarball(filePath.name as PortablePath);
         if(manifest === null) {
             report.reportInfo(null, `Found tarball '${filePath}' but it doesn't contain a manifest. Skipping it.`);
             return;
         }
         if(manifest.name === null) {
             report.reportWarning(0, `Manifest of package ${filePath} does not have a name field.`);
             return;
         }
        if(manifest.version === null) {
            report.reportWarning(0, `Manifest of package ${filePath} does not have a version field.`);
            return;
        }
        const locator = structUtils.makeLocator(manifest.name, manifest.version);
        this.packages.set(locator, filePath.name as PortablePath);
        report.reportInfo(null, `Indexed package ${manifest.name}@${manifest.version} in tarball '${filePath}'.`);
    }

    private async waitLoad(){
        const report = await this.loading;
        if(report.hasErrors()) throw new Error();
        return this.packages;
    }
}
