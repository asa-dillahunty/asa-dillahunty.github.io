const directory = "./";
const fs = require('fs');
const path = require('path');
const validator = require('html-validator');

function getHTMLFiles(pathList, directory) {
    fs.readdirSync(directory).forEach(file => {
        let ignoreDirectories = [".git","node_modules","inProgress"]
        if (ignoreDirectories.includes( file ) ) return;

        if (fs.lstatSync(path.resolve(directory, file)).isDirectory()) {
            // console.log(directory+file);
            if (directory == './') getHTMLFiles(pathList, directory+file);
            else getHTMLFiles(pathList, directory+'/'+file);
        } else {
            if (file.length > 5 && file.substring(file.length - 5) == ".html") {
                if (directory == './') pathList.push(directory+file);
                else pathList.push(directory+'/'+file);
            }
        }
    });
}

async function testHTML(filePath) {
    const options = {
      data: fs.readFileSync(filePath, 'utf8'),
    }
    
    try {
      const result = await validator(options)
      return JSON.parse(result);
    } catch (error) {
        return error;
    }
}

async function testAllHTML() {
    pathList=[];
    getHTMLFiles(pathList, directory);

    describe('HTML Validation', function() {
        pathList.forEach((filePath) => {
            describe(filePath, function() {
                it('should validate without error', (done) => {
                    var prom = testHTML(filePath)
                    this.timeout(10000); // ten seconds to complete the job
                    prom.then((err) => {
                        if (err["messages"].length > 0) done(err);
                        else done();
                    });
                });
            });
        });
    });
}

testAllHTML()