const argoApi = require('./src/argo.api');
const config = require('./src/infra/configuration');
const logger = require('./src/infra/logger');
const envExporter = require('./src/infra/env-exporter');

async function exec() {
    if (!config.argoHost) {
        logger.error("Argo Host should be specified")
        return process.exit(1);
    }

    const workflowName = await argoApi.submitWorkflow(config.workflow);
    if(!workflowName) {
        return process.exit(1);
    }
    argoApi.listenLogs(workflowName);

    if (config.stepName) {
        await envExporter.export(`${config.stepName}_CF_OUTPUT_URL`, 'google.com')
    }
}

exec();
