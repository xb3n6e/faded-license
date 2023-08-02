package YOUR_PACKAGE;

import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;
import org.json.JSONObject;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Random;
import java.util.Scanner;

public class Main extends JavaPlugin {

    private static Main instance;
    private static String licenseKey;
    public static String discordlink = "discord.gg/xb3n6e"; // Change your discord support server
    public static String pluginname = "FadedLicense-Test"; // Change name of plugin
    public static String URL = "http://localhost:8080/api/checklicense?licenseKey="; // Paste here your bot domain name and bot API port (always 8080)
    public static String starttime = String.valueOf(System.currentTimeMillis());

    @Override
    public void onEnable() {
        instance = this;
        saveDefaultConfig();
        licenseKey = getConfig().getString("license.key"); // Here you can change the config style of License key
        String JSON_URL = URL + licenseKey;

        Bukkit.getConsoleSender().sendMessage(Color.translate("&aEnabling " + pluginname + ".."));
        Bukkit.getConsoleSender().sendMessage(Color.translate("&b")); // You can remove these lines
        Bukkit.getConsoleSender().sendMessage(Color.translate("&bFadedLicense &fis responsible for the security of the plugin!"));
        Bukkit.getConsoleSender().sendMessage(Color.translate("&bhttps://builtbybit.com/resources/fade-license-system.29041/"));
        Bukkit.getConsoleSender().sendMessage(Color.translate("&b"));

        try {
            String jsonString = readUrl(JSON_URL);

            JSONObject json = new JSONObject(jsonString);
            String status = json.getString("status");
            String buyer = json.getString("buyer");

            if ("VALID".equals(status)) {
                Bukkit.getConsoleSender().sendMessage(Color.translate("&f"));
                if (buyer.isEmpty()) {
                    Bukkit.getConsoleSender().sendMessage(Color.translate("&fDear, &bN/A&f!"));
                    Bukkit.getConsoleSender().sendMessage(Color.translate("&fYour license is &a" + status));
                    Bukkit.getConsoleSender().sendMessage(Color.translate("&fFor support join our discord server &b" + discordlink));
                } else {
                    Bukkit.getConsoleSender().sendMessage(Color.translate("&fDear, &b" + buyer + "&f!"));
                    Bukkit.getConsoleSender().sendMessage(Color.translate("&fYour license is &a" + status));
                    Bukkit.getConsoleSender().sendMessage(Color.translate("&fFor support join our discord server &b" + discordlink));
                }
                Bukkit.getConsoleSender().sendMessage(Color.translate("&fPlugin has been enabled in &b" + starttime + "&f seconds!"));
                Bukkit.getConsoleSender().sendMessage(Color.translate("&f"));
            } else if ("INVALID".equals(status)) {
                Bukkit.getConsoleSender().sendMessage(Color.translate("&f"));
                Bukkit.getConsoleSender().sendMessage(Color.translate("&fDear, &bN/A&f!"));
                Bukkit.getConsoleSender().sendMessage(Color.translate("&fYour license is &c" + status + " &7&o(" + licenseKey + ")"));
                Bukkit.getConsoleSender().sendMessage(Color.translate("&fFor support join &bour discord &fserver &b" + discordlink));
                Bukkit.getConsoleSender().sendMessage(Color.translate("&f"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDisable() {
        Bukkit.getConsoleSender().sendMessage("&cDisabling " + pluginname + "..");
    }

    private static String readUrl(String url) throws IOException {
        try (Scanner scanner = new Scanner(new URL(url).openStream(), String.valueOf(StandardCharsets.UTF_8))) {
            scanner.useDelimiter("\\A");
            return scanner.next();
        }
    }

    public static Main getInstance() {
        return instance;
    }
}
