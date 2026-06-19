import type { PluginModule } from "@opencode-ai/plugin";

const MyCommandsPlugin: PluginModule = {
  id: "my-commands",
  server: async () => {
    return {};
  },
};

export default MyCommandsPlugin;
