import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Server,
  StdioServerTransport
} from "@modelcontextprotocol/sdk";
import axios from "axios";

const HOSTNAME = process.env.ONETRUST_HOSTNAME;
const TOKEN = process.env.ONETRUST_TOKEN;

if (!HOSTNAME || !TOKEN) {
  console.error("Missing ONETRUST_HOSTNAME or ONETRUST_TOKEN environment variables.");
  process.exit(1);
}

const client = axios.create({
  baseURL: `https://${HOSTNAME}/api/custom-entity`,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json"
  }
});

const server = new Server({ name: "onetrust-mcp-server" });

const TOOLS = {
  create_project: {
    name: "create_project",
    description: "Create a new Project object in OneTrust",
    input_schema: {
      type: "object",
      properties: {
        project: { type: "object", description: "Project payload as defined by OneTrust API" }
      },
      required: ["project"]
    }
  },
  get_project: {
    name: "get_project",
    description: "Retrieve a Project by its identifier",
    input_schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"]
    }
  },
  update_project: {
    name: "update_project",
    description: "Update an existing Project",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        project: { type: "object" }
      },
      required: ["id", "project"]
    }
  },
  delete_project: {
    name: "delete_project",
    description: "Delete a Project",
    input_schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"]
    }
  },
  create_task: {
    name: "create_task",
    description: "Create a new Task for a Project or other object",
    input_schema: {
      type: "object",
      properties: {
        task: { type: "object", description: "Task payload as defined by OneTrust API" }
      },
      required: ["task"]
    }
  },
  get_task: {
    name: "get_task",
    description: "Retrieve a Task by its identifier",
    input_schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"]
    }
  },
  update_task: {
    name: "update_task",
    description: "Update an existing Task",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        task: { type: "object" }
      },
      required: ["id", "task"]
    }
  }
};

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: Object.values(TOOLS)
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "create_project": {
      const response = await client.post("/v1/projects", args.project);
      return response.data;
    }
    case "get_project": {
      const response = await client.get(`/v1/projects/${args.id}`);
      return response.data;
    }
    case "update_project": {
      const response = await client.put(`/v1/projects/${args.id}`, args.project);
      return response.data;
    }
    case "delete_project": {
      const response = await client.delete(`/v1/projects/${args.id}`);
      return response.data;
    }
    case "create_task": {
      const response = await client.post(`/v1/tasks`, args.task);
      return response.data;
    }
    case "get_task": {
      const response = await client.get(`/v1/tasks/${args.id}`);
      return response.data;
    }
    case "update_task": {
      const response = await client.put(`/v1/tasks/${args.id}`, args.task);
      return response.data;
    }
    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  }
});

server.onerror = (error) => {
  console.error(error);
};

process.on("SIGINT", async () => {
  await server.close();
  process.exit(0);
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("OneTrust MCP server running on stdio");
}

run().catch((err) => {
  console.error("Fatal error running server:", err);
  process.exit(1);
});
