export = YG1006;
declare class YG1006 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    signal: any;
    getWait(): Promise<any>;
}
