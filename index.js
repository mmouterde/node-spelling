const child_process = require('child_process');
const Promise = require('bluebird');
const BlueBirdQueue = require('bluebird-queue');
let currentSpeller;
let currentResolveFn;

const queue = new BlueBirdQueue({
    concurrency: 1
});

function startProcess(enableEcho) {

    //avoid to run several spelling service
    if (currentSpeller) {
        return Promise.resolve(currentSpeller);
    }

    //run a new spelling service
    const startProcessPromise = new Promise(function (resolve, reject) {

        const args = ['-jar', __dirname + '/target/spellchecker-1.0-SNAPSHOT-jar-with-dependencies.jar'];
        if (enableEcho) {
            args.push('--echo');
        }
        const speller = child_process.spawn('java', args);

        speller.stdout.on('data', function (data) {
            const response = data.toString().trim();
            if (!currentSpeller) {
                if (response === "OK") {
                    currentSpeller = speller;
                    console.log("spelling service started");
                    resolve();
                } else {
                    currentSpeller = null;
                    reject('failed to start spelling java process (' + response + ")");
                }
            } else if (response.length !== 0) {
                currentResolveFn(JSON.parse(response));
            }
        });

        speller.on('exit', function () {
            reset();
        });

        speller.on('error', function (err) {
            console.error(err);
            reset();
        });
        return speller;
    });

    return startProcessPromise.timeout(5000);
}

function reset() {
    currentSpeller.stdout.removeAllListeners('data');
    currentSpeller.stderr.removeAllListeners('data');
    currentSpeller.removeAllListeners('exit');
    currentSpeller = null;
}

function doCheck(textToCheck) {
    return startProcess().then(() => {
        return new Promise(function (resolve) {
            currentSpeller.stdin.write(textToCheck + "\n");
            currentResolveFn = resolve;
        });
    });
}

function check(textToCheck) {
    return new Promise((resolve, reject) => {
        queue.addNow(() => doCheck(textToCheck).then(resolve).catch(reject));
    });
}

exports.check = check;
exports.init = startProcess;