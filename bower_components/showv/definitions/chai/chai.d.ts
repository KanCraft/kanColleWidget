declare module chai {
    export function expect(value: any): IChai;
    
    export function should(): void;

    export interface IChai {
        // Chains
        to: IChai;
        be: IChai;
        been: IChai;
        is: IChai;
        and: IChai;
        have: IChai;
        with: IChai;
        that: IChai;
        at: IChai;
        of: IChai;
        same: IChai;
        not: IChai;
        deep: IChai;

        // Assertions
        a(value: string): any;
        include(value: any): any;
        ok: any;
        true: any;
        false: any;
        null: any;
        undefined: any;
        exist: any;
        empty: any;
        arguments: any;
        equal(value: any): any;
        eql(value: any): any;
        above(value: number): any;
        least(value: number): any;
        below(value: number): any;
        most(value: number): any;
        within(a: number, b: number): any;
        instanceof(Constructor: any): any;
        property(name: string): any;
        ownProperty(name: string): any;
        length(length: number): any;
        match(search: RegExp): any;
        string(str: string): any;
        keys(key1: string, ...keys: Array<string>): any;
        throw(param: any): any;
        respondTo(method: string): any;
        itself: any;
        satisfy(method: Function): any;
        closeTo(expected: number, delta: number): any;
        members(set: Array<any>): any;
    }
}


interface Object {
    should: chai.IChai;
}