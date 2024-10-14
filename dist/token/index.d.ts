type value = any;
export default class DiToken {
    value: value;
    private static map;
    static GetOrCreate(value: value): DiToken;
    private constructor();
}
export {};
