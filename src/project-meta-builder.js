module.exports = function ProjectMetaBuilder(projectXML, cb){
  cb = cb || function(){};
  const debug = require('debug')("ablebackup:project-meta-builder");

  let metadata = {};
  metadata.tempo = projectXML("Ableton LiveSet MasterTrack Tempo Manual").attr('Value');
  metadata.miditracks = {};
  projectXML("Ableton LiveSet MidiTrack").each(function(i, e){
    let element = projectXML("Ableton LiveSet MidiTrack").eq(i);
    let id = element.attr('Id');
    let name = element.find('Name UserName').attr('Value') || element.find('Name EffectiveName').attr('Value');
    let miditrack = {};
    miditrack.name = name;
    miditrack.colorIndex = element.find('ColorIndex').attr('Value');
    miditrack.clips = [];
    let clips = element.find("MainSequencer ClipSlotList ClipSlot");
    clips.each(function(i,e){
      let clip = clips.eq(i);
      let isValidClip = clip.find('ClipSlot Value MidiClip').children().length > 0;
      if(!isValidClip){
        return;
      }
      let clipMeta = {};
      clipMeta.colorIndex = clip.find('ClipSlot Value ColorIndex').attr('Value');
      miditrack.clips.push(clipMeta);
    });
    miditrack.numberOfClips = miditrack.clips.length;
    metadata.miditracks[name+":"+id] = miditrack;
  }); 

  cb(metadata);

  return metadata;
};