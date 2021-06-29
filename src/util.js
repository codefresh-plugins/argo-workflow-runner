const yaml = require('js-yaml');

const fetchYamlPayload = (workflow) => {
    try {
        return yaml.load(workflow);
    } catch (e) {
        throw new Error('Failed to parse workflow yaml');
    }
};

const fetchJsonPayload = (workflow) => {
    try {
        return JSON.parse(workflow);
    } catch (e) {
        throw new Error('Failed to parse workflow json');
    }
}

module.exports = {
    getWorkflow: (workflow) => {
        try {
            return fetchJsonPayload(workflow);
        } catch (e) {
            return fetchYamlPayload(workflow);
        }
    },

    getHost: (host) => {
        const pattern = new RegExp('^https?://','i');
        const isInclude = !!pattern.test(host);
        if (isInclude) {
            return host;
        }
        return `https://${host}`;
    }
}







