const repoName = process.env.VITE_REPO_NAME || 'prac'
const env = process.env.VITE_DEPLOY_ENV || 'prod'

base:
  env === 'dev' ? `/${repoName}/dev/` :
  env === 'uat' ? `/${repoName}/uat/` :
  `/${prac}/`