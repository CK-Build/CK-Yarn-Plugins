import { Resolver, Descriptor, MinimalResolveOptions, Locator, Package, DescriptorHash, ResolveOptions } from "@yarnpkg/core"

export default class LocalFeedResolver implements Resolver {
    supportsDescriptor(descriptor: Descriptor, opts: MinimalResolveOptions): boolean {
        throw new Error("Method not implemented.");
    }
    supportsLocator(locator: Locator, opts: MinimalResolveOptions): boolean {
        throw new Error("Method not implemented.");
    }
    shouldPersistResolution(locator: Locator, opts: MinimalResolveOptions): boolean {
        throw new Error("Method not implemented.");
    }
    bindDescriptor(descriptor: Descriptor, fromLocator: Locator, opts: MinimalResolveOptions): Descriptor {
        throw new Error("Method not implemented.");
    }
    getResolutionDependencies(descriptor: Descriptor, opts: MinimalResolveOptions): Descriptor[] {
        throw new Error("Method not implemented.");
    }
    getCandidates(descriptor: Descriptor, dependencies: Map<DescriptorHash, Package>, opts: ResolveOptions): Promise<Locator[]> {
        throw new Error("Method not implemented.");
    }
    resolve(locator: Locator, opts: import("@yarnpkg/core").ResolveOptions): Promise<Package> {
        throw new Error("Method not implemented.");
    }

}
