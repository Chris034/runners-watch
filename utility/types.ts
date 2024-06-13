import { AudioPaths } from "./constants";

export type AudioPathKey = (typeof AudioPaths)[keyof typeof AudioPaths];
