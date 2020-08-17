import { Fetcher, Locator, MinimalFetchOptions } from "@yarnpkg/core";
import { PortablePath } from '@yarnpkg/fslib';

export default class LocalFeedFetcher implements Fetcher {
    supports(locator: Locator, opts: MinimalFetchOptions): boolean {
        throw new Error("Method not implemented.");
    }
    getLocalPath(locator: Locator, opts: import("@yarnpkg/core").FetchOptions): PortablePath {
        throw new Error("Method not implemented.");
    }
    fetch(locator: Locator, opts: import("@yarnpkg/core").FetchOptions): Promise<import("@yarnpkg/core").FetchResult> {
        throw new Error("Method not implemented.");
    }

}
