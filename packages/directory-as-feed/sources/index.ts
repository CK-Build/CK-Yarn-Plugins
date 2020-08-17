import {Plugin} from '@yarnpkg/core';
import LocalFeedResolver from "./LocalFeedResolver";
import LocalFeedFetcher from "./LocalFeedFetcher";
const plugin: Plugin = {
  resolvers: [
    LocalFeedResolver
  ],
  fetchers: [
    LocalFeedFetcher
  ]
};

export default plugin;
