# node-spelling
node wrapper for JLanguageTool Spellchecker

master branch is for French dictionnary. Please ask for more language packaging in issues, I will add a branch by language.
(All language imply +100Mo)

**Require JRE to be installed. (depending on node-jre imply >100Mo, )**

~~~
import speller from 'node-spelling';

speller.check('plain text content to check').then((spellCheckReport)=>{
   /*
    *
    * spellCheckReport will contains matches : 
    *  [
    *    {
    *        "from": 0,
    *        "to": 5,
    *        "description": "Faute de frappe possible",
    *        "id": "HUNSPELL_RULE",
    *        "category": "Faute de frappe possible",
    *        "replacements": ["hello"]
    *    }
    * ]
});
~~~
