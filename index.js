import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors(
    corsOrigin
      ? { origin: corsOrigin.split(",").map((s) => s.trim()) }
      : undefined,
  ),
);

// Middleware to log every API call
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});
app.use(express.json());

// Base accounts template (10 accounts) used to generate per-customer data
const baseAccounts = [
  {
    account_id: 1,
    account_label: "Cash",
    name: "Operating Cash",
    amount: 50000,
    tagging_results: [
      {
        id: 11,
        accountId: 1,
        tag_category: "Asset",
        tagging_model: "J11",
        confidence_score: 0.95,
        taggedAt: "2025-08-01T10:30:00Z",
        reviewedTag: {
          id: 201,
          reviewedAt: "2025-08-02T14:20:00Z",
          isAccepted: true,
          reviewer: {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
          },
        },
      },
      {
        id: 12,
        accountId: 1,
        tag_category: "Asset",
        tagging_model: "GEMINI",
        confidence_score: 0.9,
        taggedAt: "2025-08-01T10:32:00Z",
        reviewedTag: {
          id: 202,
          reviewedAt: "2025-08-02T15:05:00Z",
          isAccepted: false,
          feedback: {
            notes: "Please double-check classification",
            date: "2025-08-02T15:05:00Z",
          },
          reviewer: {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
          },
        },
      },
      {
        id: 13,
        accountId: 1,
        tag_category: "Asset",
        tagging_model: "Manual",
        confidence_score: 0.88,
        taggedAt: "2025-08-01T10:35:00Z",
        reviewedTag: null,
      },
    ],
  },
  {
    account_id: 2,
    account_label: "Accounts Receivable",
    name: "Customer Receivables",
    amount: 75000,
    tagging_results: [
      {
        id: 21,
        accountId: 2,
        tag_category: "Asset",
        tagging_model: "J11",
        confidence_score: 0.92,
        taggedAt: "2025-08-01T11:15:00Z",
        reviewedTag: {
          id: 203,
          reviewedAt: "2025-08-02T15:10:00Z",
          isAccepted: true,
          reviewer: {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
          },
        },
      },
      {
        id: 22,
        accountId: 2,
        tag_category: "Asset",
        tagging_model: "GEMINI",
        confidence_score: 0.89,
        taggedAt: "2025-08-01T11:17:00Z",
        reviewedTag: null,
      },
      {
        id: 23,
        accountId: 2,
        tag_category: "Asset",
        tagging_model: "Manual",
        confidence_score: 0.87,
        taggedAt: "2025-08-01T11:20:00Z",
        reviewedTag: null,
      },
    ],
  },
  {
    account_id: 3,
    account_label: "Inventory",
    name: "Product Inventory",
    amount: 120000,
    tagging_results: [
      {
        id: 31,
        accountId: 3,
        tag_category: "Asset",
        tagging_model: "J11",
        confidence_score: 0.91,
        taggedAt: "2025-08-01T12:00:00Z",
        reviewedTag: null,
      },
      {
        id: 32,
        accountId: 3,
        tag_category: "Asset",
        tagging_model: "GEMINI",
        confidence_score: 0.89,
        taggedAt: "2025-08-01T12:02:00Z",
        reviewedTag: {
          id: 205,
          reviewedAt: "2025-08-02T16:30:00Z",
          isAccepted: true,
          reviewer: {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
          },
        },
      },
      {
        id: 33,
        accountId: 3,
        tag_category: "Asset",
        tagging_model: "Manual",
        confidence_score: 0.86,
        taggedAt: "2025-08-01T12:05:00Z",
        reviewedTag: null,
      },
    ],
  },
  {
    account_id: 4,
    account_label: "Accounts Payable",
    name: "Vendor Payables",
    amount: 45000,
    tagging_results: [
      {
        id: 41,
        accountId: 4,
        tag_category: "Liability",
        tagging_model: "J11",
        confidence_score: 0.94,
        taggedAt: "2025-08-01T13:30:00Z",
        reviewedTag: null,
      },
      {
        id: 42,
        accountId: 4,
        tag_category: "Liability",
        tagging_model: "GEMINI",
        confidence_score: 0.9,
        taggedAt: "2025-08-01T13:32:00Z",
        reviewedTag: null,
      },
      {
        id: 43,
        accountId: 4,
        tag_category: "Liability",
        tagging_model: "Manual",
        confidence_score: 0.87,
        taggedAt: "2025-08-01T13:35:00Z",
        reviewedTag: null,
      },
    ],
  },
  {
    account_id: 5,
    account_label: "Revenue",
    name: "Sales Revenue",
    amount: 250000,
    tagging_results: [
      {
        id: 51,
        accountId: 5,
        tag_category: "Income",
        tagging_model: "J11",
        confidence_score: 0.97,
        taggedAt: "2025-08-01T14:45:00Z",
        reviewedTag: {
          id: 207,
          reviewedAt: "2025-08-02T16:30:00Z",
          isAccepted: true,
          reviewer: {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
          },
        },
      },
      {
        id: 52,
        accountId: 5,
        tag_category: "Income",
        tagging_model: "GEMINI",
        confidence_score: 0.94,
        taggedAt: "2025-08-01T14:47:00Z",
        reviewedTag: null,
      },
      {
        id: 53,
        accountId: 5,
        tag_category: "Income",
        tagging_model: "Manual",
        confidence_score: 0.9,
        taggedAt: "2025-08-01T14:50:00Z",
        reviewedTag: {
          id: 208,
          reviewedAt: "2025-08-03T10:00:00Z",
          isAccepted: false,
          feedback: {
            notes: "Verify revenue recognition period",
            date: "2025-08-03T10:00:00Z",
          },
          reviewer: {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
          },
        },
      },
    ],
  },
  {
    account_id: 6,
    account_label: "Cost of Goods Sold",
    name: "COGS",
    amount: 150000,
    tagging_results: [
      {
        id: 61,
        accountId: 6,
        tag_category: "Expense",
        tagging_model: "J11",
        confidence_score: 0.91,
        taggedAt: "2025-08-01T15:20:00Z",
        reviewedTag: null,
      },
      {
        id: 62,
        accountId: 6,
        tag_category: "Expense",
        tagging_model: "GEMINI",
        confidence_score: 0.89,
        taggedAt: "2025-08-01T15:23:00Z",
        reviewedTag: null,
      },
      {
        id: 63,
        accountId: 6,
        tag_category: "Expense",
        tagging_model: "Manual",
        confidence_score: 0.86,
        taggedAt: "2025-08-01T15:26:00Z",
        reviewedTag: null,
      },
    ],
  },
  {
    account_id: 7,
    account_label: "Salaries Expense",
    name: "Employee Salaries",
    amount: 180000,
    tagging_results: [],
  },
  {
    account_id: 8,
    account_label: "Rent Expense",
    name: "Office Rent",
    amount: 35000,
    tagging_results: [
      {
        id: 81,
        accountId: 8,
        tag_category: "Expense",
        tagging_model: "J11",
        confidence_score: 0.93,
        taggedAt: "2025-08-01T17:00:00Z",
        reviewedTag: null,
      },
      {
        id: 82,
        accountId: 8,
        tag_category: "Expense",
        tagging_model: "GEMINI",
        confidence_score: 0.9,
        taggedAt: "2025-08-01T17:03:00Z",
        reviewedTag: null,
      },
      {
        id: 83,
        accountId: 8,
        tag_category: "Expense",
        tagging_model: "Manual",
        confidence_score: 0.86,
        taggedAt: "2025-08-01T17:06:00Z",
        reviewedTag: null,
      },
    ],
  },
  {
    account_id: 9,
    account_label: "Utilities Expense",
    name: "Office Utilities",
    amount: 8000,
    tagging_results: [
      {
        id: 91,
        accountId: 9,
        tag_category: "Expense",
        tagging_model: "J11",
        confidence_score: 0.9,
        taggedAt: "2025-08-01T17:30:00Z",
        reviewedTag: null,
      },
      {
        id: 92,
        accountId: 9,
        tag_category: "Expense",
        tagging_model: "GEMINI",
        confidence_score: 0.88,
        taggedAt: "2025-08-01T17:32:00Z",
        reviewedTag: null,
      },
      {
        id: 93,
        accountId: 9,
        tag_category: "Expense",
        tagging_model: "Manual",
        confidence_score: 0.85,
        taggedAt: "2025-08-01T17:35:00Z",
        reviewedTag: null,
      },
    ],
  },
  {
    account_id: 10,
    account_label: "Long-term Debt",
    name: "Bank Loan",
    amount: 300000,
    tagging_results: [
      {
        id: 101,
        accountId: 10,
        tag_category: "Liability",
        tagging_model: "J11",
        confidence_score: 0.95,
        taggedAt: "2025-08-01T18:00:00Z",
        reviewedTag: null,
      },
      {
        id: 102,
        accountId: 10,
        tag_category: "Liability",
        tagging_model: "GEMINI",
        confidence_score: 0.92,
        taggedAt: "2025-08-01T18:03:00Z",
        reviewedTag: null,
      },
      {
        id: 103,
        accountId: 10,
        tag_category: "Liability",
        tagging_model: "Manual",
        confidence_score: 0.9,
        taggedAt: "2025-08-01T18:06:00Z",
        reviewedTag: null,
      },
    ],
  },
];

