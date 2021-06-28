const argoApi = require('./src/argo.api');
const config = require('./src/infra/configuration');
const logger = require('./src/infra/logger');
const envExporter = require('./src/infra/env-exporter');
const yaml = require('js-yaml')

function _fetchYamlPayload() {
    try {
        return yaml.load(config.workflow);
    } catch (e) {
        throw new Error('Failed to parse workflow yaml');
    }
}

function _fetchJsonPayload() {
    try {
        return JSON.parse(config.workflow);
    } catch (e) {
        throw new Error('Failed to parse workflow json');
    }
}

function getWorkflow() {
    try {
        return _fetchJsonPayload();
    } catch (e) {
        return _fetchYamlPayload();
    }
}

async function exec() {
    if (!config.argoHost) {
        logger.error("Argo Host should be specified")
        return process.exit(1);
    }

    const workflow = getWorkflow();

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
