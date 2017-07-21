package nodespelling;

import org.languagetool.JLanguageTool;
import org.languagetool.Language;
import org.languagetool.language.French;
import org.languagetool.rules.RuleMatch;
import org.languagetool.rules.spelling.hunspell.HunspellNoSuggestionRule;
import org.languagetool.rules.spelling.hunspell.HunspellRule;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;
import java.util.Scanner;

public class SpellingMain {

    private static JLanguageTool langTool;
    private static boolean enableEcho;

    public static void main(String[] args) {
        try {
            enableEcho = Arrays.asList(args).contains("--echo");
            initSpeller();
            Scanner sc = new Scanner(System.in);
            System.out.println("OK");
            while (sc.hasNextLine()) {
                System.out.println(spelling(sc.nextLine()));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void initSpeller() {
        Language lang = new French();
        langTool = new JLanguageTool(lang);
        langTool.disableRule(HunspellNoSuggestionRule.RULE_ID);
        langTool.addRule(new HunspellRule(ResourceBundle.getBundle("org.languagetool.MessagesBundle", lang.getLocale()), lang));
    }

    private static String spelling(String content) {
        try {
            List<RuleMatch> matches = langTool.check(content);
            StringBuilder result = new StringBuilder();
            result.append("[");
            boolean firstMatch = true;
            for (RuleMatch match : matches) {
                if (firstMatch) {
                    firstMatch = false;
                } else {
                    result.append(",");
                }
                result.append("{");
                if (enableEcho) {
                    result.append("\"content\":\"" + content + "\",");
                }
                result.append("\"from\":" + match.getFromPos() + ",");
                result.append("\"to\":" + match.getToPos() + ",");
                result.append("\"description\":\"" + match.getRule().getDescription() + "\",");
                result.append("\"id\":\"" + match.getRule().getId() + "\",");
                result.append("\"category\":\"" + match.getRule().getCategory() + "\",");
                result.append("\"replacements\":[");
                boolean first = true;
                for (String str : match.getSuggestedReplacements()) {
                    if (first) {
                        result.append("\"" + str + "\"");
                        first = false;
                    } else {
                        result.append(",\"" + str + "\"");
                    }
                }
                result.append("]}");
            }
            result.append("]");
            return result.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}