// Utility to deep clone objects
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Generate 10 customers, each with 10 accounts derived from baseAccounts
// Ensure unique account and tag IDs across customers
const CUSTOMER_COUNT = 10;
const ACCOUNT_ID_OFFSET = 100; // leave gap per customer to avoid collisions
const TAG_ID_OFFSET = 1000;

const customers = Array.from({ length: CUSTOMER_COUNT }, (_, i) => {
  const customerId = i + 1;
  const customerName = `Customer ${customerId}`;

  const accounts = deepClone(baseAccounts).map((acct) => {
    const newAccountId = customerId * ACCOUNT_ID_OFFSET + acct.account_id;
    const tagging_results = (acct.tagging_results || []).map((t) => ({
      ...t,
      id: customerId * TAG_ID_OFFSET + t.id,
      accountId: newAccountId,
      reviewedTag: t.reviewedTag
        ? {
            ...t.reviewedTag,
            id: customerId * TAG_ID_OFFSET + t.reviewedTag.id,
          }
        : null,
    }));

    return {
      ...acct,
      account_id: newAccountId,
      tagging_results,
      customerId,
    };
  });

  return {
    id: customerId,
    name: customerName,
    accounts,
  };
});

// Flattened accounts across all customers for existing endpoints
const accounts = customers.flatMap((c) => c.accounts);

