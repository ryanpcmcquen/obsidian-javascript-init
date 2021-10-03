import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";

interface CustomJavaScriptPluginSettings {
    code: string;
}

const DEFAULT_SETTINGS: CustomJavaScriptPluginSettings = {
    code: "",
};

export default class CustomJavaScriptPlugin extends Plugin {
    settings: CustomJavaScriptPluginSettings;

    runCode() {
        const source = String(this.settings.code);
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

        // this.addStatusBarItem().setText("Status Bar Text");

        this.addCommand({
            id: "run-custom-javascript",
            name: "Run Custom JavaScript",
            callback: () => {
                this.runCode();
            },
            // checkCallback: (checking: boolean) => {
            //     let leaf = this.app.workspace.activeLeaf;
            //     if (leaf) {
            //         if (!checking) {
            //         }
            //         return true;
            //     }
            //     return false;
            // },
        });

        this.addSettingTab(new CustomJavaScriptSettingTab(this.app, this));

        // this.registerCodeMirror((cm: CodeMirror.Editor) => {
        //     console.log("codemirror", cm);
        // });

        // this.registerDomEvent(document, "click", (evt: MouseEvent) => {
        //     console.log("click", evt);
        // });

        // this.registerInterval(
        //     window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
        // );
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
            .addText((text) =>
                text
                    .setPlaceholder("Sweet code here ...")
                    .setValue("")
                    .onChange(async (value) => {
                        this.plugin.settings.code = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}
