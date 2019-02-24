export type ConfiguredFilenames = {
    js?: string,
    css?: string,
    images? :string,
    fonts?: string,
};

export type CopyFilesConfig = {
    from: null | string,
    pattern: RegExp,
    to: null | string,
    includeSubdirectories: boolean,
};

export type SassOptions = {
    resolveUrlLoader: boolean,
};

export type PreactOptions = {
    preactCompat: boolean,
};

export type UrlLoaderOptions = {
    images?: boolean,
    fonts?: boolean,
};

export type BabelOptions = {
    exclude: import("webpack").RuleSetCondition,
};
