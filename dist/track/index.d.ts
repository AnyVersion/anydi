import DiContainer from "../container";
export default class DiTrack {
    static data: DiContainer[];
    static push(container: DiContainer): void;
    static pop(): DiContainer | undefined;
    static take(): DiContainer | undefined;
}
