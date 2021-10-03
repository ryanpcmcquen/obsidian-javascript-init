import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";

interface CustomJavaScriptPluginSettings {
    code: string;
}

const DEFAULT_SETTINGS: CustomJavaScriptPluginSettings = {
    code: "",
};

export default class CustomJavaScriptPlugin extends Plugin {
    settings: CustomJavaScriptPluginSettings;

    runCode(code = this.settings.code) {
        const source = String(code);
        const appendedScript = document.createElement("script");
        appendedScript.textContent = source;
        (document.head || document.documentElement).appendChild(appendedScript);
    }

    async onload() {
        console.log("Loading Custom JavaScript plugin ...");

        await this.loadSettings();

        this.addRibbonIcon("dice", "Custom JavaScript Plugin", () => {
            this.runCode();
        });

        this.addCommand({
            id: "run-custom-javascript",
            name: "Run Custom JavaScript",
            callback: () => {
                this.runCode();
            },
        });

        this.addSettingTab(new CustomJavaScriptSettingTab(this.app, this));

        console.log(this.settings);
        this
            .runCode
            // `document.addEventListener("DOMContentLoaded", () => { ${this.settings.code}; });`
            ();
    }

    onunload() {
        console.log("Unloading Custom JavaScript plugin ...");
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

class CustomJavaScriptSettingTab extends PluginSettingTab {
    plugin: CustomJavaScriptPlugin;

    constructor(app: App, plugin: CustomJavaScriptPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        containerEl.createEl("h2", { text: "Custom JavaScript Settings." });

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
