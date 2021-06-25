const chalk = require('chalk');

class Logger {

    warn(msg) {
        console.log(chalk.yellow(msg));
    }

    error(msg) {
        console.log(chalk.red(msg));
    }

    info(msg) {
        console.log(chalk.green(msg));
    }

}
module.exports = new Logger();
