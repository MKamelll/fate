import { Lexer, TokenType } from "./lexer";

function main(): void {
    let test = "+ * - / += *= /= -= () [] {} 3.5 2 \"strong\" var const function for if"
    let l = new Lexer(test);
    let t = l.next();

    while (t.type !== TokenType.EOF) {
        console.log(t.toString());
        t = l.next();
    }
}

main();