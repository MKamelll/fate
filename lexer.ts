export enum TokenType {
    LEFT_PAREN = "LEFT_PAREN",
    RIGHT_PAREN = "RIGHT_PAREN",
    LEFT_BRACE = "LEFT_BRACE",
    RIGHT_BRACE = "RIGHT_BRACE",
    LEFT_BRACKET = "LEFT_BRACKET",
    RIGHT_BRACKET = "RIGHT_BRACKET",
    PLUS = "PLUS",
    PLUS_EQUAL = "PLUS_EQUAL",
    MINUS = "MINUS",
    MINUS_EQUAL = "MINUS_EQUAL",
    STAR = "STAR",
    STAR_EQUAL = "STAR_EQUAL",
    SLASH = "SLASH",
    SLASH_EQUAL = "SLASH_EQUAL",
    LESS_THAN = "LESS_THAN",
    LESS_THAN_EQUAL = "LESS_THAN_EQUAL",
    GREATER_THAN = "GREATER_THAN",
    GREATER_THAN_EQUAL = "GREATER_THAN_EQUAL",
    AND = "AND",
    OR = "OR",
    NOT = "NOT",
    FUNCTION = "FUNCTION",
    CLASS = "CLASS",
    FOR = "FOR",
    IF = "IF",
    VAR = "VAR",
    CONST = "CONST",
    EOF = "EOF",
    ILLEGAL = "ILLEGAL",
    EQUAL = "EQUAL",
    EQUAL_EQUAL = "EQUAL_EQUAL",
    SEMICOLON = "SEMICOLON",
    COLON = "COLON",
    STRING = "STRING",
    INT = "INT",
    FLOAT = "FLOAT",
    IDENTIFIER = "IDENTIFIER"
}

export class Token {
    lexeme: string;
    type: TokenType;

    constructor(type: TokenType, lexeme: string) {
        this.lexeme = lexeme;
        this.type = type;
    }

    toString(): string {
        return `Token(type: ${this.type}, lexeme: '${this.lexeme}')`;
    }
}

export class Lexer {
    source: string;
    curr_index: number;

    constructor(source: string) {
        this.source = source;
        this.curr_index = 0;
    }

    is_alpha(char: string) {
        let is_alpha_small = char.charCodeAt(0) >= 'a'.charCodeAt(0) && char.charCodeAt(0) <= 'z'.charCodeAt(0);
        let is_alpha_capital = char.charCodeAt(0) >= 'A'.charCodeAt(0) && char.charCodeAt(0) <= 'Z'.charCodeAt(0);
        return is_alpha_capital || is_alpha_small;
    }

    is_num(char: string) {
        return char.charCodeAt(0) >= '0'.charCodeAt(0) && char.charCodeAt(0) <= '9'.charCodeAt(0);
    }

    is_alpha_num(char: string) {
        return this.is_num(char) || this.is_alpha(char);
    }

    advance() {
        this.curr_index++;
    }

    curr(): string {
        return this.source[this.curr_index];
    }

    is_at_end(): boolean {
        return this.curr_index >= this.source.length;
    }

