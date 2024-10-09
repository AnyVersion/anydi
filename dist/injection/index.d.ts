import "reflect-metadata";
import DiToken from "../token";
type value = any;
type options = ({
    ref: () => value;
} | {
    token: value;
}) & {
    resolver?: () => value;
    optional?: boolean;
    lazy?: boolean;
};
export default class DiInjection {
    private options;
    optional: boolean;
    lazy: boolean;
    constructor(options: options);
    private token?;
    getToken(): DiToken;
    factory(): any;
}
export {};
