const service = require("./index");
const chai = require("chai");
const expect = chai.expect;

describe('test spelling protocol', () => {

    before(() => {
        return service.init(true);
    });

    it('should handle concurrent call wihout error', () => {
        const promises = [];
        for (let i = 0; i < 25; i++) {
            const contentToCheck = "binjour " + i;
            promises.push(service.check(contentToCheck).then((res) => {
                expect(res[0].content).to.deep.equals(contentToCheck);
            }));
        }
        return Promise.all(promises);
    });

    it('should handle \'binjour\'', () => {
        return service.check("binjour").then((result) => {
            expect(result).to.deep.equals([
                {
                    "category": "Faute de frappe possible",
                    "content": "binjour",
                    "description": "Faute de frappe possible",
                    "from": 0,
                    "id": "HUNSPELL_RULE",
                    "replacements": [
                        "bonjour"
                    ],
                    "to": 7
                }
            ]);
        });
    });
    it('should handle \'bonjour\'', () => {
        return service.check("bonjour").then((result) => {
            expect(result).to.deep.equals([{
                "category": "Majuscules",
                "content": "bonjour",
                "description": "Absence de majuscule en début de phrase",
                "from": 0,
                "id": "UPPERCASE_SENTENCE_START",
                "replacements": [
                    "Bonjour"
                ],
                "to": 7
            }]);
        });
    });
    it('should handle \'\'', () => {
        return service.check("").then((result) => {
            expect(result).to.deep.equals([]);
        });
    });
    it('should handle \'&é€(-è_çà)\'', () => {
        return service.check("&é€(-è_çà)").then((result) => {
            expect(result).to.deep.equals([
                {
                    "category": "Faute de frappe possible",
                    "content": "&é€(-è_çà)",
                    "description": "Faute de frappe possible",
                    "from": 1,
                    "id": "HUNSPELL_RULE",
                    "replacements": [
                        "ai",
                        "e",
                        "a",
                        "z",
                        "né",
                        "té",
                        "ré",
                        "lé",
                        "éd",
                        "dé",
                        "vé",
                        "hé",
                        "s",
                        "n",
                        "t"
                    ],
                    "to": 2,
                },
                {
                    "category": "Faute de frappe possible",
                    "content": "&é€(-è_çà)",
                    "description": "Faute de frappe possible",
                    "from": 4,
                    "id": "HUNSPELL_RULE",
                    "replacements": [
                        "-ai",
                        "-e",
                        "-y",
                        "-u",
                        "-ès",
                        "-s",
                        "-n",
                        "-t",
                        "-i",
                        "-a",
                        "-r",
                        "-l",
                        "-o",
                        "-d",
                        "-c",
                    ],
                    "to": 6,
                }
            ]);
        });
    });
});