function findTag(accountIdParam, tagIdParam) {
  const accountId = Number(accountIdParam);
  const tagId = Number(tagIdParam);
  const account = accounts.find((a) => a.account_id === accountId);
  if (!account) return { account: null, tag: null };
  const tag = (account.tagging_results || []).find((t) => t.id === tagId);
  return { account, tag };
}

// Individual endpoints for each data section
app.get("/api/users", (req, res) => {
  res.json([
    {
      id: "1",
      email: "john.doe@example.com",
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=john.doe@example.com",
      role: "admin",
      permissions: [
        "view:accounts",
        "edit:accounts",
        "approve:tags",
        "manage:users",
        "view:reports",
      ],
      lastLogin: "2025-08-06T14:30:00Z",
    },
    {
      id: "2",
      email: "jane.smith@example.com",
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?u=jane.smith@example.com",
      role: "manager",
      permissions: [
        "view:accounts",
        "edit:accounts",
        "approve:tags",
        "view:reports",
      ],
      lastLogin: "2025-08-05T10:15:00Z",
    },
    {
      id: "3",
      email: "michael.johnson@example.com",
      name: "Michael Johnson",
      avatar: "https://i.pravatar.cc/150?u=michael.johnson@example.com",
      role: "accountant",
      permissions: ["view:accounts", "edit:accounts", "approve:tags"],
      lastLogin: "2025-08-04T09:20:00Z",
    },
    {
      id: "4",
      email: "sarah.williams@example.com",
      name: "Sarah Williams",
      avatar: "https://i.pravatar.cc/150?u=sarah.williams@example.com",
      role: "viewer",
      permissions: ["view:accounts"],
      lastLogin: "2025-08-03T16:45:00Z",
    },
  ]);
});

