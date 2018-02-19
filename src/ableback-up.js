module.exports = function AbleBackUp(){
  const path = require('path');
  const fs = require('fs');
  const debug = require('debug')("ablebackup");
  const glob = require('glob');
  const chokidar = require('chokidar');
  const Ableton = require('ableton');
  const $ = require('cheerio');
  const projectMetaBuilder = require('./project-meta-builder');

  let abu = {};

  abu.projects = {};

  // this will run after we watch our folders, we'll get all the files that match
  // to feed to AbleBackUp.createProjectMetadata
  abu.buildProjectsMetaData = function(pwds){
    debug("starting to build our metadata...");
    for(let pwdIndex in pwds){
      let pwd = pwds[pwdIndex];
      glob(pwd, abu.buildProjectsDelegate);
    }
  };

  abu.buildProjectsDelegate = function(error, projectFilepaths){
    if(error){
      debug("an error occured...", error);
      return false;
    }
    let filepathsCopy = [...projectFilepaths];
    let loop = function(){
      let filepath = filepathsCopy.shift();
      if(typeof filepath === "undefined"){
        debug("finished");
        return;
      }
      let project = new Ableton(filepath);
      project.read(function(error, $){
        if(error){
          debug("an error occured trying to read project", error);
          return;
        }
        abu.createProjectMetadata(filepath, $, loop);
      });
    };
    loop();
  };
  
  // function that will read the cheerio output from ableton.read
  // and import that to our metadata
  abu.createProjectMetadata = function(projectFilepath, projectXML, cb){
    cb = cb || function(){};
    debug("starting to create project metadata for project path", projectFilepath);
    let metadata = projectMetaBuilder(projectXML, cb);
    let basename = path.basename(projectFilepath);
    abu.projects[basename] = metadata;
    debug(abu.projects);
  };

  // this will create the xml file for the specified project
  abu.createDiff = function(projectFilepath, cb){
    cb = cb || function(){};
    let project = new Ableton(projectFilepath);
    debug("trying to read", projectFilepath);
    project.read(function(error, $){
      if(error){
        debug("cannot read project data, exiting createDiff", error);
        return;
      }
      let diffFile = path.basename(projectFilepath, '.als') + "-backup.xml";
      let fullFilePath = path.join(path.dirname(projectFilepath), diffFile);
      fs.writeFile(fullFilePath, $.xml(), function(error){
        if(error){
          debug("an error occured writing backup file", error);
        }
        debug("WRITING FILE");
        cb();
        return true;
      });
    });
  };

  // this will iterate through the array of project file paths
  // and run AbleBackUp.createDiff on each
  abu.createDiffDelegate = function(projectFilepaths, cb){

  };

  // this will take a backup project xml file and restore it to the .als file it should be
  abu.revertDiff = function(projectBackupFilepath, cb){
    debug("starting reversion of file:", projectBackupFilepath);
    cb = cb || function(){};
    
    let backupRestoreFile = path.basename(projectBackupFilepath, "-backup.xml") + ".als";
    let backupRestorePath = path.join(path.dirname(projectBackupFilepath), backupRestoreFile);
    let ableton = new Ableton(backupRestorePath);
    fs.readFile(projectBackupFilepath, 'utf-8', function(error, data){
      debug(data, backupRestorePath);
      ableton.write(data, function(error){
        debug(error);
        cb();
      });
    });
  };  

  // this will iterate through the array of backups 
  // and run AbleBackUp.revertDiff on each
  abu.revertDelegate = function(projectBackupFilepaths, cb){
    debug("REVERT DELEGATE");
    let filesCopy = projectBackupFilepaths.slice();
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

  // this will run upon each file change event
  abu.watchDelegate = function(event, filepath){
    debug("fired watch event");
    abu.createDiff(filepath);
  };

  // this will start to watch the specified project folders
  abu.watchFolders = function(pwds){
    if(!Array.isArray(pwds)){
      pwds = [pwds];
    }
    let watchPaths = [];
    for(let pathIndex in pwds){
      let pattern = '**/*.als';
      let thisFilepath = pwds[pathIndex];
      let watchPath = path.join(thisFilepath, pattern);
      watchPaths.push(watchPath);
    }
    abu.watching = chokidar.watch(watchPaths, {
      ignored: '!*.als',
      persistent: true,
      ignoreInitial: true,
    });
    abu.watching.on('all', abu.watchDelegate);
    debug("now watching folders:", watchPaths);
    abu.buildProjectsMetaData(watchPaths);
  };

  let init = function(){
    debug("initializing AbletonBackUp");
    return abu;
  };

  return init();
};