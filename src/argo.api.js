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

    async submitWorkflow(payload, host) {
        try {
            logger.info(`Starting submit workflow`);
            const result = await this.axiosInstance.post(`${host}/api/v1/workflows/argo`, payload);
            return result.data.metadata.name;
        } catch (error) {
            if (error.response && error.response.data) {
                logger.error(`Submit workflow failed with error : "${error.response.data.message}"`);
            } else {
                logger.error(`Submit workflow failed with error : "${error.message}"`);
            }
        }
    }

    listenLogs(name, host) {
        logger.info(`Workflow "${name}" logs`);

        const events = new EventSource(`${host}/api/v1/workflows/argo/${name}/log?logOptions.container=main&logOptions.follow=true`, { https: { rejectUnauthorized: false } });

        events.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            logger.plain(parsedData.result.content);
        };

        events.onerror = function (err) {
            if (err) {
                if (err.status === 401 || err.status === 403) {
                    logger.error(`Failed to listen events, not authorized`);
                } else if (err.message) {
                    logger.error(err.message);
                }
                events.close();
            }
        };
    }

}
module.exports = new ArgoApi();
