package YOUR_PACKAGE;

import java.util.ArrayList;
import java.util.List;
import org.bukkit.ChatColor;

// To the color in the console log
public class Color {
    public static String translate(String input) {
        return ChatColor.translateAlternateColorCodes('&', input);
    }

    public static List<String> translateFromArray(List<String> text) {
        List<String> messages = new ArrayList<>();
        for (String string : text)
            messages.add(translate(string));
        return messages;
    }
}