    next(): Token {
        if (this.is_at_end()) return new Token(TokenType.EOF, "EOF");

        switch (this.curr()) {
            case '(':
                {
                    this.advance();
                    return new Token(TokenType.LEFT_PAREN, "(");
                }
            case ')':
                {
                    this.advance();
                    return new Token(TokenType.RIGHT_PAREN, ")");
                }
            case '[':
                {
                    this.advance();
                    return new Token(TokenType.LEFT_BRACE, "[");
                }
            case ']':
                {
                    this.advance();
                    return new Token(TokenType.RIGHT_BRACE, "]");
                }
            case '{':
                {
                    this.advance();
                    return new Token(TokenType.LEFT_BRACKET, "{");
                }
            case '}':
                {
                    this.advance();
                    return new Token(TokenType.RIGHT_BRACKET, "}");
                }
            case '+':
                {
                    this.advance();
                    if (this.curr() == '=') {
                        this.advance();
                        return new Token(TokenType.PLUS_EQUAL, "+=");
                    }
                    return new Token(TokenType.PLUS, "+");
                }

            case '-':
                {
                    this.advance();
                    if (this.curr() == '=') {
                        this.advance();
                        return new Token(TokenType.MINUS_EQUAL, "-=");
                    }
                    return new Token(TokenType.MINUS, "-");
                }

            case '*':
                {
                    this.advance();
                    if (this.curr() == '=') {
                        this.advance();
                        return new Token(TokenType.STAR_EQUAL, "*=");
                    }
                    return new Token(TokenType.STAR, "*");
                }

            case '/':
                {
                    this.advance();
                    if (this.curr() == '=') {
                        this.advance();
                        return new Token(TokenType.SLASH_EQUAL, "/=");
                    }
                    return new Token(TokenType.SLASH, "/");
                }

            case '<':
                {
                    this.advance();
                    if (this.curr() == '=') {
                        this.advance();
                        return new Token(TokenType.LESS_THAN_EQUAL, "<=");
                    }
                    return new Token(TokenType.LESS_THAN, "<");
                }

            case '>':
                {
                    this.advance();
                    if (this.curr() == '=') {
                        this.advance();
                        return new Token(TokenType.GREATER_THAN_EQUAL, ">=");
                    }
                    return new Token(TokenType.GREATER_THAN, ">");
                }

            case '=':
                {
                    this.advance();
                    if (this.curr() == '=') {
                        this.advance();
                        return new Token(TokenType.EQUAL_EQUAL, "==");
                    }
                    return new Token(TokenType.EQUAL, "=");
                }
            
            case ';':
                {
                    this.advance();
                    return new Token(TokenType.SEMICOLON, ";");
                }
            case ':':
                {
                    this.advance();
                    return new Token(TokenType.COLON, ":");
                }
            case ' ':
                {
                    this.advance();
                    return this.next();
                }
            case '"':
                {
                    let str = this.a_string();
                    return new Token(TokenType.STRING, str);
                }
            default:
                {
                    if (this.is_num(this.curr())) {
                        let [num, is_float] = this.a_number();
                        if (is_float) {
                            return new Token(TokenType.FLOAT, num);
                        }

                        return new Token(TokenType.INT, num);
                    } else if (this.is_alpha(this.curr())) {
                        let identifier = this.an_identifier();

                        switch (identifier) {
                            case "var":
                                {
                                    return new Token(TokenType.VAR, identifier);
                                }

                            case "const":
                                {
                                    return new Token(TokenType.CONST, identifier);
                                }

                            case "function":
                                {
                                    return new Token(TokenType.FUNCTION, identifier);
                                }

                            case "class":
                                {
                                    return new Token(TokenType.CLASS, identifier);
                                }

                            case "and":
                                {
                                    return new Token(TokenType.AND, identifier);
                                }

                            case "or":
                                {
                                    return new Token(TokenType.OR, identifier);
                                }

                            case "not":
                                {
                                    return new Token(TokenType.NOT, identifier);
                                }

                            case "for":
                                {
                                    return new Token(TokenType.FOR, identifier);
                                }

                            case "if":
                                {
                                    return new Token(TokenType.IF, identifier);
                                }
                            default: break;
                        }
                        return new Token(TokenType.IDENTIFIER, identifier);
                    }
                }
                break;
        }

        let illegal = this.curr();
        this.advance();
        return new Token(TokenType.ILLEGAL, illegal);
    }

    a_number(): [string, boolean] {
        let result = "";
        let is_float = false;

        while (!this.is_at_end()) {
            if (this.curr() == '.') {
                is_float = true;
                result += this.curr();
                this.advance();
                continue;
            }

            if (!this.is_num(this.curr())) break;

            result += this.curr();
            this.advance();
        }

        return [result, is_float];
    }

    a_string(): string {
        this.advance();
        let result = "";

        while (!this.is_at_end()) {
            if (this.curr() == '"') break;
            result += this.curr();
            this.advance();
        }

        this.advance();
        return result;
    }

    an_identifier(): string {
        let result = "";

        while (!this.is_at_end()) {
            if (!this.is_alpha_num(this.curr())) break;
            result += this.curr();
            this.advance();
        }
        return result;
    }

}