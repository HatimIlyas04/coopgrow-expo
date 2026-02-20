import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function uploadToGitHub(file, folder = "uploads") {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!owner || !repo) throw new Error("Missing GITHUB_OWNER or GITHUB_REPO");

  const ext = (file.originalname.split(".").pop() || "png").toLowerCase();
  const name = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
  const path = `${folder}/${name}`;

  const content = file.buffer.toString("base64");

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `upload ${path}`,
    content,
    branch,
  });

  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`;
}
