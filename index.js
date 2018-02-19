module.exports = require('./src/ableback-up');

/*
function AbleBackUp(){
  const path = require('path');
  const fs = require('fs');
  const debug = require('debug')("ablebackup");
  const glob = require('glob');
  const chokidar = require('chokidar');
  const Ableton = require('ableton');

  let abu = {};

  abu.createProjectMetadata = function(projectXML){
    
  };

  abu.createDiff = function(filepath, cb){
    cb = cb || function(){};
    let project = new Ableton(filepath);
    debug("trying to read", filepath);
    project.read(function(error, $){
      if(error){
        debug(error);
        return;
      }
      let diffFile = path.basename(filepath, '.als') + "-backup.xml";
      let fullFilePath = path.join(path.dirname(filepath), diffFile);
      debug(fullFilePath);
      abu.createProjectMetadata($.xml());
      fs.writeFile(fullFilePath, $.xml(), function(error){
        if(error){
          debug(error);
        }
        debug("WRITING FILE");
        return true;
      });
    });
  };

  abu.revertDiff = function(filepath, cb){
    debug("starting reversion of file:", filepath);
    cb = cb || function(){};
    
    let backupRestoreFile = path.basename(filepath, "-backup.xml") + ".als";
    let backupRestorePath = path.join(path.dirname(filepath), backupRestoreFile);
    let ableton = new Ableton(backupRestorePath);
    fs.readFile(filepath, 'utf-8', function(error, data){
      debug(data, backupRestorePath);
      ableton.write(data, function(error){
        debug(error);
        cb();
      });
    });
  };

  abu.watchDelegate = function(event, filepath){
    debug("fired watch event");
    abu.createDiff(filepath);
  };

  abu.revertDelegate = function(files, cb){
    debug("REVERT DELEGATE");
    let filesCopy = files;
    cb = cb || function(){};
    var loop = function(){
      let file = files.shift();
      debug("START REVERT", file);
      if(typeof file === 'undefined'){
        debug("WERE FINISHED");
        return cb();
      }
      abu.revertDiff(file, loop);
    };
    loop();
  };

  abu.revert = function(watchDir){
    debug("REVERTING NOW", watchDir);
    let globPattern = path.join(watchDir, '*-backup.xml');
    glob(globPattern, function(error, files){
      if(error){
        debug(error);
        return;
      }
      abu.revertDelegate(files);
    });
  };

  abu.watch = function(pwd){
    let watchPattern = path.join(pwd, "**\/*.als");
    abu.watching = chokidar.watch(watchPattern, {
      ignored: '!*.als',
      persistent: true,
      ignoreInitial: true,
    }).on('all', abu.watchDelegate);
    debug("now watching folder...")
  };

  debug("running...");
  return abu;
};

*/

var AbleBackUp = module.exports();
var watchDir = '/Users/derekcampbell/Drop/oixo Project/okaynosaj';
AbleBackUp.watchFolders(watchDir);
//bleBackUp.watch(watchDir);
//AbleBackUp.revert(watchDir);
//AbleBackUp.createProjectMetadata(watchDir+"/okaynosaj-backup.xml");