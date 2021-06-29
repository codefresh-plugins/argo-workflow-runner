const argoApi = require('./src/argo.api');
const config = require('./src/infra/configuration');
const logger = require('./src/infra/logger');
const envExporter = require('./src/infra/env-exporter');
const util = require('./src/util');

async function exec() {
    if (!config.argoHost) {
        logger.error("Argo Host should be specified")
        return process.exit(1);
    }

    const host = util.getHost(config.argoHost);

    const workflow = util.getWorkflow(config.workflow);

    const workflowName = await argoApi.submitWorkflow({
        namespace: config.namespace,
        ...workflow
    }, host);
    if(!workflowName) {
        return process.exit(1);
    }
    argoApi.listenLogs(workflowName, host);
    if (config.stepName) {
        const link = `${host}/workflows/argo/${workflowName}`;
        logger.info(`Export "CF_OUTPUT_URL=${link}" variable to show external link`);
        await envExporter.export(`${config.stepName}_CF_OUTPUT_URL`, link);
    }
}

exec();
