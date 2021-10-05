import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

type JavaScriptInitPluginSettings = {
    code: string;
};

const DEFAULT_SETTINGS: JavaScriptInitPluginSettings = {
    code: "",
};

export default class JavaScriptInitPlugin extends Plugin {
    settings: JavaScriptInitPluginSettings;

    runCode(code = this.settings.code) {
        const source = String(code);
        const appendedScript = document.createElement("script");
        appendedScript.textContent = source;
        (document.head || document.documentElement).appendChild(appendedScript);
    }

    async onload() {
        console.log("Loading JavaScript Init plugin ...");

        await this.loadSettings();

        this.addRibbonIcon("dice", "Run Init JavaScript", () => {
            this.runCode();
        });

        this.addCommand({
            id: "run-init-javascript",
            name: "Run Init JavaScript",
            callback: () => {
                this.runCode();
            },
        });

        this.addSettingTab(new JavaScriptInitSettingTab(this.app, this));

        console.log(this.settings);
        this
            .runCode
            // `document.addEventListener("DOMContentLoaded", () => { ${this.settings.code}; });`
            ();
    }

    onunload() {
        console.log("Unloading JavaScript Init plugin ...");
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class JavaScriptInitSettingTab extends PluginSettingTab {
    plugin: JavaScriptInitPlugin;

    constructor(app: App, plugin: JavaScriptInitPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        containerEl.createEl("h2", { text: "JavaScript Init Settings." });

        new Setting(containerEl)
            .setName("Code")
            .setDesc("Custom code to execute on startup or on demand.")
            .addTextArea((text) => {
                const resultant = text

                    .setPlaceholder("Sweet code here ...")
                    .setValue(this.plugin.settings.code || "")
                    .onChange(async (value) => {
                        this.plugin.settings.code = value;
                        await this.plugin.saveSettings();
                    });

                resultant.inputEl.style.fontFamily = "monospace";
                resultant.inputEl.style.width = "100%";

                return resultant;
            });
    }
}