app.get("/api/users/me", (req, res) => {
  res.json({
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?u=john.doe@example.com",
    role: "admin",
    permissions: [
      "view:accounts",
      "edit:accounts",
      "approve:tags",
      "manage:users",
      "view:reports",
    ],
    lastLogin: "2025-08-06T14:30:00Z",
  });
});

app.get("/api/accounts", (req, res) => {
  res.json(accounts);
});

// Customers list
app.get("/api/customers", (req, res) => {
  // Optionally return without heavy tagging details by summarizing
  const summary = customers.map((c) => ({
    id: c.id,
    name: c.name,
    industry: c.industry,
    accountCount: c.accounts.length,
    accounts: c.accounts,
    totalAmount: c.accounts.reduce((sum, a) => sum + (a.amount || 0), 0),
  }));
  res.json(summary);
});

// Get accounts for a specific customer
app.get("/api/customers/:customerId/accounts", (req, res) => {
  const customerId = Number(req.params.customerId);
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.json(customer.accounts);
});

// Update review result (approve/fail) for a tag
app.post("/api/accounts/:accountId/tag/:tagId", (req, res) => {
  const { accountId, tagId } = req.params;
  const { result } = req.body || {};
  if (typeof result !== "boolean") {
    return res
      .status(400)
      .json({ error: "Body must include { result: boolean }" });
  }

  const { account, tag } = findTag(accountId, tagId);
  if (!account || !tag) {
    return res.status(404).json({ error: "Account or tag not found" });
  }

  const now = new Date().toISOString();
  tag.reviewedTag = {
    ...(tag.reviewedTag || {}),
    id: tag.reviewedTag?.id || Math.floor(Math.random() * 100000) + 1000,
    isAccepted: result,
    reviewedAt: now,
    reviewer: tag.reviewedTag?.reviewer || {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    },
  };

  return res.json({ success: true, accountId: account.account_id, tag });
});

// Add feedback note for a tag
app.post("/api/accounts/:accountId/tag/:tagId/feedback", (req, res) => {
  const { accountId, tagId } = req.params;
  const { note } = req.body || {};
  if (!note || typeof note !== "string") {
    return res
      .status(400)
      .json({ error: "Body must include { note: string }" });
  }

  const { account, tag } = findTag(accountId, tagId);
  if (!account || !tag) {
    return res.status(404).json({ error: "Account or tag not found" });
  }

  const now = new Date().toISOString();
  tag.reviewedTag = {
    ...(tag.reviewedTag || {}),
    id: tag.reviewedTag?.id || Math.floor(Math.random() * 100000) + 1000,
    reviewedAt: tag.reviewedTag?.reviewedAt || now,
    feedback: { notes: note, date: now },
    reviewer: tag.reviewedTag?.reviewer || {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    },
  };

  return res.json({ success: true, accountId: account.account_id, tag });
});

app.get("/api/auth", (req, res) => {
  res.json({
    google: {
      callback: {
        user: {
          id: "1",
          email: "john.doe@example.com",
          name: "John Doe",
          avatar: "https://i.pravatar.cc/150?u=john.doe@example.com",
          role: "admin",
          permissions: [
            "view:accounts",
            "edit:accounts",
            "approve:tags",
            "manage:users",
            "view:reports",
          ],
          lastLogin: "2025-08-06T14:30:00Z",
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjI1NjQ0MDAwLCJleHAiOjE2MjU3MzA0MDB9.5toGyhg1_fBixlpkxL1-C4_Fwgg-AY0xb_hKkh_lWHQ",
      },
    },
  });
});

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("OOk");
});

// Time endpoint
app.get("/time", (req, res) => {
  const currentTime = new Date().toISOString();
  res.json({ time: currentTime });
});

// Envs endpoint
app.get("/envs", (req, res) => {
  res.json(process.env);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
