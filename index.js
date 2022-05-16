const path = require('path');
const spawn = require('cross-spawn');
const commitCache = new Map();

//get the latest commit date for the given file path
//if the file is not committed yet, return null

module.exports = {
    commitDate: function (filePath) {

        let commitDate = commitCache.get(filePath);
        if (commitDate) {
            return commitDate;
        } else {
            commitDate = null;
        }
        try {
            commitDate = new Date(parseInt(spawn.sync(
                'git',
                ['log', '-1', '--format=%at', path.basename(filePath)],
                { cwd: path.dirname(filePath) }
            ).stdout.toString('utf-8')) * 1000);
        } catch (e) {
            console.log(e);
        }
        if (commitDate) {
            commitCache.set(filePath, commitDate);
        }
        return commitDate;
    },

    clearCache: function () {
        commitCache.clear();
    }
}