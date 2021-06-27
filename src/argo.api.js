const axios = require('axios');
const https = require('https');
const EventSource = require('eventsource');

const logger = require('./infra/logger');
const config = require('./infra/configuration');

class ArgoApi {

    constructor() {
        this.axiosInstance = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
    }

    async submitWorkflow(payload) {
        try {
            logger.info(`Start submit workflow in ${config.argoHost} argo, payload ${JSON.stringify(payload)}`);
            const result = await this.axiosInstance.post(`${config.argoHost}/api/v1/workflows/argo`, payload);
            return result.data.metadata.name;
        } catch (error) {
            if (error.response && error.response.data) {
                logger.error(`Submit workflow failed with error : "${error.response.data.message}"`);
            } else {
                logger.error(`Submit workflow failed with error : "${error.message}"`);
            }
        }
    }

    listenLogs(name) {
        logger.info(`Start listen logs for workflow ${name}`);

        const events = new EventSource(`${config.argoHost}/api/v1/workflows/argo/${name}/log?logOptions.container=main&logOptions.follow=true`, { https: { rejectUnauthorized: false } });

        events.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            logger.plain(parsedData.result.content);
        };

        events.onerror = function (err) {
            if (err) {
                if (err.status === 401 || err.status === 403) {
                    logger.error(`Failed to listen events, not authorized`);
                }
                logger.error(err.message);
            }
        };
    }

}
module.exports = new ArgoApi();


