import { createInterface } from "readline/promises";
import { Lexer, TokenType } from "./lexer";

function repl(version: string): void {
    console.log(`Welcome to fate version ${version}`);

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "> ",
    });

    rl.prompt();

    rl.on("line", (line) => {
        let linetrimmed = line.trim();
        switch (linetrimmed) {
            case ".help": {
                const help = `
                    .help   diplays help
                    .exit   exits the repl
                `;
                console.log(help);
                break;
            }

            case ".exit": {
                rl.close();
                break;
            }

            default: {
                if (linetrimmed.length < 1) {
                    break;
                }

                let lexer = new Lexer(linetrimmed);
                let t = lexer.next();
                while (t.type !== TokenType.EOF) {
                    console.log(t.toString());
                    t = lexer.next();
                }

                break;
            }
        }

        rl.prompt();
    }).on("close", () => {
        console.log("leaving.");
        process.exit(0);
    });
}

function main(): void {
    if (process.argv.length <= 2) {
        return repl("0.1.0");
    }

    throw new Error("Using files is not supported yet.");
}

main();
