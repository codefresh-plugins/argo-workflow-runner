module.exports = {
    argoHost: process.env.ARGO_HOST || 'https://localhost:2746',
    workflow: process.env.WORKFLOW,
    stepName: process.env.STEP_NAME,
    namespace: process.env.NAMESPACE || 'argo'
}
