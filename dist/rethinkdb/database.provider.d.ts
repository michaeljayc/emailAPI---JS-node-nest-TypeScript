export declare const RethinkProvider: {
    provide: string;
    useFactory: () => Promise<rethink.Client>;
};
export default RethinkProvider;
