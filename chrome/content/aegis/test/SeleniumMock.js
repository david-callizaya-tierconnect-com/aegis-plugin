/*** Selenium Recorder Mock Object ****/
aegis.editor={
    testIsRecording:true,
    toggleRecordingEnabled:function(enable){
        if(typeof enable==="undefined") {
            enable=!this.testIsRecording;
        }
        this.testIsRecording=enable;
    },
    currentTestCase:{
        commands:[],
        setCommands:function(commands){
            console.log("[setCommands]", commands);
            this.commands=commands;
        }
    },
    getTestCase:function(){
        return this.currentTestCase;
    },
    playCurrentTestCase:function(){
        console.log("[playCurrentTestCase]", arguments);
        aegis.onPlayDone(this.currentTestCase, {});
    },
    window:{
        Command:function(){}
    }
};
