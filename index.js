const argoApi = require('./src/argo.api');
const config = require('./src/infra/configuration');
const logger = require('./src/infra/logger');
const envExporter = require('./src/infra/env-exporter');

function _fetchPayload() {
    try {
        return JSON.parse(config.workflow);
    } catch (e) {
        throw new Error('Failed to parse workflow json');
    }
}

async function exec() {
    if (!config.argoHost) {
        logger.error("Argo Host should be specified")
        return process.exit(1);
    }

    const workflow = _fetchPayload();

    const workflowName = await argoApi.submitWorkflow(workflow);
    if(!workflowName) {
        return process.exit(1);
    }
    argoApi.listenLogs(workflowName);

    if (config.stepName) {
        await envExporter.export(`${config.stepName}_CF_OUTPUT_URL`, 'google.com')
    }
}

exec();
